'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useWebGLBlur } from '@/hooks/useWebGLBlur';
import type { EyePosition } from '@/types';

interface CameraCanvasProps {
	video: HTMLVideoElement | null;
	leftEye: EyePosition;
	rightEye: EyePosition;
	lensActive: boolean;
	faceDetected: boolean;
}

export default function CameraCanvas({ video, leftEye, rightEye, lensActive, faceDetected }: CameraCanvasProps) {
	const { canvasRef, render } = useWebGLBlur();
	const rafRef = useRef<number>(0);

	const renderLoop = useCallback(() => {
		if (video && video.readyState >= 2) {
			render(video, leftEye, rightEye, lensActive);
		}
		rafRef.current = requestAnimationFrame(renderLoop);
	}, [video, leftEye, rightEye, lensActive, render]);

	useEffect(() => {
		if (video) {
			rafRef.current = requestAnimationFrame(renderLoop);
		}
		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [video, renderLoop]);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 h-full w-full object-cover"
			style={{
				transform: 'scaleX(-1)',
				// Always show when mounted — blur shader handles the visual
				opacity: faceDetected ? 1 : 0,
				transition: 'opacity 0.3s ease',
			}}
		/>
	);
}
