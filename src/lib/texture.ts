import * as WebGL from "./webgl";

export function createImageFromURL(url: URL): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		try {
			const image = new Image();

			image.onload = () => {
				resolve(image);
			};

			image.src = url.toString();
		} catch (error) {
			reject(error);
		}
	});
}

export async function createTextureFromURL(
	url: URL,
	gl: WebGL.RenderingContext
): Promise<Texture2D> {
	const image = await createImageFromURL(url);
	const texture = WebGL.createTextureFromImage(gl, image);

	return new Texture2D(image, texture);
}

export default class Texture2D {
	public get width(): number {
		return this.image.width;
	}
	public get height(): number {
		return this.image.height;
	}

	public readonly image: HTMLImageElement;
	public readonly texelWidth: number;
	public readonly texelHeight: number;
	public readonly texture: WebGLTexture;

	constructor(image: HTMLImageElement, texture: WebGLTexture) {
		this.image = image;
		this.texelWidth = 1 / this.image.width;
		this.texelHeight = 1 / this.image.height;
		this.texture = texture;
	}
}
