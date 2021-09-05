/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import type p5 from "p5";
import { App } from "$lib/p5app";
import Random, { xmur3 } from "$lib/random";

type Variance = {
	gridSize: number;
	paletteSize: number;
	totalModules: number;
	iterations: number;
	minHits: number;
	density: number;
	spread: number;
	fillFrequency: number;
	multiplierFrequency: number;
	uniformFrequency: number;
	dotFrequency: number;
};

type Params = {
	p5: p5;
	rng: Random;
	variance: Variance;
	palette: p5.Color[];
	size: number;
};

type Module = (x: number, y: number, params: Params) => void;

export default class Art extends App {
	#seedGenerator: () => number;
	#seed: number;
	#palette: p5.Color[];
	#refresh: boolean;

	private getRandomColor(params: Params): p5.Color {
		const ref = params.palette[params.rng.nextInt(0, params.palette.length)];

		const color = params.p5.color(ref.toString());
		color.setAlpha(params.rng.nextInt(50, 255));

		return color;
	}

	private style(params: Params) {
		const color = this.getRandomColor(params);

		if (params.rng.nextInt() < params.variance.fillFrequency) {
			params.p5.noStroke();
			params.p5.fill(color);
		} else {
			params.p5.strokeWeight(
				params.rng.nextInt(params.p5.width * 0.01, params.size * 0.5)
			);
			params.p5.stroke(color);
			params.p5.noFill();
		}
	}

