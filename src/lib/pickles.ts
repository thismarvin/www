import * as WebGL from "./webgl";
import Matrix4 from "$lib/matrix4";
import Vector3 from "$lib/vector3";
import type Color from "./color";

function _createOrthographicCamera(
	position: Vector3,
	forward: Vector3,
	up: Vector3,
	width: number,
	height: number,
	near: number,
	far: number
): Matrix4 {
	const view = Matrix4.createLookAt(
		position,
		Vector3.add(position, forward),
		up
	);
	const projection = Matrix4.createOrthographic(width, height, near, far);

	return Matrix4.multiply(view, projection);
}

const source = {
	vertex: `
	uniform mat4 camera;

	attribute vec3 a_position;
	attribute vec3 a_translation;
	attribute vec4 a_color;

	varying lowp vec4 v_color;

	void main() {
		gl_Position = camera * vec4(a_position + a_translation, 1);
		v_color = a_color;
	}
`,
	fragment: `
	varying lowp vec4 v_color;

	void main() {
		gl_FragColor = v_color;
	}
`,
};

export default class Pixels {
	public readonly canvas: HTMLCanvasElement;
	public readonly width: number;
	public readonly height: number;

	public get area(): number {
		return this.width * this.height;
	}

	readonly #gl: WebGL2RenderingContext;
	readonly #program: WebGLProgram;
	readonly #camera: Matrix4;
	readonly #vertexPositionsBuffer: WebGLBuffer;
	readonly #vertexTranslationsBuffer: WebGLBuffer;
	readonly #indexBuffer: WebGLBuffer;

	#vertexColors: Uint8Array;
	#vertexColorsBuffer: WebGLBuffer;
	#dirty: boolean;

	constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.canvas = canvas;
		this.width = width;
		this.height = height;

		const gl = canvas.getContext("webgl2");

		if (gl === null) {
			throw new TypeError("Could not get 'webgl2' context.");
		}

		this.#gl = gl;

		this.#program = WebGL.createProgram(
			this.#gl,
			source.vertex,
			source.fragment
		);

		this.#camera = _createOrthographicCamera(
			new Vector3(this.width * 0.5, -this.height * 0.5, 1),
			Vector3.FORWARD,
			Vector3.UP,
			this.width,
			this.height,
			0.125,
			8
		);

		const vertexPositions = new Int8Array([
			0, 0, 0, 0, -1, 0, 1, -1, 0, 1, 0, 0,
		]);
		const vertexTranslations = new Int16Array(this.area * 3).fill(0);
		const indices = new Uint8Array([0, 1, 2, 0, 2, 3]);

		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				const index = y * this.width + x;
				const j = index * 3;

				vertexTranslations[j + 0] = x;
				vertexTranslations[j + 1] = -y;
				vertexTranslations[j + 2] = 0;
			}
		}

		this.#vertexColors = new Uint8Array(this.area * 4).fill(0);

		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				const index = y * this.width + x;
				const j = index * 4;

				this.#vertexColors[j + 0] = 0;
				this.#vertexColors[j + 1] = 0;
				this.#vertexColors[j + 2] = 0;
				this.#vertexColors[j + 3] = 255;
			}
		}

		this.#dirty = false;

		this.#gl.useProgram(this.#program);
		{
			const location = this.#gl.getUniformLocation(this.#program, "camera");
			this.#gl.uniformMatrix4fv(location, false, this.#camera.data);
		}

		this.#vertexPositionsBuffer = WebGL.createBufferInit(
			this.#gl,
			WebGL.BufferUsage.Vertex,
			vertexPositions
		);
		{
			const index = this.#gl.getAttribLocation(this.#program, "a_position");

			this.#gl.bindBuffer(
				WebGL.BufferUsage.Vertex,
				this.#vertexPositionsBuffer
			);
			this.#gl.enableVertexAttribArray(index);
			this.#gl.vertexAttribPointer(
				index,
				3,
				WebGL.AttributeType.Byte,
				false,
				3,
				0
			);
			this.#gl.vertexAttribDivisor(index, 0);
		}

		this.#vertexTranslationsBuffer = WebGL.createBufferInit(
			this.#gl,
			WebGL.BufferUsage.Vertex,
			vertexTranslations
		);
		{
			const index = this.#gl.getAttribLocation(this.#program, "a_translation");

			this.#gl.bindBuffer(
				WebGL.BufferUsage.Vertex,
				this.#vertexTranslationsBuffer
			);
			this.#gl.enableVertexAttribArray(index);
			this.#gl.vertexAttribPointer(
				index,
				3,
				WebGL.AttributeType.Short,
				false,
				6,
				0
			);
			this.#gl.vertexAttribDivisor(index, 1);
		}

		this.#vertexColorsBuffer = WebGL.createBufferInit(
			this.#gl,
			WebGL.BufferUsage.Vertex,
			this.#vertexColors
		);
		{
			const index = this.#gl.getAttribLocation(this.#program, "a_color");

			this.#gl.bindBuffer(WebGL.BufferUsage.Vertex, this.#vertexColorsBuffer);
			this.#gl.enableVertexAttribArray(index);
			this.#gl.vertexAttribPointer(
				index,
				4,
				WebGL.AttributeType.UnsignedByte,
				true,
				4,
				0
			);
			this.#gl.vertexAttribDivisor(index, 1);
		}

		this.#indexBuffer = WebGL.createBufferInit(
			this.#gl,
			WebGL.BufferUsage.Index,
			indices
		);
		{
			this.#gl.bindBuffer(WebGL.BufferUsage.Index, this.#indexBuffer);
		}
	}

	public clear(color: Color): void {
		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				const index = y * this.width + x;
				const j = index * 4;

				this.#vertexColors[j + 0] = color.r;
				this.#vertexColors[j + 1] = color.g;
				this.#vertexColors[j + 2] = color.b;
				this.#vertexColors[j + 3] = color.a;
			}
		}

		this.#dirty = true;
	}

	public set(x: number, y: number, color: Color): void {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
			throw new Error("Index out of bounds.");
		}

		const index = y * this.width + x;
		const j = index * 4;

		this.#vertexColors[j + 0] = color.r;
		this.#vertexColors[j + 1] = color.g;
		this.#vertexColors[j + 2] = color.b;
		this.#vertexColors[j + 3] = color.a;

		this.#dirty = true;
	}

	public draw(): void {
		if (this.#dirty) {
			WebGL.setVertexBufferData(
				this.#gl,
				this.#vertexColorsBuffer,
				this.#vertexColors
			);

			this.#dirty = false;
		}

		this.#gl.drawElementsInstanced(
			WebGL.DrawMode.Triangles,
			6,
			this.#gl.UNSIGNED_BYTE,
			0,
			this.area
		);
	}
}
