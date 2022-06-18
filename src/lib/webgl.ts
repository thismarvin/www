export type RenderingContext = WebGLRenderingContext | WebGL2RenderingContext;

export enum AttributeType {
	Byte = 5120,
	UnsignedByte = 5121,
	Short = 5122,
	UnsignedShort = 5123,
	Int = 5124,
	UnsignedInt = 5125,
	Float = 5126,
}

export enum AttributeSize {
	Byte = 1,
	UnsignedByte = 1,
	Short = 2,
	UnsignedShort = 2,
	Int = 4,
	UnsignedInt = 4,
	Float = 4,
}

export enum ShaderType {
	Fragment = 35632,
	Vertex = 35633,
}

export enum BufferUsage {
	Vertex = 34962,
	Index = 34963,
}

export enum VertexUsage {
	Stream = 35040,
	Static = 35044,
	Dynamic = 35048,
}

export enum CullFace {
	Front = 1028,
	Back = 1029,
	FrontAndBack = 1032,
}

export enum FrontFace {
	Cw = 2304,
	Ccw = 2305,
}

export enum DrawMode {
	Points = 0,
	Lines = 1,
	LineLoop = 2,
	LineStrip = 3,
	Triangles = 4,
	TriangleStrip = 5,
	TriangleFan = 6,
}

export function createProgram(
	gl: RenderingContext,
	vertexShaderSource: string,
	fragmentShaderSource: string
): WebGLProgram {
	const vertexShader = _createShader(gl, ShaderType.Vertex, vertexShaderSource);
	const fragmentShader = _createShader(
		gl,
		ShaderType.Fragment,
		fragmentShaderSource
	);

	return _createProgram(gl, vertexShader, fragmentShader);
}

export function allocateVertexBuffer(
	gl: RenderingContext,
	byteLength: number,
	usage: VertexUsage
): WebGLBuffer {
	return _allocateBuffer(gl, BufferUsage.Vertex, byteLength, usage);
}

export function setVertexBufferData(
	gl: RenderingContext,
	buffer: WebGLBuffer,
	data: BufferSource
): void {
	_setBufferData(gl, BufferUsage.Vertex, buffer, data);
}

export function allocateIndexBuffer(
	gl: RenderingContext,
	byteLength: number,
	usage: VertexUsage
): WebGLBuffer {
	return _allocateBuffer(gl, BufferUsage.Index, byteLength, usage);
}

export function setIndexBufferData(
	gl: RenderingContext,
	buffer: WebGLBuffer,
	data: BufferSource
): void {
	_setBufferData(gl, BufferUsage.Index, buffer, data);
}

export function createBufferInit(
	gl: RenderingContext,
	usage: BufferUsage,
	contents: BufferSource
): WebGLBuffer {
	switch (usage) {
		case BufferUsage.Vertex: {
			const buffer = allocateVertexBuffer(
				gl,
				contents.byteLength,
				VertexUsage.Static
			);

			setVertexBufferData(gl, buffer, contents);

			return buffer;
		}
		case BufferUsage.Index: {
			const buffer = allocateIndexBuffer(
				gl,
				contents.byteLength,
				VertexUsage.Static
			);

			setIndexBufferData(gl, buffer, contents);

			return buffer;
		}
	}
}

export function createTexture(
	gl: RenderingContext,
	width: number,
	height: number,
	pixels: Uint8Array
) {
	const texture = gl.createTexture();

	if (texture === null) {
		throw new Error("Something went wrong; could not create WebGLTexture.");
	}

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.RGBA,
		width,
		height,
		0,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		pixels
	);

	_textureMaintenance(gl, width, height);

	return texture;
}

export function createTextureFromImage(
	gl: RenderingContext,
	image: TexImageSource
): WebGLTexture {
	const texture = gl.createTexture();

	if (texture === null) {
		throw new Error("Something went wrong; could not create WebGLTexture.");
	}

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	_textureMaintenance(gl, image.width, image.height);

	return texture;
}

function _isPowerOfTwo(value: number) {
	return (value & (value - 1)) === 0;
}

function _textureMaintenance(
	gl: RenderingContext,
	width: number,
	height: number
) {
	if (_isPowerOfTwo(width) && _isPowerOfTwo(height)) {
		gl.generateMipmap(gl.TEXTURE_2D);
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	}
}

function _allocateBuffer(
	gl: RenderingContext,
	bufferUsage: BufferUsage,
	byteLength: number,
	vertexUsage: VertexUsage
): WebGLBuffer {
	const buffer = gl.createBuffer();

	if (buffer === null) {
		throw new Error("Something went wrong; could not create WebGLBuffer.");
	}

	gl.bindBuffer(bufferUsage, buffer);
	gl.bufferData(bufferUsage, byteLength, vertexUsage);

	return buffer;
}

function _setBufferData(
	gl: RenderingContext,
	usage: BufferUsage,
	buffer: WebGLBuffer,
	data: BufferSource
): void {
	gl.bindBuffer(usage, buffer);
	gl.bufferSubData(usage, 0, data);
}

function _createShader(
	gl: RenderingContext,
	type: ShaderType,
	source: string
): WebGLShader {
	const shader = gl.createShader(type);

	if (shader === null) {
		throw new TypeError(`'${type}' is not a valid WebGL shader type.`);
	}

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const error = new Error(
			`An error occurred will compiling the shader: ${gl.getShaderInfoLog(
				shader
			)}`
		);
		gl.deleteShader(shader);
		throw error;
	}

	return shader;
}

function _createProgram(
	gl: RenderingContext,
	vertexShader: WebGLShader,
	fragmentShader: WebGLShader
): WebGLProgram {
	const program = gl.createProgram();

	if (program === null) {
		throw new Error("Something went wrong; could not create WebGLProgram.");
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(
			`An error occurred while initializing the shader program: ${gl.getProgramInfoLog(
				program
			)}`
		);
	}

	return program;
}
