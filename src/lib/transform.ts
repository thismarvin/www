import Quaternion from "./rotation";
import Vector3 from "./vector3";

export type TransformParams = {
	scale: Vector3;
	origin: Vector3;
	rotation: Quaternion;
	translation: Vector3;
};

export default class Transform {
	public scale: Vector3;
	public origin: Vector3;
	public rotation: Quaternion;
	public translation: Vector3;

	constructor(params: TransformParams) {
		this.scale = params.scale;
		this.origin = params.origin;
		this.rotation = params.rotation;
		this.translation = params.translation;
	}

	public static default(): Transform {
		return new Transform({
			scale: Vector3.ONE,
			origin: Vector3.ZERO,
			rotation: Quaternion.IDENTITY,
			translation: Vector3.ZERO,
		});
	}

	public setScale(x: number, y: number, z: number): Transform {
		this.scale.x = x;
		this.scale.y = y;
		this.scale.z = z;

		return this;
	}

	public setOrigin(x: number, y: number, z: number): Transform {
		this.origin.x = x;
		this.origin.y = y;
		this.origin.z = z;

		return this;
	}

	public setRotation(yaw: number, pitch: number, roll: number): Transform {
		this.rotation = Quaternion.fromYawPitchRoll(yaw, pitch, roll);

		return this;
	}

	public setTranslation(x: number, y: number, z: number): Transform {
		this.translation.x = x;
		this.translation.y = y;
		this.translation.z = z;

		return this;
	}
}
