<script lang="ts">
	import ProjectFooter from "$lib/components/ProjectFooter.svelte";
	import Sandy from "./_Sandy.svelte";
</script>

<svelte:head>
	<title>Sand | thismarvin</title>
</svelte:head>

<main>
	<section>
		<Sandy />
	</section>
</main>

<ProjectFooter
	title="Sand"
	references={[
		{
			title: `"Exploring the Tech and Design of Noita." GDC`,
			source: "YouTube",
			href: "https://youtu.be/prXuyMCgbTc",
		},
		{
			title: "View source code",
			href: "https://github.com/thismarvin/www/tree/dev/src/routes/sand",
		},
	]}
/>

<style lang="scss">
	section {
		padding: 2rem 1rem;
	}
</style>
