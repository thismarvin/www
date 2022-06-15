let wasm;

let cachedTextDecoder = new TextDecoder("utf-8", {
	ignoreBOM: true,
	fatal: true,
});

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
	if (
		cachegetUint8Memory0 === null ||
		cachegetUint8Memory0.buffer !== wasm.memory.buffer
	) {
		cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
	}
	return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
	return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
	if (heap_next === heap.length) heap.push(heap.length + 1);
	const idx = heap_next;
	heap_next = heap[idx];

	heap[idx] = obj;
	return idx;
}

function getObject(idx) {
	return heap[idx];
}

function dropObject(idx) {
	if (idx < 36) return;
	heap[idx] = heap_next;
	heap_next = idx;
}

function takeObject(idx) {
	const ret = getObject(idx);
	dropObject(idx);
	return ret;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder("utf-8");

const encodeString =
	typeof cachedTextEncoder.encodeInto === "function"
		? function (arg, view) {
				return cachedTextEncoder.encodeInto(arg, view);
		  }
		: function (arg, view) {
				const buf = cachedTextEncoder.encode(arg);
				view.set(buf);
				return {
					read: arg.length,
					written: buf.length,
				};
		  };

function passStringToWasm0(arg, malloc, realloc) {
	if (realloc === undefined) {
		const buf = cachedTextEncoder.encode(arg);
		const ptr = malloc(buf.length);
		getUint8Memory0()
			.subarray(ptr, ptr + buf.length)
			.set(buf);
		WASM_VECTOR_LEN = buf.length;
		return ptr;
	}

	let len = arg.length;
	let ptr = malloc(len);

	const mem = getUint8Memory0();

	let offset = 0;

	for (; offset < len; offset++) {
		const code = arg.charCodeAt(offset);
		if (code > 0x7f) break;
		mem[ptr + offset] = code;
	}

	if (offset !== len) {
		if (offset !== 0) {
			arg = arg.slice(offset);
		}
		ptr = realloc(ptr, len, (len = offset + arg.length * 3));
		const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
		const ret = encodeString(arg, view);

		offset += ret.written;
	}

	WASM_VECTOR_LEN = offset;
	return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
	if (
		cachegetInt32Memory0 === null ||
		cachegetInt32Memory0.buffer !== wasm.memory.buffer
	) {
		cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
	}
	return cachegetInt32Memory0;
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
	if (
		cachegetUint32Memory0 === null ||
		cachegetUint32Memory0.buffer !== wasm.memory.buffer
	) {
		cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
	}
	return cachegetUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
	const mem = getUint32Memory0();
	const slice = mem.subarray(ptr / 4, ptr / 4 + len);
	const result = [];
	for (let i = 0; i < slice.length; i++) {
		result.push(takeObject(slice[i]));
	}
	return result;
}

function handleError(f, args) {
	try {
		return f.apply(this, args);
	} catch (e) {
		wasm.__wbindgen_exn_store(addHeapObject(e));
	}
}
/**
 */
export const JsKingSafety = Object.freeze({
	Safe: 1,
	1: "Safe",
	Check: 2,
	2: "Check",
	Checkmate: 4,
	4: "Checkmate",
	Stalemate: 8,
	8: "Stalemate",
});
/**
 */
export class Keeper {
	static __wrap(ptr) {
		const obj = Object.create(Keeper.prototype);
		obj.ptr = ptr;

		return obj;
	}

	__destroy_into_raw() {
		const ptr = this.ptr;
		this.ptr = 0;

		return ptr;
	}

	free() {
		const ptr = this.__destroy_into_raw();
		wasm.__wbg_keeper_free(ptr);
	}
	/**
	 * @returns {Keeper}
	 */
	static create() {
		var ret = wasm.keeper_create();
		return Keeper.__wrap(ret);
	}
	/**
	 * @param {string} fen
	 * @returns {Keeper}
	 */
	static from_fen(fen) {
		var ptr0 = passStringToWasm0(
			fen,
			wasm.__wbindgen_malloc,
			wasm.__wbindgen_realloc
		);
		var len0 = WASM_VECTOR_LEN;
		var ret = wasm.keeper_from_fen(ptr0, len0);
		return Keeper.__wrap(ret);
	}
	/**
	 * @returns {string}
	 */
	fen() {
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			wasm.keeper_fen(retptr, this.ptr);
			var r0 = getInt32Memory0()[retptr / 4 + 0];
			var r1 = getInt32Memory0()[retptr / 4 + 1];
			return getStringFromWasm0(r0, r1);
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16);
			wasm.__wbindgen_free(r0, r1);
		}
	}
	/**
	 * @returns {any[]}
	 */
	board() {
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			wasm.keeper_board(retptr, this.ptr);
			var r0 = getInt32Memory0()[retptr / 4 + 0];
			var r1 = getInt32Memory0()[retptr / 4 + 1];
			var v0 = getArrayJsValueFromWasm0(r0, r1).slice();
			wasm.__wbindgen_free(r0, r1 * 4);
			return v0;
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16);
		}
	}
	/**
	 * @returns {any[]}
	 */
	moves() {
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			wasm.keeper_moves(retptr, this.ptr);
			var r0 = getInt32Memory0()[retptr / 4 + 0];
			var r1 = getInt32Memory0()[retptr / 4 + 1];
			var v0 = getArrayJsValueFromWasm0(r0, r1).slice();
			wasm.__wbindgen_free(r0, r1 * 4);
			return v0;
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16);
		}
	}
	/**
	 * @returns {number}
	 */
	king_safety() {
		var ret = wasm.keeper_king_safety(this.ptr);
		return ret >>> 0;
	}
	/**
	 * @param {string} lan
	 * @returns {string}
	 */
	move_meta(lan) {
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			var ptr0 = passStringToWasm0(
				lan,
				wasm.__wbindgen_malloc,
				wasm.__wbindgen_realloc
			);
			var len0 = WASM_VECTOR_LEN;
			wasm.keeper_move_meta(retptr, this.ptr, ptr0, len0);
			var r0 = getInt32Memory0()[retptr / 4 + 0];
			var r1 = getInt32Memory0()[retptr / 4 + 1];
			return getStringFromWasm0(r0, r1);
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16);
			wasm.__wbindgen_free(r0, r1);
		}
	}
	/**
	 * @param {string} lan
	 */
	make_move(lan) {
		var ptr0 = passStringToWasm0(
			lan,
			wasm.__wbindgen_malloc,
			wasm.__wbindgen_realloc
		);
		var len0 = WASM_VECTOR_LEN;
		wasm.keeper_make_move(this.ptr, ptr0, len0);
	}
	/**
	 * @param {number} depth
	 * @returns {string}
	 */
	suggest(depth) {
		try {
			const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
			wasm.keeper_suggest(retptr, this.ptr, depth);
			var r0 = getInt32Memory0()[retptr / 4 + 0];
			var r1 = getInt32Memory0()[retptr / 4 + 1];
			return getStringFromWasm0(r0, r1);
		} finally {
			wasm.__wbindgen_add_to_stack_pointer(16);
			wasm.__wbindgen_free(r0, r1);
		}
	}
}
/**
 */
