<script lang="ts">
	import Art from "$lib/art";
	import { create } from "$lib/p5app";
	import { onMount } from "svelte";

	let art: Art;

	// (•◡•)
	onMount(() => {
		art = new Art(document.querySelector("#display-container"));
		create(art);
	});

	const date = new Date().toISOString().substring(0, 10);
</script>

<main>
	<section id="landing">
		<div id="display">
			<div id="description-top">
				<h4>(◕‿◕✿)</h4>
			</div>
			<div id="display-wrapper">
				<div id="display-container" />
			</div>
			<div id="description-bottom">
				<h4>{date}</h4>
				<button on:click={() => art.anew()}>marvin</button>
			</div>
		</div>
	</section>
</main>

<style lang="scss">
	@import "../mixins.scss";

	main {
		width: 100%;
		height: calc(100% - 51px);
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

	#landing {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		height: 100%;
	}

	#display {
		padding: 1rem;
		width: calc(100% - 2rem);

		@include medium {
			max-width: calc(75vmin);
		}
	}

	#display-wrapper {
		position: relative;
		padding-top: calc(1 / (1 / 1) * 100%);
	}

	#display-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		box-shadow: 0.5rem 0.5rem 1rem rgba(#000000, 0.25);
	}

	#description-top {
		display: flex;
		justify-content: flex-end;
		color: rgba(0, 0, 0, 0.04);
	}

	#description-bottom {
		display: flex;
		justify-content: space-between;
	}
</style>
