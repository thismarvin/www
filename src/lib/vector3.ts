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
	public static get X(): Vector3 {
		return new Vector3(1, 0, 0);
	}
	public static get Y(): Vector3 {
		return new Vector3(0, 1, 0);
	}
	public static get Z(): Vector3 {
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

	public lengthSquared(): number {
		return this.x ** 2 + this.y ** 2 + this.z ** 2;
	}

	public length(): number {
		return Math.sqrt(this.lengthSquared());
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

	public distanceSquared(other: Vector3): number {
		const x = this.x - other.x;
		const y = this.y - other.y;
		const z = this.z - other.z;

		return x ** 2 + y ** 2 + z ** 2;
	}

	public distance(other: Vector3): number {
		return Math.sqrt(this.distanceSquared(other));
	}

	public dot(other: Vector3): number {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	public lerp(other: Vector3, step: number): Vector3 {
		const x = MathExt.lerp(this.x, other.x, step);
		const y = MathExt.lerp(this.y, other.y, step);
		const z = MathExt.lerp(this.z, other.z, step);

		return new Vector3(x, y, z);
	}

	public lerpPrecise(other: Vector3, step: number): Vector3 {
		const x = MathExt.lerpPrecise(this.x, other.x, step);
		const y = MathExt.lerpPrecise(this.y, other.y, step);
		const z = MathExt.lerpPrecise(this.z, other.z, step);

		return new Vector3(x, y, z);
	}

	public cross(other: Vector3): Vector3 {
		const x = this.y * other.z - other.y * this.z;
		const y = this.z * other.x - other.z * this.x;
		const z = this.x * other.y - other.x * this.y;

		return new Vector3(x, y, z);
	}

	public add(other: Vector3): Vector3 {
		const x = this.x + other.x;
		const y = this.y + other.y;
		const z = this.z + other.z;

		return new Vector3(x, y, z);
	}

	public subtract(other: Vector3): Vector3 {
		const x = this.x - other.x;
		const y = this.y - other.y;
		const z = this.z - other.z;

		return new Vector3(x, y, z);
	}

	public multiply(other: Vector3): Vector3 {
		const x = this.x * other.x;
		const y = this.y * other.y;
		const z = this.z * other.z;

		return new Vector3(x, y, z);
	}

	public divide(other: Vector3): Vector3 {
		const x = this.x / other.x;
		const y = this.y / other.y;
		const z = this.z / other.z;

		return new Vector3(x, y, z);
	}

	public addScalar(scalar: number): Vector3 {
		const x = this.x + scalar;
		const y = this.y + scalar;
		const z = this.z + scalar;

		return new Vector3(x, y, z);
	}

	public subtractScalar(scalar: number): Vector3 {
		const x = this.x - scalar;
		const y = this.y - scalar;
		const z = this.z - scalar;

		return new Vector3(x, y, z);
	}

	public multiplyScalar(scalar: number): Vector3 {
		const x = this.x * scalar;
		const y = this.y * scalar;
		const z = this.z * scalar;

		return new Vector3(x, y, z);
	}

	public divideScalar(scalar: number): Vector3 {
		const x = this.x / scalar;
		const y = this.y / scalar;
		const z = this.z / scalar;

		return new Vector3(x, y, z);
	}

	public transform(matrix: Matrix4): Vector3 {
		const x =
			this.x * matrix.data[0] +
			this.y * matrix.data[4] +
			this.z * matrix.data[8] +
			matrix.data[12];
		const y =
			this.x * matrix.data[1] +
			this.y * matrix.data[5] +
			this.z * matrix.data[9] +
			matrix.data[13];
		const z =
			this.x * matrix.data[2] +
			this.y * matrix.data[6] +
			this.z * matrix.data[10] +
			matrix.data[14];

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
}
