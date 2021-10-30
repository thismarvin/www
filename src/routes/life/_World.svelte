<script lang="ts">
	import { browser } from "$app/env";
	import { onDestroy, onMount } from "svelte";

	enum CellType {
		None = 0,
		Dead = 1,
		Alive = 2,
	}

	function cellTypeToString(type: CellType): string {
		switch (type) {
			case CellType.Dead:
				return "dead";
			case CellType.Alive:
				return "alive";
			default:
				return "";
		}
	}

	function cellTypeOpposite(type: CellType): CellType {
		switch (type) {
			case CellType.Dead:
				return CellType.Alive;
			case CellType.Alive:
				return CellType.Dead;
			default:
				CellType.None;
		}
	}

	const width = 15;
	const height = 15;
	const data: CellType[][] = [];

	let paused = false;

	for (let i = 0; i < height; ++i) {
		data.push(new Array(width).fill(CellType.Dead));
	}

	function _surround(data: CellType[][], x: number, y: number): void {
		for (let j = 0; j < 3; ++j) {
			for (let i = 0; i < 3; ++i) {
				if (i === 1 && j === 1) {
					continue;
				}

				data[y - 1 + j][x - 1 + i] = CellType.Alive;
			}
		}
	}

	_surround(data, 7 + 3, 7 - 3);
	_surround(data, 7 + 3, 7 + 3);
	_surround(data, 7 - 3, 7 + 3);
	_surround(data, 7 - 3, 7 - 3);

	function togglePlay() {
		paused = !paused;
	}

	function get(x: number, y: number): CellType {
		if (x < 0 || x >= width || y < 0 || y >= height) {
			return CellType.None;
		}

		return data[y][x];
	}

	function set(x: number, y: number, value: CellType) {
		data[y][x] = value;
	}

	function randomize() {
		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				data[y][x] = Math.random() > 0.6 ? CellType.Alive : CellType.Dead;
			}
		}
	}

	function clear() {
		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				data[y][x] = CellType.Dead;
			}
		}
	}

	function getTotalNeighbors(x: number, y: number): number {
		let total = 0;

		total = get(x - 1, y - 1) === CellType.Alive ? total + 1 : total;
		total = get(x + 0, y - 1) === CellType.Alive ? total + 1 : total;
		total = get(x + 1, y - 1) === CellType.Alive ? total + 1 : total;
		total = get(x + 1, y + 0) === CellType.Alive ? total + 1 : total;
		total = get(x + 1, y + 1) === CellType.Alive ? total + 1 : total;
		total = get(x + 0, y + 1) === CellType.Alive ? total + 1 : total;
		total = get(x - 1, y + 1) === CellType.Alive ? total + 1 : total;
		total = get(x - 1, y + 0) === CellType.Alive ? total + 1 : total;

		return total;
	}

	function update() {
		if (paused) {
			return;
		}

		let temp = [];

		for (let y = 0; y < height; ++y) {
			temp.push([]);

			for (let x = 0; x < width; ++x) {
				const current = get(x, y);
				const neighbors = getTotalNeighbors(x, y);

				if (current === CellType.Alive) {
					if (neighbors < 2 || neighbors > 3) {
						temp[y].push(CellType.Dead);
						continue;
					}
				}

				if (current === CellType.Dead) {
					if (neighbors === 3) {
						temp[y].push(CellType.Alive);
						continue;
					}
				}

				temp[y].push(current);
			}
		}

		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				data[y][x] = temp[y][x];
			}
		}
	}

	const target = 0.5;
	const maxFrameSkip = 10;
	const maxDeltaTime = maxFrameSkip * target;

	let totalElapsedTime = 0;
	let accumulator = 0;
	let requestHandle: number | null = null;

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

		if (browser) {
			requestHandle = requestAnimationFrame((timeStamp) => loop(timeStamp));
		}
	}

	onMount(() => loop(0));

	onDestroy(() => {
		if (browser) {
			cancelAnimationFrame(requestHandle);
		}
	});
</script>

<div class="world">
	<div class="grid-wrapper">
		<div class="grid">
			{#each data as row, y}
				<div class="row">
					{#each row as cell, x}
						<div
							class="centered cell"
							on:click={() => set(x, y, cellTypeOpposite(cell))}
						>
							<div class={`inner-cell ${cellTypeToString(cell)}`} />
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<div class="control-panel">
		<ul>
			<li>
				<button on:click={randomize}>Randomize</button>
			</li>
			<li>
				<button on:click={clear}>Clear</button>
			</li>
		</ul>
		<ul>
			<li>
				<button on:click={togglePlay}>{paused ? "Resume" : "Pause"}</button>
			</li>
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

	button {
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

	.world {
		max-width: 600px;
	}

	.grid-wrapper {
		padding: 0.5rem;
		background-color: var(--palette-black);
	}

	.grid {
		--max-size: calc((600px - 1rem - 2px * 16) / 15);
		--size: min(calc((100vw - 2rem - 1rem - 2px * 16) / 15), var(--max-size));
		border-top: 2px solid var(--palette-light-gray);
		border-left: 2px solid var(--palette-light-gray);
		box-shadow: 1rem 1rem 1rem rgba(#000000, 0.2);
	}

	.control-panel {
		display: flex;
		justify-content: space-between;
		padding-top: 1rem;
	}

	.row {
		display: flex;
	}

	.cell {
		margin: 0;
		border-right: 2px solid var(--palette-light-gray);
		border-bottom: 2px solid var(--palette-light-gray);
		padding: 0;
		width: var(--size);
		height: var(--size);
		background-color: var(--palette-white);
	}

	.inner-cell {
		width: var(--size);
		height: var(--size);
		background-color: var(--palette-black);
		transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
	}

	.alive {
		transform: scale(1);
		opacity: 1;
	}

	.dead {
		transform: scale(0);
		opacity: 0;
	}
</style>
