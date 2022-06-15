<script lang="ts">
	import ProjectFooter from "$lib/components/ProjectFooter.svelte";
	import World from "./_World.svelte";
</script>

<svelte:head>
	<title>Life | thismarvin</title>
</svelte:head>

<main>
	<section class="centered">
		<World />
	</section>
</main>

<ProjectFooter
	title="Life"
	references={[
		{
			title: `"Conway's Game of Life."`,
			source: "Wikipedia",
			href: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
		},
		{
			title: `"Inventing Game of Life." Numberphile`,
			source: "YouTube",
			href: "https://youtu.be/R9Plq-D1gEk",
		},
		{
			title: "View source code",
			href: "https://github.com/thismarvin/www/tree/dev/src/routes/life",
		},
	]}
/>

<style lang="scss">
	main {
		margin: auto;
		max-width: calc(800px - 4px);

		@include medium {
			border-left: 2px dotted var(--palette-light-gray);
			border-right: 2px dotted var(--palette-light-gray);
		}
	}

	section {
		padding: 5rem 1rem;
	}
</style>
