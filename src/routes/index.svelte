<script lang="ts">
	import Art from "$lib/art";
	import { create } from "$lib/p5app";
	import { onMount } from "svelte";

	let art: Art;

	// (•◡•)
	// (◕‿◕✿)
	onMount(() => {
		art = new Art(document.querySelector("#canvas-container"));
		create(art);
	});

	const date = new Date().toISOString().substring(0, 10);
</script>

<svelte:head>
	<title>Home | thismarvin</title>
</svelte:head>

<main>
	<section>
		<div id="display">
			<div id="canvas-wrapper">
				<div id="canvas-container" />
			</div>
			<div id="description">
				<h4>{date}</h4>
				<button on:click={() => art.anew()}>marvin</button>
			</div>
		</div>
	</section>
</main>

<style lang="scss">
	@import "../mixins.scss";

	main {
		display: flex;
		height: 100%;
	}

	section {
		margin: auto;
		padding: 1rem;
		width: 100%;
	}

	h4 {
		margin: 1rem 0;
	}

	button {
		font-family: "Fira Sans";
		font-weight: bold;
		font-size: 1rem;
		margin: 1rem 0;
		border: 0;
		padding: 0;
		background-color: transparent;
	}

	#display {
		margin: auto;

		@include medium {
			max-width: calc(75vmin);
		}
	}

	#canvas-wrapper {
		position: relative;
		padding-top: calc(1 / (1 / 1) * 100%);
	}

	#canvas-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		box-shadow: 0.5rem 0.5rem 1rem rgba(#000000, 0.2);
	}

	#description {
		display: flex;
		justify-content: space-between;
	}
</style>
