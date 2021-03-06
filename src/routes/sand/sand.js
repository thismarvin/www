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
/**
 */
export const Material = Object.freeze({
	Air: 0,
	0: "Air",
	Rock: 1,
	1: "Rock",
	Sand: 2,
	2: "Sand",
	Water: 3,
	3: "Water",
	Smoke: 4,
	4: "Smoke",
});
/**
 */
export const Tint = Object.freeze({
	None: 0,
	0: "None",
	Dark: 1,
	1: "Dark",
	Darker: 2,
	2: "Darker",
	Darkest: 3,
	3: "Darkest",
});
/**
 */
export class Size {
	static __wrap(ptr) {
		const obj = Object.create(Size.prototype);
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
		wasm.__wbg_size_free(ptr);
	}
	/**
	 */
	get width() {
		var ret = wasm.__wbg_get_size_width(this.ptr);
		return ret >>> 0;
	}
	/**
	 * @param {number} arg0
	 */
	set width(arg0) {
		wasm.__wbg_set_size_width(this.ptr, arg0);
	}
	/**
	 */
	get height() {
		var ret = wasm.__wbg_get_size_height(this.ptr);
		return ret >>> 0;
	}
	/**
	 * @param {number} arg0
	 */
	set height(arg0) {
		wasm.__wbg_set_size_height(this.ptr, arg0);
	}
}
/**
 */
export class World {
	static __wrap(ptr) {
		const obj = Object.create(World.prototype);
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
		wasm.__wbg_world_free(ptr);
	}
	/**
	 * @param {number} width
	 * @param {number} height
	 * @param {number} chunk_size
	 * @returns {World}
	 */
	static create(width, height, chunk_size) {
		var ret = wasm.world_create(width, height, chunk_size);
		return World.__wrap(ret);
	}
	/**
	 * @returns {Size}
	 */
	size() {
		var ret = wasm.world_size(this.ptr);
		return Size.__wrap(ret);
	}
	/**
	 * @returns {number}
	 */
	materials() {
		var ret = wasm.world_materials(this.ptr);
		return ret;
	}
	/**
	 * @returns {number}
	 */
	tints() {
		var ret = wasm.world_tints(this.ptr);
		return ret;
	}
	/**
	 */
	reset() {
		wasm.world_reset(this.ptr);
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} material
	 * @param {number} tint
	 * @param {number} spread
	 */
	place(x, y, material, tint, spread) {
		wasm.world_place(this.ptr, x, y, material, tint, spread);
	}
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
	paint(x1, y1, x2, y2, radius, material, tint, spread) {
		wasm.world_paint(this.ptr, x1, y1, x2, y2, radius, material, tint, spread);
	}
	/**
	 */
	simulate() {
		wasm.world_simulate(this.ptr);
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
		input = new URL("sand_bg.wasm", import.meta.url);
	}
	const imports = {};
	imports.wbg = {};
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
