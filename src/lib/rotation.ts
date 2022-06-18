export class EulerAngles {
	/** Rotation around the y-axis. */
	public yaw: number;
	/** Rotation around the x-axis. */
	public pitch: number;
	/** Rotation around the z-axis. */
	public roll: number;

	constructor(yaw: number, pitch: number, roll: number) {
		this.yaw = yaw;
		this.pitch = pitch;
		this.roll = roll;
	}

	public static fromQuaternion(value: Quaternion): EulerAngles {
		// Yoinked from:
		// https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
		//
		// Note that the code was modified to use OpenGL's coordinate system. The following steps were
		// taken to fix the coordinate system:
		// - `q.x` became z
		// - `q.y` became x
		// - `q.z` became y

		const siny_cosp = 2 * (value.w * value.y + value.x * value.z);
		const cosy_cosp = 1 - 2 * (value.x ** 2 + value.y ** 2);
		const yaw = Math.atan2(siny_cosp, cosy_cosp);

		const sinp = 2 * (value.w * value.x - value.y * value.z);
		const pitch = (() => {
			if (Math.abs(sinp) >= 1) {
				// Use 90 degrees if out of range
				return Math.PI * 0.5 * Math.sign(sinp);
			}

			return Math.asin(sinp);
		})();

		const sinr_cosp = 2 * (value.w * value.z + value.x * value.y);
		const cosr_cosp = 1 - 2 * (value.x ** 2 + value.z ** 2);
		const roll = Math.atan2(sinr_cosp, cosr_cosp);

		return new EulerAngles(yaw, pitch, roll);
	}
}

export default class Quaternion {
	public x: number;
	public y: number;
	public z: number;
	public w: number;

	public static get IDENTITY(): Quaternion {
		return new Quaternion(0, 0, 0, 1);
	}

	constructor(x: number, y: number, z: number, w: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	public static fromYawPitchRoll(
		yaw: number,
		pitch: number,
		roll: number
	): Quaternion {
		// Yoinked from:
		// https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
		//
		// Note that the code was modified to use OpenGL's coordinate system. The following steps were
		// taken to fix the coordinate system:
		// - `q.x` became z
		// - `q.y` became x
		// - `q.z` became y

		const cy = Math.cos(yaw * 0.5);
		const sy = Math.sin(yaw * 0.5);
		const cp = Math.cos(pitch * 0.5);
		const sp = Math.sin(pitch * 0.5);
		const cr = Math.cos(roll * 0.5);
		const sr = Math.sin(roll * 0.5);

		return new Quaternion(
			cy * sp * cr + sy * cp * sr,
			sy * cp * cr - cy * sp * sr,
			cy * cp * sr - sy * sp * cr,
			cy * cp * cr + sy * sp * sr
		);
	}

	public static fromEulerAngles(value: EulerAngles): Quaternion {
		return Quaternion.fromYawPitchRoll(value.yaw, value.pitch, value.roll);
	}
}
