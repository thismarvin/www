<script context="module" lang="ts">
	import { svelteSafeInit, InitOutput } from "./sand";
	import wasmURL from "./sand_bg.wasm?url";
	import { browser } from "$app/env";

	let wasm: InitOutput;

	type LoadInput = {
		fetch?: unknown;
	};

	type LoadOutput = {
		status?: number;
		error?: Error;
	};

	export async function load(input: LoadInput): Promise<LoadOutput> {
		const url = (() => {
			if (!browser) {
				return "http://localhost:3000" + wasmURL;
			}

			return wasmURL;
		})();

		wasm = await svelteSafeInit(input.fetch, url);

		return {
			status: 200,
		};
	}
</script>

<script lang="ts">
	import Sandy from "./_Sandy.svelte";
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
		<Sandy {wasm} />
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
