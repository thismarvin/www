export enum PointerButton {
	// Usually the left button.
	Primary = 1,
	// Usually the right button.
	Secondary = 2,
	// Usually the mouse wheel button or middle button.
	Auxiliary = 4,
	// Usually the "Browser Back" button.
	Fourth = 8,
	// Usually the "Browser Forward" button.
	Fifth = 16,
}

export function isButtonDown(
	event: PointerEvent,
	button: PointerButton
): boolean {
	return (event.buttons & button) !== 0;
}

export function isButtonUp(
	event: PointerEvent,
	button: PointerButton
): boolean {
	return !isButtonDown(event, button);
}

export type PointerStateParams = {
	x: number;
	y: number;
	previousEvent: PointerEvent;
	currentEvent: PointerEvent;
};

export class PointerState {
	public readonly x: number;
	public readonly y: number;
	public readonly event: PointerEvent;

	readonly #previousEvent: PointerEvent;

	constructor(params: PointerStateParams) {
		this.x = params.x;
		this.y = params.y;
		this.event = params.currentEvent;
		this.#previousEvent = params.previousEvent;
	}

	public pressed(buttons: PointerButton): boolean {
		return (
			isButtonUp(this.#previousEvent, buttons) &&
			isButtonDown(this.event, buttons)
		);
	}

	public pressing(buttons: PointerButton): boolean {
		return isButtonDown(this.event, buttons);
	}

	public released(buttons: PointerButton): boolean {
		return (
			isButtonDown(this.#previousEvent, buttons) &&
			isButtonUp(this.event, buttons)
		);
	}
}

export default class SmartPointer {
	#parent: HTMLElement;
	#active: boolean;
	#x: number | null;
	#y: number | null;
	#event: PointerEvent | null;
	#previousEvent: PointerEvent | null;
	#currentEvent: PointerEvent | null;
	#onPointerEvent: (event: PointerEvent) => void;
	#onBlur: () => void;

	constructor(parent: HTMLElement) {
		this.#parent = parent;
		this.#previousEvent = null;
		this.#currentEvent = null;
		this.#active = false;
		this.#x = null;
		this.#y = null;
		this.#event = null;
		this.#onPointerEvent = (event: PointerEvent) => {
			this.#active = true;
			this.#x = event.pageX - this.#parent.offsetLeft;
			this.#y = event.pageY - this.#parent.offsetTop;
			this.#event = event;
		};
		this.#onBlur = () => {
			this.#active = false;
		};

		this.setupEventListeners();
	}

	private removeEventListeners(): void {
		this.#parent.removeEventListener(
			"pointermove",
			this.#onPointerEvent,
			false
		);
		this.#parent.removeEventListener(
			"pointerdown",
			this.#onPointerEvent,
			false
		);
		this.#parent.removeEventListener("pointerup", this.#onPointerEvent, false);
		this.#parent.removeEventListener("blur", this.#onBlur, false);
	}

	private setupEventListeners(): void {
		this.#parent.addEventListener("pointermove", this.#onPointerEvent, false);
		this.#parent.addEventListener("pointerdown", this.#onPointerEvent, false);
		this.#parent.addEventListener("pointerup", this.#onPointerEvent, false);
		this.#parent.addEventListener("blur", this.#onBlur, false);
	}

	public attachElement(element: HTMLElement): void {
		this.removeEventListeners();
		this.#parent = element;
		this.setupEventListeners();
	}

	public poll(): void {
		this.#previousEvent = this.#currentEvent;
		this.#currentEvent = this.#event;
	}

	public getState(): PointerState | null {
		if (
			!this.#active ||
			this.#x === null ||
			this.#y === null ||
			this.#currentEvent === null ||
			this.#previousEvent === null
		) {
			return null;
		}

		return new PointerState({
			x: this.#x,
			y: this.#y,
			previousEvent: this.#previousEvent,
			currentEvent: this.#currentEvent,
		});
	}
}
