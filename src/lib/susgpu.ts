import * as WebGL from "./webgl";

// eslint-disable-next-line
function noop(params?: unknown[]) {
	/**/
}

export class Instance {
	constructor() {
		/**/
	}

	public createSurface(canvas: HTMLCanvasElement): Surface {
		return new Surface(canvas);
	}

	public createAdapter(options: RequestAdapterOptions): Adapter {
		return new Adapter(options.compatibleSurface);
	}
}

export type SurfaceConfiguration = {
	width: number;
	height: number;
};

export class Surface {
	public readonly canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}

	public configure(device: Device, config: SurfaceConfiguration): void {
		noop([device]);

		this.canvas.width = config.width;
		this.canvas.height = config.height;
	}
}

export type RequestAdapterOptions = {
	compatibleSurface: Surface;
};

export type DeviceDescriptor = {
	label?: string;
};

export class Adapter {
	readonly #surface: Surface;

	constructor(surface: Surface) {
		this.#surface = surface;
	}

	public requestDevice(descriptor: DeviceDescriptor): [Device, Queue] {
		noop([descriptor]);

		const ctx = this.#surface.canvas.getContext("webgl");

		if (ctx === null) {
			throw new TypeError("Could not get webgl context.");
		}

		return [new Device(ctx), new Queue(ctx)];
	}
}

export class Device {
	readonly #ctx: WebGLRenderingContext;

	constructor(ctx: WebGLRenderingContext) {
		this.#ctx = ctx;
	}

	// public createTexture(): void {/**/}
	//
	// public createSampler(): void {/**/}

	public createShaderModule(descriptor: ShaderModuleDescriptor): ShaderModule {
		return new ShaderModule(
			WebGL.createProgram(
				this.#ctx,
				descriptor.source.vertex,
				descriptor.source.fragment
			)
		);
	}

	public createBindGroupLayout(
		descriptor: BingGroupLayoutDescriptor
	): BindGroupLayout {
		return new BindGroupLayout(descriptor);
	}

	public createBindGroup(
		descriptor: BindGroupDescriptor,
		entries: BindGroupEntry[]
	): BindGroup {
		return new BindGroup(descriptor, entries);
	}

	public createBuffer(descriptor: BufferDescriptor): Buffer {
		const internal: BufferUnion = (() => {
			switch (descriptor.usage) {
				case BufferUsage.Vertex: {
					return {
						kind: BufferKind.Vertex,
						contents: WebGL.allocateVertexBuffer(
							this.#ctx,
							descriptor.size,
							WebGL.VertexUsage.Static
						),
					};
				}
				case BufferUsage.Index: {
					return {
						kind: BufferKind.Index,
						contents: WebGL.allocateIndexBuffer(
							this.#ctx,
							descriptor.size,
							WebGL.VertexUsage.Static
						),
					};
				}
				case BufferUsage.Uniform: {
					return {
						kind: BufferKind.Uniform,
						contents: new Float32Array(descriptor.size).fill(0),
					};
				}
			}
		})();

		return new Buffer(descriptor, internal);
	}

	public createBufferInit(descriptor: BufferInitDescriptor): Buffer {
		const buffer = this.createBuffer({
			label: descriptor.label,
			usage: descriptor.usage,
			size: descriptor.contents.byteLength,
		});

		switch (descriptor.usage) {
			case BufferUsage.Vertex: {
				WebGL.setVertexBufferData(
					this.#ctx,
					buffer.internal.contents as WebGLBuffer,
					descriptor.contents as Float32Array
				);

				break;
			}
			case BufferUsage.Index: {
				WebGL.setIndexBufferData(
					this.#ctx,
					buffer.internal.contents as WebGLBuffer,
					descriptor.contents as Uint16Array
				);

				break;
			}
			case BufferUsage.Uniform: {
				buffer.internal.contents = descriptor.contents;

				break;
			}
		}

		return buffer;
	}

	public createPipelineLayout(
		descriptor: RenderPipelineLayoutDescriptor
	): PipelineLayout {
		return new PipelineLayout(descriptor);
	}

	public createRenderPipeline(
		descriptor: RenderPipelineDescriptor
	): RenderPipeline {
		return new RenderPipeline(descriptor);
	}

	public createCommandEncoder(
		descriptor: CommandEncoderDescriptor
	): CommandEncoder {
		return new CommandEncoder(descriptor);
	}
}

