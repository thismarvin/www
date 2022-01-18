import { clamp } from "./mathExt";

function _clampValue(value: number): number {
	return clamp(value, 0, 1);
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
		return new Color(0, 0, 0, 1);
	}

	public static multiply(color: Color, alpha: number): Color {
		const a = _clampValue(alpha);

		const r = _clampValue(color.r * a);
		const g = _clampValue(color.g * a);
		const b = _clampValue(color.b * a);

		return new Color(r, g, b, a);
	}

	public static fromHex(value: number, a?: number): Color {
		const r = _clampValue((value >> 16) / 255);
		const g = _clampValue(((value & 0x00ff00) >> 8) / 255);
		const b = _clampValue((value & 0x0000ff) / 255);

		if (a === undefined) {
			return new Color(r, g, b, 1);
		}

		const temp = new Color(r, g, b, 1);

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
		const sanitizedR = _clampValue(r / 255);
		const sanitizedG = _clampValue(g / 255);
		const sanitizedB = _clampValue(b / 255);

		if (a === undefined) {
			return new Color(sanitizedR, sanitizedG, sanitizedB, 1);
		}

		const temp = new Color(sanitizedR, sanitizedG, sanitizedB, 1);

		return Color.multiply(temp, a);
	}
}
