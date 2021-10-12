<script lang="ts">
	import init, { Material, Tint, World } from "./_sand";
	import { onMount } from "svelte";
	import SmartPointer from "$lib/pointer";

	interface InitOutput {
		readonly memory: WebAssembly.Memory;
	}

	let wasm: InitOutput | null = null;

	const width = 128;
	const height = 128;

	let world: World | null = null;
	let cellsPtr: number | null = null;
	let cells: Uint8Array | null = null;

	let parent: HTMLElement | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;

	let scale = 1;
	let cellSize = 0;
	let brushRadius = 4;

	const smartPointer = new SmartPointer();

	function update() {
		smartPointer.update();

		if (smartPointer.pressing("LeftClick")) {
			const x1 = Math.floor(smartPointer.x / scale);
			const y1 = Math.floor(smartPointer.y / scale);

			world.paint(x1, y1, x1, y1, brushRadius, Material.Sand, Tint.None, 4);
		}

		world.simulate();
	}

	function draw() {
		ctx.fillStyle = "#ffffff";
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let size = Math.ceil(cellSize);

		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				switch (cells[y * width + x]) {
					case Material.Sand: {
						ctx.fillStyle = "#ffd5c3";
						break;
					}
					default: {
						continue;
					}
				}
				ctx.fillRect(x * cellSize, y * cellSize, size, size);
			}
		}
	}

	const target = 1 / 60;
	const maxFrameSkip = 10;
	const maxDeltaTime = maxFrameSkip * target;

	let totalElapsedTime = 0;
	let accumulator = 0;

	function loop(timeStamp: number) {
		let deltaTime = (timeStamp - totalElapsedTime) / 1000;

		if (Number.isNaN(deltaTime)) {
			deltaTime = 0;
		}

		if (deltaTime > maxDeltaTime) {
			deltaTime = maxDeltaTime;
		}

		totalElapsedTime = timeStamp;

		accumulator += deltaTime;

		while (accumulator >= target) {
			update();

			accumulator -= target;
		}

		draw();

		requestAnimationFrame((timeStamp) => loop(timeStamp));
	}

	onMount(async () => {
		wasm = ((await init()) as unknown) as InitOutput;

		world = World.with_size(width, height);
		cellsPtr = world.data();
		cells = new Uint8Array(wasm.memory.buffer, cellsPtr, width * height);

		parent = document.getElementById("parent");
		canvas = document.getElementById("sandCanvas") as HTMLCanvasElement;

		canvas.width = parent.clientWidth * 2;
		canvas.height = parent.clientHeight * 2;
		canvas.style.width = `${parent.clientWidth}px`;
		canvas.style.height = `${parent.clientHeight}px`;

		ctx = canvas.getContext("2d");

		smartPointer.attachElement(parent);

		scale = parseInt(canvas.style.width) / width;
		cellSize = canvas.width / width;

		loop(0);
	});
</script>

<div id="parent" class="canvas-wrapper">
	<div class="canvas-container">
		<canvas id="sandCanvas" />
	</div>
</div>

<style lang="scss">
	.canvas-wrapper {
		position: relative;
		padding-top: calc(1 / (1 / 1) * 100%);
	}

	.canvas-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		box-shadow: var(--primary-box-shadow);
	}
</style>