export type ShaderSource = {
	vertex: string;
	fragment: string;
};

export type ShaderModuleDescriptor = {
	label?: string;
	source: ShaderSource;
};

export class ShaderModule {
	public readonly program: WebGLProgram;

	constructor(program: WebGLProgram) {
		this.program = program;
	}
}

export enum UniformType {
	Float32,
	Vector2,
	Vector3,
	Vector4,
	Matrix2,
	Matrix3,
	Matrix4,
}

export type BindGroupLayoutEntry = {
	name: string;
	type: UniformType;
};

export type BingGroupLayoutDescriptor = {
	entries: BindGroupLayoutEntry[];
};

export type BindGroupDescriptor = {
	label?: string;
	layout: BindGroupLayout;
};

export class BindGroupLayout {
	public readonly descriptor: BingGroupLayoutDescriptor;

	constructor(descriptor: BingGroupLayoutDescriptor) {
		this.descriptor = descriptor;
	}
}

export enum BindingResourceKind {
	Buffer,
	Sampler,
	TextureView,
}

export type BindingResourceBuffer = {
	kind: BindingResourceKind.Buffer;
	contents: Buffer;
};

// export type BindingResourceSampler = {
// 	kind: BindingResourceKind.Sampler,
// 	contents: Sampler
// }
//
// export type BindingResourceTextureView = {
// 	kind: BindingResourceKind.TextureView,
// 	contents: TextureView
// }

export type BindingResource = BindingResourceBuffer;

export type BindGroupEntry = {
	resource: BindingResource;
};

export class BindGroup {
	public readonly descriptor: BindGroupDescriptor;
	public readonly entries: BindGroupEntry[];

	constructor(descriptor: BindGroupDescriptor, entries: BindGroupEntry[]) {
		this.descriptor = descriptor;
		this.entries = entries;
	}
}

export enum BufferUsage {
	Vertex,
	Index,
	Uniform,
}

export type BufferDescriptor = {
	label?: string;
	usage: BufferUsage;
	size: number;
};

export type BufferInitDescriptor = {
	label?: string;
	usage: BufferUsage;
	contents: Float32Array | Uint16Array;
};

export enum BufferKind {
	Vertex,
	Index,
	Uniform,
}

export type VertexBuffer = {
	kind: BufferKind.Vertex;
	contents: WebGLBuffer;
};

export type IndexBuffer = {
	kind: BufferKind.Index;
	contents: WebGLBuffer;
};

export type UniformBuffer = {
	kind: BufferKind.Uniform;
	contents: Float32Array;
};

export type BufferUnion = VertexBuffer | IndexBuffer | UniformBuffer;

export class Buffer {
	public readonly descriptor: BufferDescriptor;
	public internal: BufferUnion;

	constructor(descriptor: BufferDescriptor, internal: BufferUnion) {
		this.descriptor = descriptor;
		this.internal = internal;
	}

	public asEntireBinding(): BindingResource {
		return {
			kind: BindingResourceKind.Buffer,
			contents: this,
		};
	}
}

export enum AttributeType {
	Float,
	Vec2,
	Vec3,
	Vec4,
}

export class VertexAttribute {
	public readonly name: string;
	public readonly type: AttributeType;
	public readonly size: number;

	public stride: number;
	public offset: number;

	constructor(name: string, type: AttributeType) {
		this.name = name;
		this.type = type;

		switch (this.type) {
			case AttributeType.Float: {
				this.size = 1;

				break;
			}
			case AttributeType.Vec2: {
				this.size = 2;

				break;
			}
			case AttributeType.Vec3: {
				this.size = 3;

				break;
			}
			case AttributeType.Vec4: {
				this.size = 4;

				break;
			}
		}

		this.stride = 0;
		this.offset = 0;

		Object.defineProperty(this, "name", {
			writable: false,
		});
		Object.defineProperty(this, "size", {
			writable: false,
		});
		Object.defineProperty(this, "type", {
			writable: false,
		});
	}
}

export class VertexBufferLayout {
	public readonly attributes: VertexAttribute[];
	public readonly size: number;
	public readonly stride: number;

