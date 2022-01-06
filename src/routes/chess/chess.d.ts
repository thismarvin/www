/* tslint:disable */
/* eslint-disable */
/**
 */
export enum JsKingSafety {
	Safe,
	Check,
	Checkmate,
	Stalemate,
}
/**
 */
export class Keeper {
	free(): void;
	/**
	 * @returns {Keeper}
	 */
	static create(): Keeper;
	/**
	 * @param {string} fen
	 * @returns {Keeper}
	 */
	static from_fen(fen: string): Keeper;
	/**
	 * @returns {string}
	 */
	fen(): string;
	/**
	 * @returns {any[]}
	 */
	board(): any[];
	/**
	 * @returns {any[]}
	 */
	moves(): any[];
	/**
	 * @returns {number}
	 */
	king_safety(): number;
	/**
	 * @param {string} lan
	 * @returns {string}
	 */
	move_meta(lan: string): string;
	/**
	 * @param {string} lan
	 */
	make_move(lan: string): void;
	/**
	 * @param {number} depth
	 * @returns {string}
	 */
	suggest(depth: number): string;
}
/**
 */
export class Webscado {
	free(): void;
	/**
	 * @param {Function} cb
	 * @returns {Webscado}
	 */
	static create(cb: Function): Webscado;
	/**
	 * @param {string} command
	 */
	send(command: string): void;
}

export type InitInput =
	| RequestInfo
	| URL
	| Response
	| BufferSource
	| WebAssembly.Module;

export interface InitOutput {
	readonly memory: WebAssembly.Memory;
	readonly __wbg_webscado_free: (a: number) => void;
	readonly webscado_create: (a: number) => number;
	readonly webscado_send: (a: number, b: number, c: number) => void;
	readonly __wbg_keeper_free: (a: number) => void;
	readonly keeper_create: () => number;
	readonly keeper_from_fen: (a: number, b: number) => number;
	readonly keeper_fen: (a: number, b: number) => void;
	readonly keeper_board: (a: number, b: number) => void;
	readonly keeper_moves: (a: number, b: number) => void;
	readonly keeper_king_safety: (a: number) => number;
	readonly keeper_move_meta: (
		a: number,
		b: number,
		c: number,
		d: number
	) => void;
	readonly keeper_make_move: (a: number, b: number, c: number) => void;
	readonly keeper_suggest: (a: number, b: number, c: number) => void;
	readonly __wbindgen_malloc: (a: number) => number;
	readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
	readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
	readonly __wbindgen_free: (a: number, b: number) => void;
	readonly __wbindgen_exn_store: (a: number) => void;
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
