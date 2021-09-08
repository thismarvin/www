import p5 from "p5";

type Event = "windowresize";

export abstract class App {
	public parent: HTMLElement;

	constructor(parent: HTMLElement) {
		this.parent = parent;
	}

	abstract event(p5: p5, event: Event): void;

	abstract initialize(p5: p5): void;
	abstract update(p5: p5): void;
	abstract draw(p5: p5): void;
}

export function create(app: App): void {
	if (app.parent === undefined) {
		return;
	}

	const sketch = (p5: p5) => {
		let canvas: p5.Renderer;
		let width: number;
		let height: number;

		p5.setup = function () {
			width = app.parent.clientWidth;
			height = app.parent.clientHeight;
			canvas = p5.createCanvas(width, height);
			canvas.parent(app.parent);
			canvas.attribute("alt", "");

			app.initialize(p5);
		};

		p5.draw = function () {
			app.update(p5);
			app.draw(p5);
		};

		p5.windowResized = function () {
			if (
				app.parent.clientWidth === width &&
				app.parent.clientHeight === height
			) {
				return;
			}

			width = app.parent.clientWidth;
			height = app.parent.clientHeight;
			p5.resizeCanvas(app.parent.clientWidth, app.parent.clientHeight);

			app.event(p5, "windowresize");
		};
	};

	new p5(sketch, app.parent);
}