	constructor(attributes: VertexAttribute[]) {
		function processVertexAttributes(attributes: VertexAttribute[]) {
			const strideOffsets = [];
			let size = 0;
			let stride = 0;

			for (let i = 0; i < attributes.length; ++i) {
				size += attributes[i].size;

				strideOffsets.push(stride);
				stride += WebGL.AttributeSize.Float * attributes[i].size;
			}

			// Update each element to reflect the layout's stride.
			for (let i = 0; i < attributes.length; ++i) {
				attributes[i].stride = stride;
				attributes[i].offset = strideOffsets[i];
			}

			return {
				size,
				stride,
			};
		}

		this.attributes = attributes;

		const { size, stride } = processVertexAttributes(this.attributes);

		this.size = size;
		this.stride = stride;

		Object.defineProperty(this, "attributes", {
			writable: false,
		});
		Object.defineProperty(this, "size", {
			writable: false,
		});
		Object.defineProperty(this, "stride", {
			writable: false,
		});
	}
}

export type RenderPipelineLayoutDescriptor = {
	label?: string;
	bindGroupLayouts: BindGroupLayout[];
};

export class PipelineLayout {
	public readonly descriptor: RenderPipelineLayoutDescriptor;

	constructor(descriptor: RenderPipelineLayoutDescriptor) {
		this.descriptor = descriptor;
	}
}

export enum PrimitiveTopology {
	Points = WebGL.DrawMode.Points,
	Lines = WebGL.DrawMode.Lines,
	LineLoop = WebGL.DrawMode.LineLoop,
	LineStrip = WebGL.DrawMode.LineStrip,
	Triangles = WebGL.DrawMode.Triangles,
	TriangleStrip = WebGL.DrawMode.TriangleStrip,
	TriangleFan = WebGL.DrawMode.TriangleFan,
}

export enum FrontFace {
	Cw = WebGL.FrontFace.Cw,
	Ccw = WebGL.FrontFace.Ccw,
}

export enum Face {
	Front = WebGL.CullFace.Front,
	Back = WebGL.CullFace.Back,
}

export type RenderPipelineDescriptor = {
	label?: string;
	layout: PipelineLayout;
	module: ShaderModule;
	buffers: VertexBufferLayout[];
	topology: PrimitiveTopology;
	frontFace: FrontFace;
	cullMode?: Face;
};

export class RenderPipeline {
	public readonly descriptor: RenderPipelineDescriptor;

	constructor(descriptor: RenderPipelineDescriptor) {
		this.descriptor = descriptor;
	}
}

export class Queue {
	readonly #ctx: WebGLRenderingContext;

	constructor(ctx: WebGLRenderingContext) {
		this.#ctx = ctx;
	}

	// public writeTexture(): void {/**/}

	public writeBuffer(buffer: Buffer, data: Float32List): void {
		switch (buffer.descriptor.usage) {
			case BufferUsage.Vertex: {
				WebGL.setVertexBufferData(
					this.#ctx,
					buffer.internal.contents as WebGLBuffer,
					data as Float32Array
				);

				break;
			}
			case BufferUsage.Index: {
				WebGL.setIndexBufferData(
					this.#ctx,
					buffer.internal.contents as WebGLBuffer,
					data as Float32Array
				);

				break;
			}
			case BufferUsage.Uniform: {
				buffer.internal.contents = data as number[];

				break;
			}
		}
	}

