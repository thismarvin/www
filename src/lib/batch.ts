import * as MathExt from "./mathExt";
import * as WebGL from "./webgl";
import type Color from "./color";
import type Matrix4 from "./matrix4";
import type Texture2D from "./texture";

const SHADER_SOURCE = {
	vertex: `
	uniform mat4 camera;

	attribute vec3 a_position;
	attribute vec2 a_texture_coord;
	attribute vec4 a_tint;
	attribute mat4 a_transform;

	varying highp vec2 v_texture_coord;
	varying lowp vec4 v_tint;

	void main() {
		gl_Position = camera * a_transform * vec4(a_position, 1);
		v_texture_coord = a_texture_coord;
		v_tint = a_tint;
	}
`,
	fragment: `
	uniform sampler2D sampler;

	varying highp vec2 v_texture_coord;
	varying lowp vec4 v_tint;

	void main() {
		gl_FragColor = texture2D(sampler, v_texture_coord) * v_tint;
	}
`,
};

export type ImageRegion = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export enum SpriteMirroring {
	FlipHorizontal = 1,
	FlipVertical = 2,
}

export type Sprite = {
	transform: Matrix4;
	region: ImageRegion;
	mirroring: SpriteMirroring | null;
	tint: Color;
};

function createTextureCoordsFromImageRegion(
	texture: Texture2D,
	imageRegion: ImageRegion,
	spriteMirroring: SpriteMirroring | null
): number[] {
	const xTopLeft = MathExt.remapRange(imageRegion.x, 0, texture.width, 0, 1);
	const yTopLeft = MathExt.remapRange(imageRegion.y, 0, texture.height, 0, 1);

	const xTopRight = xTopLeft + texture.texelWidth * imageRegion.width;
	const yTopRight = yTopLeft;
	const xBottomRight = xTopLeft + texture.texelWidth * imageRegion.width;
	const yBottomRight = yTopLeft + texture.texelHeight * imageRegion.height;
	const xBottomLeft = xTopLeft;
	const yBottomLeft = yTopLeft + texture.texelHeight * imageRegion.height;

	const array = [
		xTopLeft,
		yTopLeft,
		xBottomLeft,
		yBottomLeft,
		xBottomRight,
		yBottomRight,
		xTopRight,
		yTopRight,
	];

	if (spriteMirroring === null) {
		return array;
	}

	if ((spriteMirroring & SpriteMirroring.FlipHorizontal) !== 0) {
		// Swap top left with top right.
		{
			const a = array[0 * 2 + 0];
			const b = array[0 * 2 + 1];

			array[0 * 2 + 0] = array[3 * 2 + 0];
			array[0 * 2 + 1] = array[3 * 2 + 1];
			array[3 * 2 + 0] = a;
			array[3 * 2 + 1] = b;
		}
		// Swap bottom left with bottom right.
		{
			const a = array[1 * 2 + 0];
			const b = array[1 * 2 + 1];

			array[1 * 2 + 0] = array[2 * 2 + 0];
			array[1 * 2 + 1] = array[2 * 2 + 1];
			array[2 * 2 + 0] = a;
			array[2 * 2 + 1] = b;
		}
	}

	if ((spriteMirroring & SpriteMirroring.FlipVertical) !== 0) {
		// Swap top left with bottom left.
		{
			const a = array[0 * 2 + 0];
			const b = array[0 * 2 + 1];

			array[0 * 2 + 0] = array[1 * 2 + 0];
			array[0 * 2 + 1] = array[1 * 2 + 1];
			array[1 * 2 + 0] = a;
			array[1 * 2 + 1] = b;
		}
		// Swap top right with bottom right.
		{
			const a = array[3 * 2 + 0];
			const b = array[3 * 2 + 1];

			array[3 * 2 + 0] = array[2 * 2 + 0];
			array[3 * 2 + 1] = array[2 * 2 + 1];
			array[2 * 2 + 0] = a;
			array[2 * 2 + 1] = b;
		}
	}

	return array;
}

const VERTEX_POSITIONS = [0, 0, 0, 0, -1, 0, 1, -1, 0, 1, 0, 0];
const INDICES = [0, 1, 2, 0, 2, 3];

export default class SpriteBatch {
	#texture: WebGLTexture;
	#instances: number;
	#program: WebGLProgram;
	#positionsBuffer: WebGLBuffer;
	#textureCoordsBuffer: WebGLBuffer;
	#tintsBuffer: WebGLBuffer;
	#transformsBuffer: WebGLBuffer;
	#indexBuffer: WebGLBuffer;

	constructor(
		gl: WebGL2RenderingContext,
		texture: Texture2D,
		sprites: Sprite[]
	) {
		this.#texture = texture.texture;
		this.#instances = sprites.length;

		this.#program = WebGL.createProgram(
			gl,
			SHADER_SOURCE.vertex,
			SHADER_SOURCE.fragment
		);

