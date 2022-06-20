import { clamp } from "./mathExt";

function _clampValue(value: number): number {
	return clamp(value, 0, 255);
}

export default class Color {
	public readonly r: number;
	public readonly g: number;
	public readonly b: number;
	public readonly a: number;

	public static get TRANSPARENT(): Color {
		return new Color(0, 0, 0, 0);
	}
	public static get BLACK(): Color {
		return new Color(0, 0, 0, 1);
	}
	public static get WHITE(): Color {
		return new Color(255, 255, 255, 1);
	}
	public static get RED(): Color {
		return new Color(255, 0, 0, 1);
	}
	public static get GREEN(): Color {
		return new Color(0, 255, 0, 1);
	}
	public static get BLUE(): Color {
		return new Color(0, 0, 255, 1);
	}

	constructor(r: number, g: number, b: number, a: number) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	public intoArray(): Uint8ClampedArray {
		return Uint8ClampedArray.from([this.r, this.g, this.b, this.a]);
	}

	public multiply(alpha: number): Color {
		const tmp = clamp(alpha, 0, 1);

		const r = _clampValue(this.r * tmp);
		const g = _clampValue(this.g * tmp);
		const b = _clampValue(this.b * tmp);
		const a = 255 * tmp;

		return new Color(r, g, b, a);
	}

	public static fromHex(value: number, a?: number): Color {
		const r = _clampValue(value >> 16);
		const g = _clampValue((value & 0x00ff00) >> 8);
		const b = _clampValue(value & 0x0000ff);

		if (a === undefined) {
			return new Color(r, g, b, 255);
		}

		return new Color(r, g, b, 255).multiply(a);
	}

	public static fromHexString(value: string, a?: number): Color {
		const sanitized = (() => {
			let sanitized = value.toLowerCase().trim();

			if (sanitized.substring(0, 1) === "#") {
				sanitized = sanitized.substring(1);
			}

			return sanitized;
		})();

		if (!/^[\da-f]{6}$/.test(sanitized))
			throw new TypeError(
				"The given string could not be parsed as a hexadecimal value."
			);

		const hexAsNumber = parseInt(sanitized, 16);

		return Color.fromHex(hexAsNumber, a);
	}
}
