<script lang="ts">
	import ProjectFooter from "$lib/components/ProjectFooter.svelte";
	import World from "./_World.svelte";
</script>

<svelte:head>
	<title>Life | thismarvin</title>
</svelte:head>

<main>
	<section>
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
	section {
		padding: 4rem 1rem;
	}
</style>
