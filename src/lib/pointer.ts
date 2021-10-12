export class PointerState {
	public readonly event: PointerEvent;

	constructor(event: PointerEvent) {
		this.event = event;

		Object.defineProperty(this, "event", {
			writable: false,
		});
	}
}

/**
 * Returns whether or not a given button is pressed on the mouse.
 * @param button A single mouse button, or multiple comma separated mouse buttons (e.g. leftclick, rightclick, etc.).
 * @param pointerState The current PointerState to test against.
 */
export function isButtonDown(
	button: string,
	pointerState: PointerState
): boolean {
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

	return (pointerState.event.buttons & computedButtons) !== 0;
}

export default class SmartPointer {
	public get x(): number {
		return this.#x;
	}
	public get y(): number {
		return this.#y;
	}

	#element: HTMLElement | null;
	#lastEvent: PointerEvent | null = null;
	#previousPointerState: PointerState | null;
	#currentPointerState: PointerState | null;
	#x: number;
	#y: number;

	constructor() {
		this.#element = null;
		this.#previousPointerState = null;
		this.#currentPointerState = null;
		this.#x = 0;
		this.#y = 0;
	}

	public attachElement(element: HTMLElement): void {
		this.#element = element;

		window.addEventListener("pointermove", (event) => {
			this.#lastEvent = event;
		});
		window.addEventListener("pointerdown", (event) => {
			this.#lastEvent = event;
		});
		window.addEventListener("pointerup", (event) => {
			this.#lastEvent = event;
		});
		window.addEventListener("blur", () => {
			this.#lastEvent = null;
		});
	}

	public getState(): PointerState {
		if (this.#lastEvent === null) {
			return null;
		}

		return new PointerState(this.#lastEvent);
	}

	public pressed(button: string): boolean {
		if (
			this.#previousPointerState === null ||
			this.#currentPointerState === null
		) {
			return false;
		}

		return (
			!isButtonDown(button, this.#previousPointerState) &&
			isButtonDown(button, this.#currentPointerState)
		);
	}

	public debug(): void {
		console.log(this.#currentPointerState.event);
		console.log(this.#element);
	}

	public pressing(button: string): boolean {
		if (this.#currentPointerState === null) {
			return false;
		}

		return isButtonDown(button, this.#currentPointerState);
	}

	public update(): void {
		this.#previousPointerState = this.#currentPointerState;
		this.#currentPointerState = this.getState();

		if (this.#element !== null && this.#currentPointerState !== null) {
			this.#x =
				this.#currentPointerState.event.clientX - this.#element.offsetLeft;
			this.#y =
				this.#currentPointerState.event.clientY - this.#element.offsetTop;
		}
	}
}
