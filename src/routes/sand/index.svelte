<script lang="ts">
	import Sandy from "./_Sandy.svelte";
	import init from "./sand";
	import wasmURL from "./sand_bg.wasm?url";
	import { page } from "$app/stores";

	let url: string;

	$: {
		url = `http://${$page.host}${wasmURL}`;
	}
</script>

<svelte:head>
	<title>Sand | thismarvin</title>
	<style>
		html {
			overflow: hidden;
		}
	</style>
</svelte:head>

<main>
	<section>
		{#await init(url) then wasm}
			<Sandy {wasm} />
		{/await}
	</section>
</main>

<style lang="scss">
	@import "../../mixins.scss";

	main {
		display: flex;
		margin: auto;
		max-width: calc(800px - 4px);
		min-height: 100vh;

		@include medium {
			border-left: 2px dotted var(--palette-light-gray);
			border-right: 2px dotted var(--palette-light-gray);
		}
	}

	section {
		margin: auto;
		padding: 1rem;
		width: calc(100vw - 2rem);
		max-width: calc(700px - 2rem);

		@include medium {
			padding: 2rem;
			max-width: calc(700px - 4rem);
		}
	}
</style>
