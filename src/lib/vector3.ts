import * as MathExt from "./mathExt";
import type Matrix4 from "./matrix4";

export default class Vector3 {
	public x: number;
	public y: number;
	public z: number;

	public static get ZERO(): Vector3 {
		return new Vector3(0, 0, 0);
	}
	public static get ONE(): Vector3 {
		return new Vector3(1, 1, 1);
	}
	public static get UNIT_X(): Vector3 {
		return new Vector3(1, 0, 0);
	}
	public static get UNIT_Y(): Vector3 {
		return new Vector3(0, 1, 0);
	}
	public static get UNIT_Z(): Vector3 {
		return new Vector3(0, 0, 1);
	}
	public static get LEFT(): Vector3 {
		return new Vector3(-1, 0, 0);
	}
	public static get UP(): Vector3 {
		return new Vector3(0, 1, 0);
	}
	public static get RIGHT(): Vector3 {
		return new Vector3(1, 0, 0);
	}
	public static get DOWN(): Vector3 {
		return new Vector3(0, -1, 0);
	}
	public static get FORWARD(): Vector3 {
		return new Vector3(0, 0, -1);
	}
	public static get BACKWARD(): Vector3 {
		return new Vector3(0, 0, 1);
	}

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public length(): number {
		return Math.sqrt(this.lengthSquared());
	}

	public lengthSquared(): number {
		return this.x ** 2 + this.y ** 2 + this.z ** 2;
	}

	public normalize(): Vector3 {
		const magnitude = this.length();
		const temp = 1 / magnitude;

		this.x *= temp;
		this.y *= temp;
		this.z *= temp;

		return this;
	}

	public copy(vector: Vector3): Vector3 {
		this.x = vector.x;
		this.y = vector.y;
		this.z = vector.z;

		return this;
	}

	public clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	public toArray(): Float32Array {
		return Float32Array.from([this.x, this.y, this.z]);
	}

	public toString(): string {
		return `(${this.x}, ${this.y}, ${this.z})`;
	}

	public static distanceSquared(a: Vector3, b: Vector3): number {
		const x = a.x - b.x;
		const y = a.y - b.y;
		const z = a.z - b.z;

		return x ** 2 + y ** 2 + z ** 2;
	}

	public static distance(a: Vector3, b: Vector3): number {
		return Math.sqrt(Vector3.distanceSquared(a, b));
	}

	public static dot(a: Vector3, b: Vector3): number {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	public static lerp(a: Vector3, b: Vector3, step: number): Vector3 {
		const x = MathExt.lerp(a.x, b.x, step);
		const y = MathExt.lerp(a.y, b.y, step);
		const z = MathExt.lerp(a.z, b.z, step);

		return new Vector3(x, y, z);
	}

	public static lerpPrecise(a: Vector3, b: Vector3, step: number): Vector3 {
		const x = MathExt.lerpPrecise(a.x, b.x, step);
		const y = MathExt.lerpPrecise(a.y, b.y, step);
		const z = MathExt.lerpPrecise(a.z, b.z, step);

		return new Vector3(x, y, z);
	}

	/**
	 * Converts spherical coordinates into Cartesian coordinates (represented as a Vector3).
	 * @param radius The distance between the origin and the new point.
	 * @param inclination The angle between the point and y axis (latitude).
	 * @param azimuth The angle between the point and z axis (longitude).
	 */
	public static sphericalToCartesian(
		radius: number,
		inclination: number,
		azimuth: number
	): Vector3 {
		// Normally azimuth and inclination would be swapped in this formula.
		// However, because of OpenGL's coordinate system, they were switched around for the sake of convenience.
		return new Vector3(
			radius * Math.sin(azimuth) * Math.cos(inclination),
			radius * Math.sin(azimuth) * Math.sin(inclination),
			radius * Math.cos(azimuth)
		);
	}

	public static cross(a: Vector3, b: Vector3): Vector3 {
		const x = a.y * b.z - b.y * a.z;
		const y = a.z * b.x - b.z * a.x;
		const z = a.x * b.y - b.x * a.y;

		return new Vector3(x, y, z);
	}

	public static add(a: Vector3, b: Vector3): Vector3 {
		const x = a.x + b.x;
		const y = a.y + b.y;
		const z = a.z + b.z;

		return new Vector3(x, y, z);
	}

	public static subtract(a: Vector3, b: Vector3): Vector3 {
		const x = a.x - b.x;
		const y = a.y - b.y;
		const z = a.z - b.z;

		return new Vector3(x, y, z);
	}

	public static multiply(a: Vector3, b: Vector3): Vector3 {
		const x = a.x * b.x;
		const y = a.y * b.y;
		const z = a.z * b.z;

		return new Vector3(x, y, z);
	}

	public static divide(a: Vector3, b: Vector3): Vector3 {
		const x = a.x / b.x;
		const y = a.y / b.y;
		const z = a.z / b.z;

		return new Vector3(x, y, z);
	}

	public static addScalar(a: Vector3, scalar: number): Vector3 {
		const x = a.x + scalar;
		const y = a.y + scalar;
		const z = a.z + scalar;

		return new Vector3(x, y, z);
	}

	public static subtractScalar(a: Vector3, scalar: number): Vector3 {
		const x = a.x - scalar;
		const y = a.y - scalar;
		const z = a.z - scalar;

		return new Vector3(x, y, z);
	}

	public static multiplyScalar(a: Vector3, scalar: number): Vector3 {
		const x = a.x * scalar;
		const y = a.y * scalar;
		const z = a.z * scalar;

		return new Vector3(x, y, z);
	}

	public static divideScalar(a: Vector3, scalar: number): Vector3 {
		const x = a.x / scalar;
		const y = a.y / scalar;
		const z = a.z / scalar;

		return new Vector3(x, y, z);
	}

	public static transform(a: Vector3, b: Matrix4): Vector3 {
		const x = a.x * b.data[0] + a.y * b.data[4] + a.z * b.data[8] + b.data[12];
		const y = a.x * b.data[1] + a.y * b.data[5] + a.z * b.data[9] + b.data[13];
		const z = a.x * b.data[2] + a.y * b.data[6] + a.z * b.data[10] + b.data[14];

		return new Vector3(x, y, z);
	}
}
