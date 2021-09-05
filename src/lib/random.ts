/**
 * Creates a pseudorandom number generator — that should be used to seed a better PRNG — from the hash of a given string.
 * @param str The string that will be hashed.
 * @remarks Code derived from https://github.com/bryc/code/blob/master/jshash/PRNGs.md#addendum-a-seed-generating-functions.
 * The original implementation can be found here https://github.com/aappleby/smhasher.
 */
export function xmur3(str: string): () => number {
	let h = 1779033703 ^ str.length;

	for (let i = 0; i < str.length; ++i) {
		(h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
			(h = (h << 13) | (h >>> 19));
	}

	return function () {
		(h = Math.imul(h ^ (h >>> 16), 2246822507)),
			(h = Math.imul(h ^ (h >>> 13), 3266489909));
		return (h ^= h >>> 16) >>> 0;
	};
}

/**
 * Creates a pseudorandom number generator from a given seed.
 * @param seed The integer used to initialize the pseudorandom number generator.
 * @remarks Code taken from https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
 * The original implementation can be found here https://gist.github.com/tommyettinger/46a874533244883189143505d203312c.
 */
export function mulberry32(seed: number): () => number {
	return function () {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * A pseudorandom number generator.
 */
export default class Random {
	#generator: () => number;

	/**
	 * Creates a pseudorandom number generator.
	 * @param seed An optional integer that can be used to seed the pseudorandom number generator.
	 * By default the seed is generated randomly using Math.random().
	 */
	constructor(seed?: number) {
		if (seed !== undefined) {
			this.#generator = mulberry32(Math.floor(seed));
		} else {
			this.#generator = mulberry32(
				Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
			);
		}
	}

	/**
	 * Returns a random integer within the range [min, max).
	 * @param min The miniumum value of the random number.
	 * @param max The maximum value of the random number (exclusive).
	 */
	public nextInt(min = 0, max = Number.MAX_SAFE_INTEGER): number {
		if (min === undefined || max === undefined) {
			return Math.floor(this.#generator() * Number.MAX_SAFE_INTEGER);
		}

		const a = Math.floor(min);
		const b = Math.floor(max);

		if (min > max) {
			throw new TypeError(
				"The 'max' parameter must be greater than the 'min' parameter."
			);
		}

		return a + Math.floor(this.#generator() * (b - a));
	}

	/**
	 * Returns a random float within the range [min, max).
	 * @param min The miniumum value of the random number.
	 * @param max The maximum value of the random number (exclusive).
	 */
	public nextFloat(min = 0, max = 1): number {
		if (min === undefined || max === undefined) {
			return this.#generator();
		}

		if (min > max) {
			throw new TypeError(
				"The 'max' parameter must be greater than the 'min' parameter."
			);
		}

		return min + this.#generator() * (max - min);
	}
}
