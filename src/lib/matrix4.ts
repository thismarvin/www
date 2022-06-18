import type Quaternion from "./rotation";
import type Transform from "./transform";
import type Vector3 from "./vector3";

function _getEmptyData(): Float32Array {
	return Float32Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

function _getIdentityData(): Float32Array {
	return Float32Array.from([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

export default class Matrix4 {
	public get rows(): number {
		return this.#rows;
	}
	public get columns(): number {
		return this.#columns;
	}
	public get data(): Float32Array {
		return this.#data;
	}

	public static get IDENTITY(): Matrix4 {
		return new Matrix4(_getIdentityData());
	}

	#rows: number;
	#columns: number;
	#data: Float32Array;

	constructor(data?: Float32Array) {
		this.#rows = 4;
		this.#columns = 4;
		this.#data = new Float32Array(this.#rows * this.#columns).fill(0);

		if (data !== undefined) {
			this.setData(data);
		}
	}

	public setData(data: Float32Array): Matrix4 {
		if (data.length !== this.#rows * this.#columns) {
			throw new TypeError(
				"The given data does not match the dimensions of the matrix."
			);
		}

		this.#data = data.slice(0);

		return this;
	}

	public get(x: number, y: number): number {
		return this.#data[this.#columns * y + x];
	}

	public set(x: number, y: number, value: number): Matrix4 {
		this.#data[this.#columns * y + x] = value;

		return this;
	}

	public transpose(): Matrix4 {
		const temp = _getEmptyData();

		temp[0] = this.#data[0];
		temp[1] = this.#data[4];
		temp[2] = this.#data[8];
		temp[3] = this.#data[12];
		temp[4] = this.#data[1];
		temp[5] = this.#data[5];
		temp[6] = this.#data[9];
		temp[7] = this.#data[13];
		temp[8] = this.#data[2];
		temp[9] = this.#data[6];
		temp[10] = this.#data[10];
		temp[11] = this.#data[14];
		temp[12] = this.#data[3];
		temp[13] = this.#data[7];
		temp[14] = this.#data[11];
		temp[15] = this.#data[15];

		this.#data = temp;

		return this;
	}

	public toString(): string {
		return `(${this.data[0]}, ${this.data[1]}, ${this.data[2]}, ${this.data[3]}) (${this.data[4]}, ${this.data[5]}, ${this.data[6]}, ${this.data[7]}) (${this.data[8]}, ${this.data[9]}, ${this.data[10]}, ${this.data[11]}) (${this.data[12]}, ${this.data[13]}, ${this.data[14]}, ${this.data[15]})`;
	}

	public add(other: Matrix4): Matrix4 {
		const temp = this.data.slice(0);

		for (let i = 0; i < temp.length; i++) {
			temp[i] += other.data[i];
		}

		return new Matrix4(temp);
	}

	public subtract(other: Matrix4): Matrix4 {
		const temp = this.data.slice(0);

		for (let i = 0; i < temp.length; i++) {
			temp[i] -= other.data[i];
		}

		return new Matrix4(temp);
	}

	public multiply(other: Matrix4): Matrix4 {
		const temp = new Float32Array(16).fill(0);

		temp[0] =
			this.data[0] * other.data[0] +
			this.data[1] * other.data[4] +
			this.data[2] * other.data[8] +
			this.data[3] * other.data[12];
		temp[1] =
			this.data[0] * other.data[1] +
			this.data[1] * other.data[5] +
			this.data[2] * other.data[9] +
			this.data[3] * other.data[13];
		temp[2] =
			this.data[0] * other.data[2] +
			this.data[1] * other.data[6] +
			this.data[2] * other.data[10] +
			this.data[3] * other.data[14];
		temp[3] =
			this.data[0] * other.data[3] +
			this.data[1] * other.data[7] +
			this.data[2] * other.data[11] +
			this.data[3] * other.data[15];

		temp[4] =
			this.data[4] * other.data[0] +
			this.data[5] * other.data[4] +
			this.data[6] * other.data[8] +
			this.data[7] * other.data[12];
		temp[5] =
			this.data[4] * other.data[1] +
			this.data[5] * other.data[5] +
			this.data[6] * other.data[9] +
			this.data[7] * other.data[13];
		temp[6] =
			this.data[4] * other.data[2] +
			this.data[5] * other.data[6] +
			this.data[6] * other.data[10] +
			this.data[7] * other.data[14];
		temp[7] =
			this.data[4] * other.data[3] +
			this.data[5] * other.data[7] +
			this.data[6] * other.data[11] +
			this.data[7] * other.data[15];

		temp[8] =
			this.data[8] * other.data[0] +
			this.data[9] * other.data[4] +
			this.data[10] * other.data[8] +
			this.data[11] * other.data[12];
		temp[9] =
			this.data[8] * other.data[1] +
			this.data[9] * other.data[5] +
			this.data[10] * other.data[9] +
			this.data[11] * other.data[13];
		temp[10] =
			this.data[8] * other.data[2] +
			this.data[9] * other.data[6] +
			this.data[10] * other.data[10] +
			this.data[11] * other.data[14];
		temp[11] =
			this.data[8] * other.data[3] +
			this.data[9] * other.data[7] +
			this.data[10] * other.data[11] +
			this.data[11] * other.data[15];

		temp[12] =
			this.data[12] * other.data[0] +
			this.data[13] * other.data[4] +
			this.data[14] * other.data[8] +
			this.data[15] * other.data[12];
		temp[13] =
			this.data[12] * other.data[1] +
			this.data[13] * other.data[5] +
			this.data[14] * other.data[9] +
			this.data[15] * other.data[13];
		temp[14] =
			this.data[12] * other.data[2] +
			this.data[13] * other.data[6] +
			this.data[14] * other.data[10] +
			this.data[15] * other.data[14];
		temp[15] =
			this.data[12] * other.data[3] +
			this.data[13] * other.data[7] +
			this.data[14] * other.data[11] +
			this.data[15] * other.data[15];

		return new Matrix4(temp);
	}

	public addScalar(scalar: number): Matrix4 {
		const temp = this.data.slice(0);

		for (let i = 0; i < temp.length; i++) {
			temp[i] += scalar;
		}

		return new Matrix4(temp);
	}

	public subtractScalar(scalar: number): Matrix4 {
		const temp = this.data.slice(0);

		for (let i = 0; i < temp.length; i++) {
			temp[i] -= scalar;
		}

		return new Matrix4(temp);
	}

	public multiplyScalar(scalar: number): Matrix4 {
		const temp = this.data.slice(0);

		for (let i = 0; i < temp.length; i++) {
			temp[i] *= scalar;
		}

		return new Matrix4(temp);
	}

	public divideScalar(scalar: number): Matrix4 {
		const temp = 1 / scalar;

		return this.multiplyScalar(temp);
	}

	public static createRotationX(angle: number): Matrix4 {
		const temp = _getIdentityData();

		temp[5] = Math.cos(angle);
		temp[6] = Math.sin(angle);
		temp[9] = -Math.sin(angle);
		temp[10] = Math.cos(angle);

		return new Matrix4(temp);
	}

	public static createRotationY(angle: number): Matrix4 {
		const temp = _getIdentityData();

		temp[0] = Math.cos(angle);
		temp[2] = -Math.sin(angle);
		temp[8] = Math.sin(angle);
		temp[10] = Math.cos(angle);

		return new Matrix4(temp);
	}

	public static createRotationZ(angle: number): Matrix4 {
		const temp = _getIdentityData();

		temp[0] = Math.cos(angle);
		temp[1] = Math.sin(angle);
		temp[4] = -Math.sin(angle);
		temp[5] = Math.cos(angle);

		return new Matrix4(temp);
	}

	public static createTranslation(x: number, y: number, z: number): Matrix4 {
		const temp = _getIdentityData();

		temp[12] = x;
		temp[13] = y;
		temp[14] = z;

		return new Matrix4(temp);
	}

	public static createScale(x: number, y: number, z: number): Matrix4 {
		const temp = _getIdentityData();

		temp[0] = x;
		temp[5] = y;
		temp[10] = z;

		return new Matrix4(temp);
	}

	public static createOrthographic(
		width: number,
		height: number,
		near: number,
		far: number
	): Matrix4 {
		const temp = _getIdentityData();
		const fn = 1 / (far - near);

		temp[0] = 2 / width;
		temp[5] = 2 / height;
		temp[10] = -2 * fn;
		temp[14] = -(far + near) * fn;

		return new Matrix4(temp);
	}

	public static createOrthographicOffCenter(
		left: number,
		right: number,
		bottom: number,
		top: number,
		near: number,
		far: number
	): Matrix4 {
		const temp = _getEmptyData();
		const rl = 1 / (right - left);
		const tb = 1 / (top - bottom);
		const fn = 1 / (far - near);

		temp[0] = 2 * rl;
		temp[5] = 2 * tb;
		temp[10] = -2 * fn;

		temp[12] = -(right + left) * rl;
		temp[13] = -(top + bottom) * tb;
		temp[14] = -(far + near) * fn;

		temp[15] = 1;

		return new Matrix4(temp);
	}

	public static createPerspective(
		width: number,
		height: number,
		near: number,
		far: number
	): Matrix4 {
		const temp = _getEmptyData();
		const fn = 1 / (far - near);

		temp[0] = (2 * near) / width;
		temp[5] = (2 * near) / height;
		temp[10] = -(far + near) * fn;
		temp[11] = -1;
		temp[14] = -2 * far * near * fn;

		return new Matrix4(temp);
	}

	public static createPerspectiveOffCenter(
		left: number,
		right: number,
		bottom: number,
		top: number,
		near: number,
		far: number
	): Matrix4 {
		const temp = _getEmptyData();
		const rl = 1 / (right - left);
		const tb = 1 / (top - bottom);
		const fn = 1 / (far - near);

		temp[0] = 2 * near * rl;
		temp[5] = 2 * near * tb;
		temp[8] = (right + left) * rl;
		temp[9] = (top + bottom) * tb;
		temp[10] = -(far + near) * fn;
		temp[11] = -1;
		temp[14] = -2 * far * near * fn;

		return new Matrix4(temp);
	}

	public static createLookAt(
		cameraPosition: Vector3,
		cameraTarget: Vector3,
		cameraUp: Vector3
	): Matrix4 {
		const a = cameraPosition.subtract(cameraTarget).normalize();
		const b = cameraUp.cross(a).normalize();
		const c = a.cross(b);

		const temp = _getIdentityData();

		temp[0] = b.x;
		temp[1] = c.x;
		temp[2] = a.x;

		temp[4] = b.y;
		temp[5] = c.y;
		temp[6] = a.y;

		temp[8] = b.z;
		temp[9] = c.z;
		temp[10] = a.z;

		temp[12] = -b.dot(cameraPosition);
		temp[13] = -c.dot(cameraPosition);
		temp[14] = -a.dot(cameraPosition);

		return new Matrix4(temp);
	}

	public static fromQuaternion(value: Quaternion): Matrix4 {
		// Yoinked from:
		// https://en.wikipedia.org/wiki/Rotation_matrix

		const data = Float32Array.from([
			1 - 2 * value.y ** 2 - 2 * value.z ** 2,
			2 * value.x * value.y - 2 * value.z * value.w,
			2 * value.x * value.z + 2 * value.y * value.w,
			0,
			2 * value.x * value.y + 2 * value.z * value.w,
			1 - 2 * value.x ** 2 - 2 * value.z ** 2,
			2 * value.y * value.z - 2 * value.x * value.w,
			0,
			2 * value.x * value.z - 2 * value.y * value.w,
			2 * value.y * value.z + 2 * value.x * value.w,
			1 - 2 * value.x ** 2 - 2 * value.y ** value.y,
			0,
			0,
			0,
			0,
			1,
		]);

		return new Matrix4(data);
	}

	public static fromTransform(value: Transform): Matrix4 {
		const scale = Matrix4.createScale(
			value.scale.x,
			value.scale.y,
			value.scale.z
		);
		const origin = Matrix4.createTranslation(
			value.origin.x,
			value.origin.y,
			value.origin.z
		);
		const rotation = Matrix4.fromQuaternion(value.rotation);
		const translation = Matrix4.createTranslation(
			value.translation.x,
			value.translation.y,
			value.translation.z
		);

		return Matrix4.IDENTITY.multiply(scale)
			.multiply(origin)
			.multiply(rotation)
			.multiply(translation);
	}
}
