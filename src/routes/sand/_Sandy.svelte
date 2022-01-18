<script lang="ts">
	import Color from "$lib/color";
	import PaletteEntry from "./_PaletteEntry.svelte";
	import Pixels from "$lib/pickles";
	import SmartPointer from "$lib/pointer";
	import type { InitOutput } from "./sand";
	import { Material, Tint, World } from "./sand";
	import { browser } from "$app/env";
	import { makeNoise2D } from "open-simplex-noise";
	import { onDestroy, onMount } from "svelte";

	export let wasm: InitOutput;

	const width = 128;
	const height = 128;
	const chunkSize = 16;

	let world = World.create(width, height, chunkSize);
	let materialsPtr = world.materials();
	let tintsPtr = world.tints();
	let materials = new Uint8Array(
		wasm.memory.buffer,
		materialsPtr,
		width * height
	);
	let tints = new Uint8Array(wasm.memory.buffer, tintsPtr, width * height);

	let parent: HTMLElement | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let requestHandle: number | null = null;

	let pixels: Pixels;

	let scale = 1;
	let brushRadius = 4;

	const noiseGenerator = makeNoise2D(Date.now());
	const noiseArray: number[] = [];
	const noiseZoom = 0.1;

	for (let y = 0; y < height; ++y) {
		for (let x = 0; x < width; ++x) {
			noiseArray.push(noiseGenerator(x * noiseZoom, y * noiseZoom));
		}
	}

	function randomRange(min: number, max: number): number {
		return min + Math.floor(Math.random() * (max - min));
	}

	function noise(x: number, y: number): number {
		let absX = Math.floor(Math.abs(x));
		let absY = Math.floor(Math.abs(y));

		let boundedX = absX % width;
		let boundedY = absY % height;

		if (Math.floor(absX / width) % 2 !== 0) {
			boundedX = width - 1 - boundedX;
		}

		if (Math.floor(absY / height) % 2 !== 0) {
			boundedY = height - 1 - boundedY;
		}

		return noiseArray[boundedY * width + boundedX];
	}

	const tintNoiseStep = 0.5;
	let tintNoiseIndex = randomRange(-42, 42 + 1);
	const waterNoiseStep = 0.1;
	let waterNoiseIndex = 0;
	const smokeNoiseStep = -0.15;
	let smokeNoiseIndex = randomRange(-210, 210 + 1);

	const sandColors = ["#ffd5c3", "#ffcbba", "#f1b3b6", "#e7a5ab"];
	const waterColors = ["#7094ff"];
	const rockColors = ["#b884ff", "#a271ff", "#935bf2", "#7951e3"];
	const smokeColors = ["#cbcbcb"];
	const airColors = ["#ffffff"];

	$: sandColorsHex = [
		Color.fromHexString(sandColors[0]),
		Color.fromHexString(sandColors[1]),
		Color.fromHexString(sandColors[2]),
		Color.fromHexString(sandColors[3]),
	];
	$: waterColorsHex = [Color.fromHexString(waterColors[0])];
	$: rockColorsHex = [
		Color.fromHexString(rockColors[0]),
		Color.fromHexString(rockColors[1]),
		Color.fromHexString(rockColors[2]),
		Color.fromHexString(rockColors[3]),
	];
	$: smokeColorsHex = [Color.fromHexString(smokeColors[0])];
	$: airColorsHex = [Color.fromHexString(airColors[0])];

	$: materialEntries = [
		{ name: "Sand", type: Material.Sand, color: sandColors[0] },
		{ name: "Water", type: Material.Water, color: waterColors[0] },
		{ name: "Rock", type: Material.Rock, color: rockColors[0] },
		{ name: "Smoke", type: Material.Smoke, color: smokeColors[0] },
		{ name: "Air", type: Material.Air, color: airColors[0] },
	];

	let simulationPaused = true;
	let repaint = false;

	let currentMaterial = Material.Sand;

	const smartPointer = new SmartPointer();
	let startingPosition: number[] | null = null;

	function setCurrentMaterial(material: number): void {
		currentMaterial = material;
	}

	function toggleSimulation(): void {
		simulationPaused = !simulationPaused;
	}

	function resetWorld(): void {
		world.reset();
		repaint = true;
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
		let rand = noise(tintNoiseIndex, 0);
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

	function getColor(material: number, tint: number): Color {
		switch (material) {
			case Material.Sand: {
				return sandColorsHex[tint];
			}
			case Material.Water: {
				return waterColorsHex[0];
			}
			case Material.Rock: {
				return rockColorsHex[tint];
			}
			case Material.Smoke: {
				return smokeColorsHex[0];
			}
			case Material.Air: {
				return airColorsHex[0];
			}
			default: {
				return Color.default();
			}
		}
	}

	function getAlpha(material: number, x: number, y: number): number {
		switch (material) {
			case Material.Sand: {
				return 1;
			}
			case Material.Water: {
				const alpha =
					Math.floor(
						((1 + noise((x + waterNoiseIndex) / 2, y / 1)) / 2) * 100
					) + 155;

				return alpha / 255;
			}
			case Material.Rock: {
				return 1;
			}
			case Material.Smoke: {
				const alpha =
					Math.floor(
						((1 + noise((x + smokeNoiseIndex) / 1, y / 1)) / 2) * 200
					) + 55;

				return alpha / 255;
			}
			case Material.Air: {
				return 1;
			}
			default:
				return 1;
		}
	}

	function update() {
		if (startingPosition !== null) {
			startingPosition = [smartPointer.x, smartPointer.y];
		}

		smartPointer.update();

		if (smartPointer.pressed("LeftClick")) {
			startingPosition = [smartPointer.x, smartPointer.y];
		}

		if (smartPointer.pressing("LeftClick")) {
			const x1 = Math.floor(startingPosition[0] / scale);
			const y1 = Math.floor(startingPosition[1] / scale);
			const x2 = Math.floor(smartPointer.x / scale);
			const y2 = Math.floor(smartPointer.y / scale);

			world.paint(
				x1,
				y1,
				x2,
				y2,
				brushRadius,
				currentMaterial,
				getTint(),
				getSpread(currentMaterial)
			);
			repaint = true;
		}

		if (!simulationPaused) {
			waterNoiseIndex += waterNoiseStep;
			smokeNoiseIndex += smokeNoiseStep;
			world.simulate();
		}
	}

	function draw() {
		if (simulationPaused && !repaint) {
			return;
		}

		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				const index = y * width + x;
				const material = materials[index];
				const tint = tints[index];

				let color = getColor(material, tint);
				let alpha = getAlpha(material, x, y);

				if (alpha != 1) {
					color = Color.multiply(color, alpha);
				}

				pixels.set(x, y, color);
			}
		}

		pixels.draw();

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

		if (browser) {
			requestHandle = requestAnimationFrame((timeStamp) => loop(timeStamp));
		}
	}

	onMount(() => {
		canvas.width = parent.clientWidth * 2;
		canvas.height = parent.clientHeight * 2;
		canvas.style.width = `${parent.clientWidth}px`;
		canvas.style.height = `${parent.clientHeight}px`;

		smartPointer.attachElement(parent);

		scale = parseInt(canvas.style.width) / width;

		pixels = new Pixels(canvas, width, height);

		loop(0);
	});

	onDestroy(() => {
		if (browser) {
			cancelAnimationFrame(requestHandle);
		}
	});