	public submit(...buffers: CommandBuffer[]): void {
		const inner = new RenderInner(this.#ctx);

		for (let i = 0; i < buffers.length; ++i) {
			const commandBuffer = buffers[i];

			for (let j = 0; j < commandBuffer.operations.length; ++j) {
				switch (commandBuffer.operations[j].kind) {
					case RenderOperationKind.ClearColor: {
						const operation = commandBuffer.operations[j] as ClearColor;

						inner.clearColor(operation.color);

						break;
					}
					case RenderOperationKind.SetPipeline: {
						const operation = commandBuffer.operations[j] as SetPipeline;

						inner.setPipeline(operation.pipeline);

						break;
					}
					case RenderOperationKind.SetBindGroup: {
						const operation = commandBuffer.operations[j] as SetBindGroup;

						inner.setBindGroup(...operation.bindGroups);

						break;
					}
					case RenderOperationKind.SetVertexBuffer: {
						const operation = commandBuffer.operations[j] as SetVertexBuffer;

						inner.setVertexBuffer(...operation.buffers);

						break;
					}
					case RenderOperationKind.SetIndexBuffer: {
						const operation = commandBuffer.operations[j] as SetIndexBuffer;

						inner.setIndexBuffer(operation.buffer);

						break;
					}
					case RenderOperationKind.DrawIndexed: {
						const operation = commandBuffer.operations[j] as DrawIndexed;

						inner.drawIndexed(operation.totalTriangles);

						break;
					}
				}
			}
		}
	}
}

enum RenderOperationKind {
	ClearColor,
	SetPipeline,
	SetBindGroup,
	SetVertexBuffer,
	SetIndexBuffer,
	DrawIndexed,
}

type ClearColor = {
	kind: RenderOperationKind.ClearColor;
	color: Color;
};

type SetPipeline = {
	kind: RenderOperationKind.SetPipeline;
	pipeline: RenderPipeline;
};

type SetBindGroup = {
	kind: RenderOperationKind.SetBindGroup;
	bindGroups: BindGroup[];
};

type SetVertexBuffer = {
	kind: RenderOperationKind.SetVertexBuffer;
	buffers: Buffer[];
};

type SetIndexBuffer = {
	kind: RenderOperationKind.SetIndexBuffer;
	buffer: Buffer;
};

type DrawIndexed = {
	kind: RenderOperationKind.DrawIndexed;
	totalTriangles: number;
};

type RenderOperation =
	| ClearColor
	| SetPipeline
	| SetBindGroup
	| SetVertexBuffer
	| SetIndexBuffer
	| DrawIndexed;

export type CommandEncoderDescriptor = {
	label?: string;
};

export class CommandEncoder {
	public readonly descriptor: CommandEncoderDescriptor;
	public operations: RenderOperation[];

	constructor(descriptor: CommandEncoderDescriptor) {
		this.descriptor = descriptor;
		this.operations = [];
	}

	public beginRenderPass(descriptor: RenderPassDescriptor): RenderPass {
		return new RenderPass(descriptor, this);
	}

	public finish(): CommandBuffer {
		return new CommandBuffer(this.operations);
	}
}

export class CommandBuffer {
	public readonly operations: RenderOperation[];

	constructor(operations: RenderOperation[]) {
		this.operations = operations;
	}
}

export type Color = {
	r: number;
	g: number;
	b: number;
	a: number;
};

export enum LoadOpKind {
	Clear,
	Load,
}

export type LoadOpClear<T> = {
	kind: LoadOpKind.Clear;
	value: T;
};

export type LoadOpLoad = {
	kind: LoadOpKind.Load;
};

export type LoadOp<T> = LoadOpClear<T> | LoadOpLoad;

export type RenderPassColorAttachment = {
	// view: TextureView,
	op: LoadOp<Color>;
};

export type RenderPassDepthStencilAttachment = {
	// view: TextureView,
	depthOp: unknown;
	stencilOp: unknown;
};

export type RenderPassDescriptor = {
	label?: string;
	colorAttachment: RenderPassColorAttachment;
	depthStencilAttachment?: RenderPassColorAttachment;
};

export class RenderPass {
	public readonly descriptor: RenderPassDescriptor;
	public encoder: CommandEncoder;

	constructor(descriptor: RenderPassDescriptor, encoder: CommandEncoder) {
		this.descriptor = descriptor;
		this.encoder = encoder;

		if (descriptor.colorAttachment.op.kind === LoadOpKind.Clear) {
			const loadOp = descriptor.colorAttachment.op as LoadOpClear<Color>;

			this.encoder.operations.push({
				kind: RenderOperationKind.ClearColor,
				color: loadOp.value,
			});
		}
	}

	public setPipeline(pipeline: RenderPipeline): RenderPass {
		this.encoder.operations.push({
			kind: RenderOperationKind.SetPipeline,
			pipeline,
		});

		return this;
	}

	public setBindGroup(...bindGroups: BindGroup[]): RenderPass {
		this.encoder.operations.push({
			kind: RenderOperationKind.SetBindGroup,
			bindGroups,
		});

		return this;
	}

	public setVertexBuffer(...buffers: Buffer[]): RenderPass {
		this.encoder.operations.push({
			kind: RenderOperationKind.SetVertexBuffer,
			buffers,
		});

		return this;
	}

	public setIndexBuffer(buffer: Buffer): RenderPass {
		this.encoder.operations.push({
			kind: RenderOperationKind.SetIndexBuffer,
			buffer,
		});

		return this;
	}

