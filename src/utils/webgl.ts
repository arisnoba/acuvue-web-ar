/**
 * Compile a WebGL shader from source.
 */
export function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
	const shader = gl.createShader(type);
	if (!shader) {
		throw new Error('Failed to create shader');
	}

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const info = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw new Error(`Shader compilation failed: ${info}`);
	}

	return shader;
}

/**
 * Create and link a WebGL program from vertex and fragment shaders.
 */
export function createProgram(gl: WebGLRenderingContext, vertSource: string, fragSource: string): WebGLProgram {
	const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertSource);
	const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);

	const program = gl.createProgram();
	if (!program) {
		throw new Error('Failed to create program');
	}

	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const info = gl.getProgramInfoLog(program);
		gl.deleteProgram(program);
		throw new Error(`Program linking failed: ${info}`);
	}

	// Clean up individual shaders after linking
	gl.deleteShader(vertShader);
	gl.deleteShader(fragShader);

	return program;
}

/**
 * Create a full-screen quad for rendering.
 */
export function createFullScreenQuad(gl: WebGLRenderingContext): WebGLBuffer {
	const buffer = gl.createBuffer();
	if (!buffer) {
		throw new Error('Failed to create buffer');
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	// Position (x, y) + TexCoord (u, v)
	// Video has (0,0) at top-left, WebGL at bottom-left — flip V axis
	const vertices = new Float32Array([
		-1, -1, 0, 0,
		 1, -1, 1, 0,
		-1,  1, 0, 1,
		 1,  1, 1, 1,
	]);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	return buffer;
}

/**
 * Create a WebGL texture for a video source.
 */
export function createVideoTexture(gl: WebGLRenderingContext): WebGLTexture {
	const texture = gl.createTexture();
	if (!texture) {
		throw new Error('Failed to create texture');
	}

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	return texture;
}

/**
 * Create a framebuffer with attached texture for offscreen rendering.
 */
export function createFramebuffer(
	gl: WebGLRenderingContext,
	width: number,
	height: number,
): { framebuffer: WebGLFramebuffer; texture: WebGLTexture } {
	const framebuffer = gl.createFramebuffer();
	const texture = gl.createTexture();
	if (!framebuffer || !texture) {
		throw new Error('Failed to create framebuffer');
	}

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	return { framebuffer, texture };
}