	private drawBezier(x: number, y: number, params: Params) {
		const x1 =
			x +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);
		const y1 =
			y +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);
		const x2 =
			x +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);
		const y2 =
			y +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);
		const x3 =
			x +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);
		const y3 =
			y +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);
		const x4 =
			x +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);
		const y4 =
			y +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);

		this.style(params);

		params.p5.bezier(
			x1 * params.size,
			y1 * params.size,
			x2 * params.size,
			y2 * params.size,
			x3 * params.size,
			y3 * params.size,
			x4 * params.size,
			y4 * params.size
		);
	}

	private drawLine(x: number, y: number, params: Params) {
		const x1 =
			x +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);
		const y1 =
			y +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);
		const x2 =
			x +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);
		const y2 =
			y +
			params.rng.nextInt(-params.variance.spread, params.variance.spread + 1);

		this.style(params);

		params.p5.line(
			x1 * params.size,
			y1 * params.size,
			x2 * params.size,
			y2 * params.size
		);
	}

	private drawPolar(x: number, y: number, params: Params) {
		const total = params.rng.nextInt(3, 16 + 1);
		const radius = params.rng.nextInt(
			params.p5.width * 0.05,
			params.size * params.variance.spread + 1
		);
		const angle = params.p5.TAU / total;

		for (let i = 0; i < total; ++i) {
			this.style(params);

			params.p5.circle(
				x * params.size + params.size * 0.5 + params.p5.cos(angle * i) * radius,
				y * params.size + params.size * 0.5 + params.p5.sin(angle * i) * radius,
				params.rng.nextInt(params.p5.width * 0.05, params.size + 1)
			);
		}
	}

	private drawSquircle(x: number, y: number, params: Params) {
		let w = params.rng.nextFloat(params.p5.width * 0.05, params.size);
		let h = params.rng.nextFloat(params.p5.width * 0.05, params.size);
		let rounded = params.rng.nextFloat(0, params.size);

		if (params.rng.nextFloat() < params.variance.multiplierFrequency) {
			w *= params.variance.spread;
			h *= params.variance.spread;
			rounded *= params.variance.spread;
		}

		const offsetX = (params.size - w) / 2;
		const offsetY = (params.size - h) / 2;

		this.style(params);

		params.p5.rect(
			x * params.size +
				offsetX +
				params.size * 0.5 +
				params.rng.nextInt(
					-params.variance.spread,
					params.variance.spread + 1
				) *
					params.size *
					0.5,
			y * params.size +
				offsetY +
				params.size * 0.5 +
				params.rng.nextInt(
					-params.variance.spread,
					params.variance.spread + 1
				) *
					params.size *
					0.5,
			w,
			h,
			rounded
		);
	}

	private drawCircle(x: number, y: number, params: Params) {
		let radius = params.rng.nextFloat(params.p5.width * 0.05, params.size);

		if (params.rng.nextFloat() < params.variance.multiplierFrequency) {
			radius *= params.variance.spread;
		}

		this.style(params);

		params.p5.circle(
			x * params.size +
				params.size * 0.5 +
				params.rng.nextInt(
					-params.variance.spread,
					params.variance.spread + 1
				) *
					params.size *
					0.5,
			y * params.size +
				params.size * 0.5 +
				params.rng.nextInt(
					-params.variance.spread,
					params.variance.spread + 1
				) *
					params.size *
					0.5,
			radius
		);
	}

	private drawIrregular(x: number, y: number, params: Params) {
		const total = params.rng.nextInt(4, 8 + 1);
		const radius = params.rng.nextInt(
			params.p5.width * 0.1,
			params.size * params.variance.spread
		);
		const angle = params.p5.TAU / total;
		const angleOffset = params.rng.nextFloat(0, params.p5.TAU);

		this.style(params);

		params.p5.beginShape();
		for (let i = 0; i < total; ++i) {
			params.p5.vertex(
				x * params.size +
					params.size * 0.5 +
					params.p5.cos(angle * i + angleOffset) *
						radius *
						params.rng.nextFloat(0.1, 3),
				y * params.size +
					params.size * 0.5 +
					params.p5.sin(angle * i + angleOffset) *
						radius *
						params.rng.nextFloat(0.1, 3)
			);
		}
		params.p5.endShape(params.p5.CLOSE);
	}

	private drawStar(x: number, y: number, params: Params) {
		const total = 10;
		const radius = params.rng.nextInt(
			params.p5.width * 0.1,
			params.size * params.variance.spread
		);
		const angle = params.p5.TAU / total;
		const angleOffset = params.rng.nextFloat(0, params.p5.TAU);

		this.style(params);

		params.p5.beginShape();
		for (let i = 0; i < total; ++i) {
			const temp = i % 2 === 0 ? radius : radius * 0.6;

			params.p5.vertex(
				x * params.size +
					params.size * 0.5 +
					params.p5.cos(angle * i + angleOffset) * temp,
				y * params.size +
					params.size * 0.5 +
					params.p5.sin(angle * i + angleOffset) * temp
			);
		}
		params.p5.endShape(params.p5.CLOSE);
	}

	private drawDots(x: number, y: number, params: Params) {
		const size = params.rng.nextInt(2, 5 + 1);
		const radius = (params.size / size) * 0.5;
		const uniform = params.rng.nextFloat() < params.variance.uniformFrequency;

		if (uniform) {
			this.style(params);
		}

		for (let j = 0; j < size; ++j) {
			for (let i = 0; i < size; ++i) {
				if (params.rng.nextFloat() >= params.variance.dotFrequency) {
					continue;
				}

				if (!uniform) {
					this.style(params);
				}

				params.p5.circle(
					x * params.size + i * radius * 3,
					y * params.size + j * radius * 3,
					radius
				);
			}
		}
	}

	private drawArc(x: number, y: number, params: Params) {
		let w = params.rng.nextFloat(params.p5.width * 0.01, params.size);
		let h = params.rng.nextFloat(params.p5.width * 0.01, params.size);
		const start = params.rng.nextFloat(0, params.p5.TAU);
		const end = params.rng.nextFloat(0, params.p5.TAU);

		if (params.rng.nextFloat() < params.variance.multiplierFrequency) {
			w *= params.variance.spread;
			h *= params.variance.spread;
		}

		this.style(params);

		params.p5.arc(
			x * params.size + params.size * 0.5,
			y * params.size + params.size * 0.5,
			w,
			h,
			start,
			end,
			params.p5.PIE
		);
	}

	private generate(p5: p5, seed: number): void {
		const rng = new Random(seed);

		const allModules: Module[] = [
			this.drawLine,
			this.drawBezier,
			this.drawPolar,
			this.drawSquircle,
			this.drawCircle,
			this.drawIrregular,
			this.drawStar,
			this.drawDots,
			this.drawArc,
		];

		const gridSize = rng.nextInt(3, 10 + 1);
		const totalCells = gridSize ** 2;

		const variance: Variance = {
			gridSize,
			paletteSize: rng.nextInt(2, this.#palette.length + 1),
			totalModules: rng.nextInt(1, allModules.length + 1),
			iterations: rng.nextInt(2, 8 + 1),
			minHits: rng.nextInt(Math.ceil(totalCells * 0.2), totalCells * 0.5),
			density: rng.nextFloat(0.2, 1),
			spread: rng.nextFloat(1, gridSize),
			fillFrequency: rng.nextFloat(0.1, 1),
			multiplierFrequency: rng.nextFloat(0.1, 1),
			uniformFrequency: rng.nextFloat(),
			dotFrequency: rng.nextFloat(0.1, 1),
		};

		// console.log(variance);

		const paletteCopy = this.#palette.slice(0);
		const palette: p5.Color[] = [];

		for (let i = 0; i < variance.paletteSize; ++i) {
			const index = rng.nextInt(0, paletteCopy.length);
			palette.push(paletteCopy[index]);
			paletteCopy.splice(index, 1);
		}

		const moduleCopy = allModules.slice(0);
		const modules: Module[] = [];

		for (let i = 0; i < variance.totalModules; ++i) {
			const index = rng.nextInt(0, moduleCopy.length);
			modules.push(moduleCopy[index].bind(this));
			moduleCopy.splice(index, 1);
		}

		const params: Params = {
			p5,
			rng,
			variance,
			palette,
			size: p5.width / gridSize,
		};

		let hits = 0;

		p5.background(255);

		while (hits < variance.minHits) {
			for (let i = 0; i < variance.iterations; ++i) {
				for (let y = 0; y < gridSize; ++y) {
					for (let x = 0; x < gridSize; ++x) {
						if (rng.nextFloat() >= variance.density) {
							continue;
						}

						const index = rng.nextInt(0, modules.length);

						modules[index](x, y, params);
						hits += 1;
					}
				}
			}
		}
	}

	public anew(): void {
		this.#seed = this.#seedGenerator();
		this.#refresh = true;
	}

	event(p5: p5, event: "windowresize"): void {
		switch (event) {
			case "windowresize": {
				this.#refresh = true;
				break;
			}
		}
	}

	initialize(p5: p5): void {
		const convert = (number: number): string => {
			switch (number) {
				case 0:
					return "a";
				case 1:
					return "e";
				case 2:
					return "i";
				case 3:
					return "m";
				case 4:
					return "q";
				case 5:
					return "s";
				case 6:
					return "o";
				case 7:
					return "k";
				case 8:
					return "g";
				case 9:
					return "c";
			}
		};

		const date = new Date();
		const iso = date.toISOString().substring(0, 10).split("-").join("");

		// Yeah, this is probably extra, but I figured alpha characters are more spread out than numeric ones...
		const string = iso
			.split("")
			.map((i) => convert(parseInt(i)))
			.join("");

		this.#seedGenerator = xmur3(string);
		this.#seed = this.#seedGenerator();
		this.#palette = [
			p5.color(0, 0, 0),
			p5.color(15, 0, 78),
			p5.color(178, 0, 255),
			p5.color(255, 0, 77),
			p5.color(255, 255, 255),
		];
		this.#refresh = false;

		this.generate(p5, this.#seed);
	}

	update(p5: p5): void {
		if (this.#refresh) {
			this.generate(p5, this.#seed);
			this.#refresh = false;
		}
	}
	draw(p5: p5): void {}
}
