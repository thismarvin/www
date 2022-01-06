<script lang="ts">
	import Board from "./_Board.svelte";
	import ProjectFooter from "$lib/components/ProjectFooter.svelte";
	import init from "./chess";
	import wasmURL from "./chess_bg.wasm?url";
</script>

<svelte:head>
	<title>Chess | thismarvin</title>
</svelte:head>
<main>
	<section class="centered">
		<h4>This project is still a work in progress!</h4>
		<p>I am trying my hardest; please come back later.</p>
		{#await fetch(wasmURL) then input}
			{#await init(input) then _}
				<Board />
			{/await}
		{/await}
	</section>
</main>

<ProjectFooter
	title="Chess"
	references={[
		{
			title: `"Getting Started."`,
			source: "Chess Programming Wiki",
			href: "https://www.chessprogramming.org/Getting_Started",
		},
		{
			title: "View source code",
			href: "https://github.com/thismarvin/www/tree/dev/src/routes/chess",
		},
	]}
/>

<style lang="scss">
	@import "../../mixins.scss";

	main {
		margin: auto;
		max-width: calc(800px - 4px);

		@include medium {
			border-left: 2px dotted var(--palette-light-gray);
			border-right: 2px dotted var(--palette-light-gray);
		}
	}

	section {
		flex-direction: column;
		padding: 5rem 1rem;
	}

	p {
		margin: 0;
		margin-bottom: 2rem;
	}
</style>
