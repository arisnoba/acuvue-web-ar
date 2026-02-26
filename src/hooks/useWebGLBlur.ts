'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { EyePosition, BlurConfig } from '@/types';
import { createProgram, createFullScreenQuad, createVideoTexture, createFramebuffer } from '@/utils/webgl';
import vertSource from '@/shaders/blur.vert';
import fragSource from '@/shaders/blur.frag';

interface UseWebGLBlurReturn {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	render: (video: HTMLVideoElement, leftEye: EyePosition, rightEye: EyePosition, lensActive: boolean) => void;
	dispose: () => void;
}

const DEFAULT_BLUR_CONFIG: BlurConfig = {
	enabled: true,
	amount: 8.0,
	radius: 0.18,
	fadeRange: 0.10,
};

interface GLResources {
	gl: WebGLRenderingContext;
	program: WebGLProgram;
	quadBuffer: WebGLBuffer;
	videoTexture: WebGLTexture;
	fb1: { framebuffer: WebGLFramebuffer; texture: WebGLTexture };
	fb2: { framebuffer: WebGLFramebuffer; texture: WebGLTexture };
	uniforms: Record<string, WebGLUniformLocation | null>;
	attributes: Record<string, number>;
}

export function useWebGLBlur(config: Partial<BlurConfig> = {}): UseWebGLBlurReturn {
	const mergedConfig = { ...DEFAULT_BLUR_CONFIG, ...config };
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const resourcesRef = useRef<GLResources | null>(null);

	const initGL = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || resourcesRef.current) {
			return;
		}

		const gl = canvas.getContext('webgl', {
			premultipliedAlpha: false,
			preserveDrawingBuffer: false,
			antialias: false,
		});

		if (!gl) {
			return;
		}

		const program = createProgram(gl, vertSource, fragSource);
		const quadBuffer = createFullScreenQuad(gl);
		const videoTexture = createVideoTexture(gl);

		const width = canvas.width || 640;
		const height = canvas.height || 480;
		const fb1 = createFramebuffer(gl, width, height);
		const fb2 = createFramebuffer(gl, width, height);

		const uniforms: Record<string, WebGLUniformLocation | null> = {
			u_image: gl.getUniformLocation(program, 'u_image'),
			u_resolution: gl.getUniformLocation(program, 'u_resolution'),
			u_faceCenter: gl.getUniformLocation(program, 'u_faceCenter'),
			u_faceRadius: gl.getUniformLocation(program, 'u_faceRadius'),
			u_blurAmount: gl.getUniformLocation(program, 'u_blurAmount'),
			u_fadeRange: gl.getUniformLocation(program, 'u_fadeRange'),
			u_direction: gl.getUniformLocation(program, 'u_direction'),
			u_lensActive: gl.getUniformLocation(program, 'u_lensActive'),
		};

		const attributes: Record<string, number> = {
			a_position: gl.getAttribLocation(program, 'a_position'),
			a_texCoord: gl.getAttribLocation(program, 'a_texCoord'),
		};

		resourcesRef.current = { gl, program, quadBuffer, videoTexture, fb1, fb2, uniforms, attributes };
	}, []);

	const render = useCallback(
		(video: HTMLVideoElement, leftEye: EyePosition, rightEye: EyePosition, lensActive: boolean) => {
			if (!resourcesRef.current) {
				initGL();
			}

			const res = resourcesRef.current;
			if (!res) {
				return;
			}

			const { gl, program, quadBuffer, videoTexture, fb1, uniforms, attributes } = res;
			const canvas = canvasRef.current;
			if (!canvas) {
				return;
			}

			// Resize canvas to match video
			if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				gl.viewport(0, 0, canvas.width, canvas.height);

				// Recreate framebuffers at new size
				const newFb1 = createFramebuffer(gl, canvas.width, canvas.height);
				const newFb2 = createFramebuffer(gl, canvas.width, canvas.height);
				res.fb1 = newFb1;
				res.fb2 = newFb2;
			}

			gl.useProgram(program);

			// Upload video frame as texture (flip Y so top of video = top of screen)
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, videoTexture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);

			// Set up vertex attributes
			gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
			gl.enableVertexAttribArray(attributes.a_position);
			gl.vertexAttribPointer(attributes.a_position, 2, gl.FLOAT, false, 16, 0);
			gl.enableVertexAttribArray(attributes.a_texCoord);
			gl.vertexAttribPointer(attributes.a_texCoord, 2, gl.FLOAT, false, 16, 8);

			// 얼굴 중심 계산 (양쪽 눈의 중간점)
			const faceCenterX = (leftEye.x + rightEye.x) / 2;
			const faceCenterY = (leftEye.y + rightEye.y) / 2;
			// 눈 사이 거리 기반 얼굴 반경 — 얼굴은 눈 간격의 약 1.5배
			const eyeDist = Math.sqrt(
				(rightEye.x - leftEye.x) ** 2 + (rightEye.y - leftEye.y) ** 2,
			);
			const faceRadius = Math.max(eyeDist * 1.5, mergedConfig.radius);

			gl.uniform1i(uniforms.u_image, 0);
			gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
			// MediaPipe Y좌표(0=상단)를 텍스처 UV Y좌표(0=하단)로 변환
			// X는 CSS scaleX(-1)이 이미 미러링하므로 그대로 전달
			gl.uniform2f(uniforms.u_faceCenter, faceCenterX, 1.0 - faceCenterY);
			gl.uniform1f(uniforms.u_faceRadius, faceRadius);
			gl.uniform1f(uniforms.u_blurAmount, mergedConfig.amount);
			gl.uniform1f(uniforms.u_fadeRange, mergedConfig.fadeRange);
			gl.uniform1f(uniforms.u_lensActive, lensActive ? 1.0 : 0.0);

			// Pass 1: Horizontal blur → fb1
			gl.bindFramebuffer(gl.FRAMEBUFFER, fb1.framebuffer);
			gl.uniform2f(uniforms.u_direction, 1.0, 0.0);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

			// Pass 2: Vertical blur → screen
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.bindTexture(gl.TEXTURE_2D, fb1.texture);
			gl.uniform2f(uniforms.u_direction, 0.0, 1.0);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		},
		[initGL, mergedConfig.amount, mergedConfig.radius, mergedConfig.fadeRange],
	);

	const dispose = useCallback(() => {
		const res = resourcesRef.current;
		if (!res) {
			return;
		}

		const { gl, program, quadBuffer, videoTexture, fb1, fb2 } = res;
		gl.deleteProgram(program);
		gl.deleteBuffer(quadBuffer);
		gl.deleteTexture(videoTexture);
		gl.deleteFramebuffer(fb1.framebuffer);
		gl.deleteTexture(fb1.texture);
		gl.deleteFramebuffer(fb2.framebuffer);
		gl.deleteTexture(fb2.texture);
		resourcesRef.current = null;
	}, []);

	useEffect(() => {
		return () => dispose();
	}, [dispose]);

	return { canvasRef, render, dispose };
}