export class Webscado {
	static __wrap(ptr) {
		const obj = Object.create(Webscado.prototype);
		obj.ptr = ptr;

		return obj;
	}

	__destroy_into_raw() {
		const ptr = this.ptr;
		this.ptr = 0;

		return ptr;
	}

	free() {
		const ptr = this.__destroy_into_raw();
		wasm.__wbg_webscado_free(ptr);
	}
	/**
	 * @param {Function} cb
	 * @returns {Webscado}
	 */
	static create(cb) {
		var ret = wasm.webscado_create(addHeapObject(cb));
		return Webscado.__wrap(ret);
	}
	/**
	 * @param {string} command
	 */
	send(command) {
		var ptr0 = passStringToWasm0(
			command,
			wasm.__wbindgen_malloc,
			wasm.__wbindgen_realloc
		);
		var len0 = WASM_VECTOR_LEN;
		wasm.webscado_send(this.ptr, ptr0, len0);
	}
}

async function load(module, imports) {
	if (typeof Response === "function" && module instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming === "function") {
			try {
				return await WebAssembly.instantiateStreaming(module, imports);
			} catch (e) {
				if (module.headers.get("Content-Type") != "application/wasm") {
					console.warn(
						"`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
						e
					);
				} else {
					throw e;
				}
			}
		}

		const bytes = await module.arrayBuffer();
		return await WebAssembly.instantiate(bytes, imports);
	} else {
		const instance = await WebAssembly.instantiate(module, imports);

		if (instance instanceof WebAssembly.Instance) {
			return { instance, module };
		} else {
			return instance;
		}
	}
}

async function init(input) {
	if (typeof input === "undefined") {
		input = new URL("chess_bg.wasm", import.meta.url);
	}
	const imports = {};
	imports.wbg = {};
	imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
		var ret = getStringFromWasm0(arg0, arg1);
		return addHeapObject(ret);
	};
	imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
		takeObject(arg0);
	};
	imports.wbg.__wbg_call_346669c262382ad7 = function () {
		return handleError(function (arg0, arg1, arg2) {
			var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
			return addHeapObject(ret);
		}, arguments);
	};
	imports.wbg.__wbindgen_throw = function (arg0, arg1) {
		throw new Error(getStringFromWasm0(arg0, arg1));
	};

	if (
		typeof input === "string" ||
		(typeof Request === "function" && input instanceof Request) ||
		(typeof URL === "function" && input instanceof URL)
	) {
		input = fetch(input);
	}

	const { instance, module } = await load(await input, imports);

	wasm = instance.exports;
	init.__wbindgen_wasm_module = module;

	return wasm;
}

export default init;
