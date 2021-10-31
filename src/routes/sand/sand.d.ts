/* tslint:disable */
/* eslint-disable */
/**
 */
export enum Material {
	Air,
	Rock,
	Sand,
	Water,
	Smoke,
}
/**
 */
export enum Tint {
	None,
	Dark,
	Darker,
	Darkest,
}
/**
 */
export class Size {
	free(): void;
	/**
	 */
	height: number;
	/**
	 */
	width: number;
}
/**
 */
export class World {
	free(): void;
	/**
	 * @param {number} width
	 * @param {number} height
	 * @param {number} chunk_size
	 * @returns {World}
	 */
	static create(width: number, height: number, chunk_size: number): World;
	/**
	 * @returns {Size}
	 */
	size(): Size;
	/**
	 * @returns {number}
	 */
	materials(): number;
	/**
	 * @returns {number}
	 */
	tints(): number;
	/**
	 */
	reset(): void;
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} material
	 * @param {number} tint
	 * @param {number} spread
	 */
	place(
		x: number,
		y: number,
		material: number,
		tint: number,
		spread: number
	): void;
	/**
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @param {number} radius
	 * @param {number} material
	 * @param {number} tint
	 * @param {number} spread
	 */
	paint(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		radius: number,
		material: number,
		tint: number,
		spread: number
	): void;
	/**
	 */
	simulate(): void;
}

export type InitInput =
	| RequestInfo
	| URL
	| Response
	| BufferSource
	| WebAssembly.Module;

export interface InitOutput {
	readonly memory: WebAssembly.Memory;
	readonly __wbg_size_free: (a: number) => void;
	readonly __wbg_get_size_width: (a: number) => number;
	readonly __wbg_set_size_width: (a: number, b: number) => void;
	readonly __wbg_get_size_height: (a: number) => number;
	readonly __wbg_set_size_height: (a: number, b: number) => void;
	readonly __wbg_world_free: (a: number) => void;
	readonly world_create: (a: number, b: number, c: number) => number;
	readonly world_size: (a: number) => number;
	readonly world_materials: (a: number) => number;
	readonly world_tints: (a: number) => number;
	readonly world_reset: (a: number) => void;
	readonly world_place: (
		a: number,
		b: number,
		c: number,
		d: number,
		e: number,
		f: number
	) => void;
	readonly world_paint: (
		a: number,
		b: number,
		c: number,
		d: number,
		e: number,
		f: number,
		g: number,
		h: number,
		i: number
	) => void;
	readonly world_simulate: (a: number) => void;
}

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export default function init(
	module_or_path?: InitInput | Promise<InitInput>
): Promise<InitOutput>;