	public drawIndexed(totalTriangles: number): RenderPass {
		this.encoder.operations.push({
			kind: RenderOperationKind.DrawIndexed,
			totalTriangles,
		});

		return this;
	}
}

export class RenderInner {
	readonly #gl: WebGLRenderingContext;

	#pipeline: RenderPipeline | null;

	constructor(gl: WebGLRenderingContext) {
		this.#gl = gl;

		this.#pipeline = null;

		// TODO(thismarvin): I have no idea where to put this...
		// this.gl.viewport(0, 0, canvas.width, canvas.height);
	}

	clearColor(color: Color): void {
		this.#gl.clearColor(color.r, color.g, color.b, color.a);
		this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
	}

	setPipeline(pipeline: RenderPipeline): void {
		this.#pipeline = pipeline;

		this.#gl.useProgram(this.#pipeline.descriptor.module.program);

		if (this.#pipeline.descriptor.cullMode !== undefined) {
			this.#gl.enable(this.#gl.CULL_FACE);
			this.#gl.cullFace(this.#pipeline.descriptor.cullMode);
			this.#gl.frontFace(this.#pipeline.descriptor.frontFace);
		}
	}

	setBindGroup(...groups: BindGroup[]): void {
		if (this.#pipeline === null) {
			throw new TypeError("A pipeline has not been set.");
		}

		for (let i = 0; i < groups.length; ++i) {
			for (
				let j = 0;
				j < groups[i].descriptor.layout.descriptor.entries.length;
				++j
			) {
				const location = this.#gl.getUniformLocation(
					this.#pipeline.descriptor.module.program,
					this.#pipeline.descriptor.layout.descriptor.bindGroupLayouts[i]
						.descriptor.entries[j].name
				);

				const tmp = groups[i].entries[j].resource as BindingResourceBuffer;
				const buffer = tmp.contents.internal as UniformBuffer;

				switch (groups[i].descriptor.layout.descriptor.entries[j].type) {
					case UniformType.Float32: {
						this.#gl.uniform1fv(location, buffer.contents);

						break;
					}
					case UniformType.Vector2: {
						this.#gl.uniform2fv(location, buffer.contents);

						break;
					}
					case UniformType.Vector3: {
						this.#gl.uniform3fv(location, buffer.contents);

						break;
					}
					case UniformType.Vector4: {
						this.#gl.uniform4fv(location, buffer.contents);

						break;
					}
					case UniformType.Matrix2: {
						this.#gl.uniformMatrix2fv(location, false, buffer.contents);

						break;
					}
					case UniformType.Matrix3: {
						this.#gl.uniformMatrix3fv(location, false, buffer.contents);

						break;
					}
					case UniformType.Matrix4: {
						this.#gl.uniformMatrix4fv(location, false, buffer.contents);

						break;
					}
				}
			}
		}
	}

	setVertexBuffer(...vertexBuffers: Buffer[]): void {
		if (this.#pipeline === null) {
			throw new TypeError("A pipeline has not been set.");
		}

		for (let i = 0; i < vertexBuffers.length; ++i) {
			this.#gl.bindBuffer(
				WebGL.BufferUsage.Vertex,
				vertexBuffers[i].internal.contents as WebGLBuffer
			);

			for (const attribute of this.#pipeline.descriptor.buffers[i].attributes) {
				const index = this.#gl.getAttribLocation(
					this.#pipeline.descriptor.module.program,
					attribute.name
				);

				if (index < 0) {
					throw new Error(
						`The current program does not have a(n) '${attribute.name}' attribute.`
					);
				}

				this.#gl.enableVertexAttribArray(index);
				this.#gl.vertexAttribPointer(
					index,
					attribute.size,
					WebGL.AttributeType.Float,
					false,
					attribute.stride,
					attribute.offset
				);
			}
		}
	}

	setIndexBuffer(indexBuffer: Buffer): void {
		this.#gl.bindBuffer(
			WebGL.BufferUsage.Index,
			indexBuffer.internal.contents as WebGLBuffer
		);
	}

	// TODO(thismarvin): The parameters are wrong!
	drawIndexed(totalTriangles: number): void {
		if (this.#pipeline === null) {
			throw new TypeError("A pipeline has not been set.");
		}

		this.#gl.drawElements(
			this.#pipeline.descriptor.topology,
			totalTriangles * 3,
			// The following line forces that the Index buffer must be a typeof Uint16Array.
			this.#gl.UNSIGNED_SHORT,
			0
		);
	}
}
