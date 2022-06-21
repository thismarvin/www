export function createImageFromURL(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		try {
			const image = new Image();

			image.onload = () => {
				resolve(image);
			};

			image.src = url;
		} catch (error) {
			reject(error);
		}
	});
}

export default class Texture2D {
	public readonly width: number;
	public readonly height: number;
	public readonly texelWidth: number;
	public readonly texelHeight: number;
	public readonly texture: WebGLTexture;

	constructor(width: number, height: number, texture: WebGLTexture) {
		this.width = width;
		this.height = height;
		this.texelWidth = 1 / this.width;
		this.texelHeight = 1 / this.height;
		this.texture = texture;
	}
}