		const positions = new Int8Array(this.#instances * 3 * 4);
		const textureCoords = new Float32Array(this.#instances * 2 * 4);
		const tints = new Uint8ClampedArray(this.#instances * 4 * 4);
		const transforms = new Float32Array(this.#instances * 16 * 4);

		for (let i = 0; i < this.#instances; ++i) {
			// Initialize instance's vertex position.
			{
				positions.set(VERTEX_POSITIONS, i * 12);
			}
			// Initialize instance's vertex texture coordinate.
			{
				const data = createTextureCoordsFromImageRegion(
					texture,
					sprites[i].region,
					sprites[i].mirroring
				);
				textureCoords.set(data, i * 8);
			}
			// Initialize instance's vertex tint.
			{
				const data = sprites[i].tint.intoArray();
				tints.set(data, i * 16 + 0 * 4);
				tints.set(data, i * 16 + 1 * 4);
				tints.set(data, i * 16 + 2 * 4);
				tints.set(data, i * 16 + 3 * 4);
			}
			// Initialize instance's vertex transform.
			{
				const data = sprites[i].transform.data;
				transforms.set(data, i * 64 + 0 * 16);
				transforms.set(data, i * 64 + 1 * 16);
				transforms.set(data, i * 64 + 2 * 16);
				transforms.set(data, i * 64 + 3 * 16);
			}
		}

		this.#positionsBuffer = WebGL.createBufferInit(
			gl,
			WebGL.BufferUsage.Vertex,
			positions
		);
		this.#textureCoordsBuffer = WebGL.createBufferInit(
			gl,
			WebGL.BufferUsage.Vertex,
			textureCoords
		);
		this.#tintsBuffer = WebGL.createBufferInit(
			gl,
			WebGL.BufferUsage.Vertex,
			tints
		);
		this.#transformsBuffer = WebGL.createBufferInit(
			gl,
			WebGL.BufferUsage.Vertex,
			transforms
		);

		const indices = new Uint32Array(this.#instances * 6);

		for (let i = 0; i < this.#instances; ++i) {
			indices.set(
				INDICES.map((it) => it + i * 4),
				i * 6
			);
		}

		this.#indexBuffer = WebGL.createBufferInit(
			gl,
			WebGL.BufferUsage.Index,
			indices
		);
	}

	public draw(gl: WebGL2RenderingContext, camera: Matrix4): void {
		// Use main shader program.
		{
			gl.useProgram(this.#program);
		}

		// Bind camera uniform.
		{
			const location = gl.getUniformLocation(this.#program, "camera");
			gl.uniformMatrix4fv(location, false, camera.data);
		}
		// Bind texture uniform.
		{
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.#texture);
		}
		// Bind sampler uniform.
		{
			const location = gl.getUniformLocation(this.#program, "sampler");
			gl.uniform1i(location, 0);
		}

		// Bind vertex position buffer.
		{
			const index = gl.getAttribLocation(this.#program, "a_position");
			gl.bindBuffer(WebGL.BufferUsage.Vertex, this.#positionsBuffer);
			gl.enableVertexAttribArray(index);
			gl.vertexAttribPointer(index, 3, WebGL.AttributeType.Byte, false, 0, 0);
		}
		// Bind vertex texture coordinate buffer.
		{
			const index = gl.getAttribLocation(this.#program, "a_texture_coord");
			gl.bindBuffer(WebGL.BufferUsage.Vertex, this.#textureCoordsBuffer);
			gl.enableVertexAttribArray(index);
			gl.vertexAttribPointer(index, 2, WebGL.AttributeType.Float, false, 0, 0);
		}
		// Bind vertex tint buffer.
		{
			const index = gl.getAttribLocation(this.#program, "a_tint");
			gl.bindBuffer(WebGL.BufferUsage.Vertex, this.#tintsBuffer);
			gl.enableVertexAttribArray(index);
			gl.vertexAttribPointer(
				index,
				4,
				WebGL.AttributeType.UnsignedByte,
				true,
				0,
				0
			);
		}
		// Bind vertex transform buffer.
		{
			const index = gl.getAttribLocation(this.#program, "a_transform");
			gl.bindBuffer(WebGL.BufferUsage.Vertex, this.#transformsBuffer);
			for (let i = 0; i < 4; ++i) {
				gl.enableVertexAttribArray(index + i);
				gl.vertexAttribPointer(
					index + i,
					4,
					WebGL.AttributeType.Float,
					false,
					64,
					i * 16
				);
			}
		}

		// Bind index buffer.
		{
			gl.bindBuffer(WebGL.BufferUsage.Index, this.#indexBuffer);
		}

		// Draw indexed geometry.
		{
			gl.drawElements(
				WebGL.DrawMode.Triangles,
				6 * this.#instances,
				gl.UNSIGNED_INT,
				0
			);
		}
	}
}
