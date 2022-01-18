import * as SusGpu from "$lib/susgpu1";
import Matrix4 from "$lib/matrix4";
import Vector3 from "$lib/vector3";
import type Color from "./color";

// TODO(thismarvin): Shift to WebGL2? (Specifically instanced drawing).
// TODO(thismarvin): Handle large dimensions properly.
// TODO(thismarvin): Look into using a single Texture?

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

const source: SusGpu.ShaderSource = {
	vertex: `
	uniform mat4 viewProjection;

	attribute vec3 a_position;
	attribute vec3 a_translation;
	attribute vec4 a_color;

	varying lowp vec4 v_color;

	void main() {
		gl_Position = viewProjection * vec4(a_position + a_translation, 1);
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

	// TODO(thismarvin): Is it even worth keeping track of this?
	// private data: Color[];

	public readonly vertexPositions: Float32Array;
	public readonly vertexTranslations: Float32Array;
	public vertexColors: Float32Array;
	public readonly indices: Uint16Array;
	public dirty: boolean;

	public instance: SusGpu.Instance;
	public surface: SusGpu.Surface;
	public adapter: SusGpu.Adapter;
	public device: SusGpu.Device;
	public queue: SusGpu.Queue;

	public camera: Matrix4;
	public shaderModule: SusGpu.ShaderModule;
	public cameraUniform: SusGpu.Buffer;
	public vertexPositionsBuffer: SusGpu.Buffer;
	public vertexTranslationsBuffer: SusGpu.Buffer;
	public vertexColorsBuffer: SusGpu.Buffer;
	public indexBuffer: SusGpu.Buffer;
	public cameraGroup: SusGpu.BindGroup;
	public pipeline: SusGpu.RenderPipeline;

	constructor(canvas: HTMLCanvasElement, width: number, height: number) {
		this.canvas = canvas;
		this.width = width;
		this.height = height;

		this.camera = _createOrthographicCamera(
			new Vector3(this.width * 0.5, -this.height * 0.5, 1),
			Vector3.FORWARD,
			Vector3.UP,
			this.width,
			this.height,
			0.125,
			8
		);

		// this.data = new Array(this.width * this.height).fill(Color.default());

		this.vertexPositions = new Float32Array(this.area * 4 * 3).fill(0);
		this.vertexColors = new Float32Array(this.area * 4 * 4).fill(0);
		this.vertexTranslations = new Float32Array(this.area * 4 * 3).fill(0);
		this.indices = new Uint16Array(this.area * 6).fill(0);
		this.dirty = false;

		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				const index = y * this.width + x;
				const j = index * 12;

				this.vertexPositions[j + 0] = 0;
				this.vertexPositions[j + 1] = 0;
				this.vertexPositions[j + 2] = 0;

				this.vertexPositions[j + 3] = 0;
				this.vertexPositions[j + 4] = -1;
				this.vertexPositions[j + 5] = 0;

				this.vertexPositions[j + 6] = 1;
				this.vertexPositions[j + 7] = -1;
				this.vertexPositions[j + 8] = 0;

				this.vertexPositions[j + 9] = 1;
				this.vertexPositions[j + 10] = 0;
				this.vertexPositions[j + 11] = 0;

				this.vertexTranslations[j + 0] = x;
				this.vertexTranslations[j + 1] = -y;
				this.vertexTranslations[j + 2] = 0;

				this.vertexTranslations[j + 3] = x;
				this.vertexTranslations[j + 4] = -y;
				this.vertexTranslations[j + 5] = 0;

				this.vertexTranslations[j + 6] = x;
				this.vertexTranslations[j + 7] = -y;
				this.vertexTranslations[j + 8] = 0;

				this.vertexTranslations[j + 9] = x;
				this.vertexTranslations[j + 10] = -y;
				this.vertexTranslations[j + 11] = 0;
			}
		}

		for (let i = 0; i < this.area; ++i) {
			const start = 6 * i;
			const buffer = 4 * i;

			this.indices[start + 0] = buffer + 0;
			this.indices[start + 1] = buffer + 1;
			this.indices[start + 2] = buffer + 2;
			this.indices[start + 3] = buffer + 0;
			this.indices[start + 4] = buffer + 2;
			this.indices[start + 5] = buffer + 3;
		}

		this.instance = new SusGpu.Instance();

		this.surface = this.instance.createSurface(this.canvas);
		this.adapter = this.instance.createAdapter({
			compatibleSurface: this.surface,
		});

		[this.device, this.queue] = this.adapter.requestDevice({});

		this.shaderModule = this.device.createShaderModule({ source });

		this.cameraUniform = this.device.createBufferInit({
			usage: SusGpu.BufferUsage.Uniform,
			contents: this.camera.data,
		});
		this.vertexPositionsBuffer = this.device.createBufferInit({
			usage: SusGpu.BufferUsage.Vertex,
			contents: this.vertexPositions,
		});
		this.vertexTranslationsBuffer = this.device.createBufferInit({
			usage: SusGpu.BufferUsage.Vertex,
			contents: this.vertexTranslations,
		});
		this.vertexColorsBuffer = this.device.createBufferInit({
			usage: SusGpu.BufferUsage.Vertex,
			contents: this.vertexColors,
		});
		this.indexBuffer = this.device.createBufferInit({
			usage: SusGpu.BufferUsage.Index,
			contents: this.indices,
		});

		const vertexPositionsLayout = new SusGpu.VertexBufferLayout([
			new SusGpu.VertexAttribute("a_position", SusGpu.AttributeType.Vec3),
		]);
		const vertexTranslationsLayout = new SusGpu.VertexBufferLayout([
			new SusGpu.VertexAttribute("a_translation", SusGpu.AttributeType.Vec3),
		]);
		const vertexColorsLayout = new SusGpu.VertexBufferLayout([
			new SusGpu.VertexAttribute("a_color", SusGpu.AttributeType.Vec4),
		]);

		const cameraLayout = this.device.createBindGroupLayout({
			entries: [{ name: "viewProjection", type: SusGpu.UniformType.Matrix4 }],
		});

		this.cameraGroup = this.device.createBindGroup({ layout: cameraLayout }, [
			{ resource: this.cameraUniform.asEntireBinding() },
		]);

		const pipelineLayout = this.device.createPipelineLayout({
			bindGroupLayouts: [cameraLayout],
		});

		this.pipeline = this.device.createRenderPipeline({
			layout: pipelineLayout,
			module: this.shaderModule,
			buffers: [
				vertexPositionsLayout,
				vertexTranslationsLayout,
				vertexColorsLayout,
			],
			topology: SusGpu.PrimitiveTopology.Triangles,
			frontFace: SusGpu.FrontFace.Ccw,
			cullMode: SusGpu.Face.Back,
		});
	}

	public clear(color: Color): void {
		// for (let i = 0; i < this.width * this.height; ++i) {
		// 	this.data[i] = color;
		// }

		const r = color.r;
		const g = color.g;
		const b = color.b;
		const a = color.a;

		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				const index = y * this.width + x;
				const j = index * 16;

				this.vertexColors[j + 0] = r;
				this.vertexColors[j + 1] = g;
				this.vertexColors[j + 2] = b;
				this.vertexColors[j + 3] = a;

				this.vertexColors[j + 4] = r;
				this.vertexColors[j + 5] = g;
				this.vertexColors[j + 6] = b;
				this.vertexColors[j + 7] = a;

				this.vertexColors[j + 8] = r;
				this.vertexColors[j + 9] = g;
				this.vertexColors[j + 10] = b;
				this.vertexColors[j + 11] = a;

				this.vertexColors[j + 12] = r;
				this.vertexColors[j + 13] = g;
				this.vertexColors[j + 14] = b;
				this.vertexColors[j + 15] = a;
			}
		}

		this.dirty = true;
	}

	public set(x: number, y: number, color: Color): void {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
			return;
		}

		const index = y * this.width + x;

		// this.data[index] = color;

		const j = index * 16;
		const r = color.r;
		const g = color.g;
		const b = color.b;
		const a = color.a;

		this.vertexColors[j + 0] = r;
		this.vertexColors[j + 1] = g;
		this.vertexColors[j + 2] = b;
		this.vertexColors[j + 3] = a;

		this.vertexColors[j + 4] = r;
		this.vertexColors[j + 5] = g;
		this.vertexColors[j + 6] = b;
		this.vertexColors[j + 7] = a;

		this.vertexColors[j + 8] = r;
		this.vertexColors[j + 9] = g;
		this.vertexColors[j + 10] = b;
		this.vertexColors[j + 11] = a;

		this.vertexColors[j + 12] = r;
		this.vertexColors[j + 13] = g;
		this.vertexColors[j + 14] = b;
		this.vertexColors[j + 15] = a;

		this.dirty = true;
	}

	public draw(): void {
		if (this.dirty) {
			this.queue.writeBuffer(this.vertexColorsBuffer, this.vertexColors);
		}

		const encoder = this.device.createCommandEncoder({});

		encoder
			.beginRenderPass({
				colorAttachment: { op: { kind: SusGpu.LoadOpKind.Load } },
			})
			.setPipeline(this.pipeline)
			.setBindGroup(this.cameraGroup)
			.setVertexBuffer(
				this.vertexPositionsBuffer,
				this.vertexTranslationsBuffer,
				this.vertexColorsBuffer
			)
			.setIndexBuffer(this.indexBuffer)
			.drawIndexed(this.area * 2);

		this.queue.submit(encoder.finish());
	}
}
