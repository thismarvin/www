<script lang="ts">
	import { onMount } from "svelte";

	export let lightColor = "#dee3e6";
	export let darkColor = "#8ca2ad";

	let boardElement: HTMLElement;

	const width = 8;
	const height = 8;

	function getColorClass(index: number): string {
		const x = index % width;
		const y = Math.floor(index / width);

		return (x + y) % 2 === 0 ? "light" : "dark";
	}

	onMount(() => {
		boardElement.style.setProperty("--light-color", lightColor);
		boardElement.style.setProperty("--dark-color", darkColor);
	});
</script>

<div bind:this={boardElement} class="board">
	{#each Array(width * height) as _, i}
		<div class="cell {getColorClass(i)}" />
	{/each}
</div>

<style lang="scss">
	.board {
		--max-size: calc(600px / 8);
		--cell-size: min(calc((100vw - 2rem) / 8), var(--max-size));
		--light-color: var(--palette-almost-white);
		--dark-color: var(--palette-black);
		display: grid;
		grid-template-columns: repeat(8, var(--cell-size));
		grid-template-rows: repeat(8, var(--cell-size));
		max-width: 600px;
		box-shadow: var(--primary-box-shadow);
	}

	.cell {
		width: var(--cell-size);
		height: var(--cell-size);
	}

	.light {
		background-color: var(--light-color);
	}

	.dark {
		background-color: var(--dark-color);
	}
</style>
