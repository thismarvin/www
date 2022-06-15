export class PointerState {
	public readonly x: number;
	public readonly y: number;
	public readonly buttons: number;
	public readonly lastEvent: PointerEvent;

	constructor(x: number, y: number, buttons: number, lastEvent: PointerEvent) {
		this.x = x;
		this.y = y;
		this.buttons = buttons;
		this.lastEvent = lastEvent;

		Object.defineProperty(this, "x", {
			writable: false,
		});
		Object.defineProperty(this, "y", {
			writable: false,
		});
		Object.defineProperty(this, "buttons", {
			writable: false,
		});
		Object.defineProperty(this, "lastEvent", {
			writable: false,
		});
	}

	/**
	 * Returns whether or not a given button is pressed.
	 * @param button A single button, or multiple comma separated buttons (e.g. leftclick, rightclick, etc.).
	 */
	public isButtonDown(button: string): boolean {
		// Format and separate "button" parameter into individual strings;
		const formattedButtons = button.toLocaleLowerCase().split(",");
		// Duplicate button strings would break this method, so get rid of them!
		const formattedButtonsSet = new Set<string>(formattedButtons);

		// Compute the cumulative value of all entries in formatedButtonsSet.
		let computedButtons = 0;
		for (const entry of formattedButtonsSet) {
			switch (entry.trim()) {
				case "leftclick":
					computedButtons += 1;
					break;
				case "rightclick":
					computedButtons += 2;
					break;
				case "middleclick":
					computedButtons += 4;
					break;
			}
		}

		return (this.buttons & computedButtons) !== 0;
	}

	/**
	 * Returns whether or not a given button is not pressed.
	 * @param button A single button, or multiple comma separated buttons (e.g. leftclick, rightclick, etc.).
	 */
	public isButtonUp(button: string): boolean {
		return !this.isButtonDown(button);
	}
}

export default class SmartPointer {
	public get x(): number | null {
		return this.#currentPointerState === null
			? null
			: this.#currentPointerState.x;
	}
	public get y(): number | null {
		return this.#currentPointerState === null
			? null
			: this.#currentPointerState.y;
	}

	#element: HTMLElement | null;
	#previousPointerState: PointerState | null;
	#currentPointerState: PointerState | null;

	#nextX: number;
	#nextY: number;
	#nextButtons: number;
	#nextLastEvent: PointerEvent | null;

	constructor() {
		this.#element = null;
		this.#previousPointerState = null;
		this.#currentPointerState = null;
		this.#nextX = 0;
		this.#nextY = 0;
		this.#nextButtons = 0;
		this.#nextLastEvent = null;
	}

	public attachElement(element: HTMLElement): void {
		this.#element = element;

		this.#element.addEventListener("pointermove", (event) => {
			if (this.#element === null) {
				throw new Error("unreachable");
			}

			this.#nextX = event.pageX - this.#element.offsetLeft;
			this.#nextY = event.pageY - this.#element.offsetTop;
			this.#nextButtons = event.buttons;
			this.#nextLastEvent = event;
		});
		this.#element.addEventListener("pointerdown", (event) => {
			if (this.#element === null) {
				throw new Error("unreachable");
			}

			this.#nextX = event.pageX - this.#element.offsetLeft;
			this.#nextY = event.pageY - this.#element.offsetTop;
			this.#nextButtons = event.buttons;
			this.#nextLastEvent = event;
		});
		this.#element.addEventListener("pointerup", (event) => {
			if (this.#element === null) {
				throw new Error("unreachable");
			}

			this.#nextX = event.pageX - this.#element.offsetLeft;
			this.#nextY = event.pageY - this.#element.offsetTop;
			this.#nextButtons = event.buttons;
			this.#nextLastEvent = event;
		});
		this.#element.addEventListener("blur", () => {
			this.#nextButtons = 0;
			this.#nextLastEvent = null;
		});
	}

	public getState(): PointerState | null {
		if (this.#nextLastEvent == null) {
			return null;
		}

		return new PointerState(
			this.#nextX,
			this.#nextY,
			this.#nextButtons,
			this.#nextLastEvent
		);
	}

	public pressed(button: string): boolean {
		if (
			this.#previousPointerState === null ||
			this.#currentPointerState === null
		) {
			return false;
		}

		return (
			this.#previousPointerState.isButtonUp(button) &&
			this.#currentPointerState.isButtonDown(button)
		);
	}

	public pressing(button: string): boolean {
		if (this.#currentPointerState === null) {
			return false;
		}

		return this.#currentPointerState.isButtonDown(button);
	}

	public update(): void {
		this.#previousPointerState = this.#currentPointerState;
		this.#currentPointerState = this.getState();
	}
}