</script>

<div>
	<div class="canvas-wrapper-wrapper">
		<div bind:this={parent} id="parent" class="canvas-wrapper">
			<div class="canvas-container">
				<canvas bind:this={canvas} id="sandCanvas" />
			</div>
		</div>
	</div>
	<div class="palette centered">
		<ul>
			{#each materialEntries as entry}
				<li>
					<PaletteEntry
						name={entry.name}
						color={entry.color}
						selected={currentMaterial === entry.type}
						onclick={() => setCurrentMaterial(entry.type)}
					/>
				</li>
			{/each}
		</ul>
	</div>
	<div>
		<!-- TODO(thismarvin): Brush Picker -->
	</div>
	<div class="control-panel centered">
		<ul>
			<li>
				<button class="control" on:click={toggleSimulation}
					>{simulationPaused ? "Resume" : "Pause"}</button
				>
			</li>
			<li><button class="control" on:click={resetWorld}>Reset</button></li>
		</ul>
	</div>
</div>

<style lang="scss">
	ul {
		display: flex;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		padding-right: 0.5rem;
	}

	li:last-child {
		padding-right: 0;
	}

	.canvas-wrapper-wrapper {
		border: 0.2rem solid black;
	}

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

	.control {
		font-family: "Fira Sans", sans-serif;
		font-size: min(3.5vw, 14px);
		font-weight: 500;
		margin: 0;
		border: 0.2em solid var(--palette-light-gray);
		padding: 1em 1.75em;
		border-radius: 2em;
		color: var(--secondary-text-color);
		background-color: var(--palette-white);
	}

	.palette {
		padding-top: 1rem;
	}

	.control-panel {
		padding-top: 1rem;
	}
</style>
