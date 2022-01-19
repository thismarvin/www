import { clamp } from "./mathExt";

function _clampValue(value: number): number {
	return clamp(value, 0, 255);
}

export default class Color {
	public readonly r: number;
	public readonly g: number;
	public readonly b: number;
	public readonly a: number;

	constructor(r: number, g: number, b: number, a: number) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	public static default(): Color {
		return new Color(0, 0, 0, 255);
	}

	public static multiply(color: Color, alpha: number): Color {
		const tmp = clamp(alpha, 0, 1);

		const r = _clampValue(color.r * tmp);
		const g = _clampValue(color.g * tmp);
		const b = _clampValue(color.b * tmp);
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

		const temp = new Color(r, g, b, 255);

		return Color.multiply(temp, a);
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

	public static fromRgb(r: number, g: number, b: number, a?: number): Color {
		const sanitizedR = _clampValue(r);
		const sanitizedG = _clampValue(g);
		const sanitizedB = _clampValue(b);

		if (a === undefined) {
			return new Color(sanitizedR, sanitizedG, sanitizedB, 255);
		}

		const temp = new Color(sanitizedR, sanitizedG, sanitizedB, 255);

		return Color.multiply(temp, a);
	}
}
