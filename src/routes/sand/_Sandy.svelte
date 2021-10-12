<script lang="ts">
	import init, { Material, Tint, World } from "./_sand";
	import { onMount } from "svelte";
	import { makeNoise2D } from "open-simplex-noise";
	import SmartPointer from "$lib/pointer";

	interface InitOutput {
		readonly memory: WebAssembly.Memory;
	}

	let wasm: InitOutput | null = null;

	const width = 128;
	const height = 128;

	let world: World | null = null;
	let cellsPtr: number | null = null;
	let tintsPtr: number | null = null;
	let cells: Uint8Array | null = null;
	let tints: Uint8Array | null = null;

	let parent: HTMLElement | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;

	let scale = 1;
	let cellSize = 0;
	let brushRadius = 4;

	const tintNoise = makeNoise2D(Date.now());
	const tintNoiseStep = 0.05;
	let tintNoiseIndex = 0;

	const sandColors = ["#ffd5c3", "#ffcbba", "#f1b3b6", "#e7a5ab"];
	const waterColors = ["#7094ff"];
	const rockColors = ["#b884ff", "#a271ff", "#935bf2", "#7951e3"];
	const smokeColors = ["#ebebeb"];

	let simulationPaused = true;
	let repaint = false;

	let currentMaterial = Material.Sand;

	const smartPointer = new SmartPointer();

	function setCurrentMaterial(material: number): void {
		currentMaterial = material;
	}

	function toggleSimulation(): void {
		simulationPaused = !simulationPaused;
	}

	function clearWorld(): void {
		world.clear();
		repaint = true;
	}

	function randomRange(min: number, max: number): number {
		return min + Math.floor(Math.random() * (max - min));
	}

	function getSpread(material: number): number {
		switch (material) {
			case Material.Sand:
				return randomRange(1, 4 + 1);
			case Material.Water:
				return randomRange(4, 6 + 1);
			case Material.Smoke:
				return randomRange(1, 6 + 1);
			default:
				return 0;
		}
	}

	function getTint(): number {
		let rand = tintNoise(tintNoiseIndex, 0);
		tintNoiseIndex += tintNoiseStep;

		if (rand < -0.5) {
			return Tint.None;
		} else if (rand < 0) {
			return Tint.Dark;
		} else if (rand < 0.5) {
			return Tint.Darker;
		} else {
			return Tint.Darkest;
		}
	}

	function getColor(material: number, tint: number): string {
		switch (material) {
			case Material.Sand: {
				return sandColors[tint];
			}
			case Material.Water: {
				return waterColors[0];
			}
			case Material.Rock: {
				return rockColors[tint];
			}
			case Material.Smoke: {
				return smokeColors[0];
			}
			default: {
				return "#ffffff";
			}
		}
	}

	function update() {
		smartPointer.update();

		if (smartPointer.pressing("LeftClick")) {
			const x1 = Math.floor(smartPointer.x / scale);
			const y1 = Math.floor(smartPointer.y / scale);

			world.paint(
				x1,
				y1,
				x1,
				y1,
				brushRadius,
				currentMaterial,
				getTint(),
				getSpread(currentMaterial)
			);
			repaint = true;
		}

		if (!simulationPaused) {
			world.simulate();
		}
	}

	function draw() {
		if (simulationPaused && !repaint) {
			return;
		}

		ctx.fillStyle = "#ffffff";
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const size = Math.ceil(cellSize);

		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				const index = y * width + x;
				const material = cells[index];
				const tint = tints[index];

				ctx.fillStyle = getColor(material, tint);
				ctx.fillRect(x * cellSize, y * cellSize, size, size);
			}
		}

		repaint = false;
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
		tintsPtr = world.tints();
		cells = new Uint8Array(wasm.memory.buffer, cellsPtr, width * height);
		tints = new Uint8Array(wasm.memory.buffer, tintsPtr, width * height);

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

<div>
	<div id="parent" class="canvas-wrapper">
		<div class="canvas-container">
			<canvas id="sandCanvas" />
		</div>
	</div>
	<div>
		<ul>
			<li>
				<button
					class="material-picker"
					on:click={() => setCurrentMaterial(Material.Sand)}>Sand</button
				>
			</li>
			<li>
				<button
					class="material-picker"
					on:click={() => setCurrentMaterial(Material.Water)}>Water</button
				>
			</li>
			<li>
				<button
					class="material-picker"
					on:click={() => setCurrentMaterial(Material.Rock)}>Rock</button
				>
			</li>
			<li>
				<button
					class="material-picker"
					on:click={() => setCurrentMaterial(Material.Smoke)}>Smoke</button
				>
			</li>
			<li>
				<button
					class="material-picker"
					on:click={() => setCurrentMaterial(Material.Air)}>Air</button
				>
			</li>
		</ul>
		<ul>
			<li>
				<button on:click={toggleSimulation}
					>{simulationPaused ? "Resume" : "Pause"}</button
				>
			</li>
			<li><button on:click={clearWorld}>Clear</button></li>
		</ul>
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
