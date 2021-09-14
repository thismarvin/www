<script lang="ts">
	import ProjectEntry from "$lib/ProjectEntry.svelte";
	import ProjectMetaData from "$lib/projectMetadata";
	import RepeatRepeatRepeat from "$lib/RepeatRepeatRepeat.svelte";

	const projects: ProjectMetaData[] = [
		new ProjectMetaData("life", "/life", new Date("2021-09")),
		new ProjectMetaData("sand", "/sand", new Date("2021-09")),
		new ProjectMetaData("chess", "/chess", new Date("2021-09")),
	];

	const featured = 0;
</script>

<svelte:head>
	<title>Projects | thismarvin</title>
</svelte:head>

<main>
	<section>
		<RepeatRepeatRepeat phrase={"projects."} />
		<h4>Featured Project</h4>
		<ul class="featured">
			<li>
				<ProjectEntry {...projects[featured]} />
			</li>
		</ul>
		<h4>A collection of interactive projects</h4>
		<ul>
			{#each projects as project}
				<li>
					<ProjectEntry {...project} />
				</li>
			{/each}
		</ul>
	</section>
</main>

<style lang="scss">
	section {
		padding: 2rem 2rem calc(2rem + 60px) 2rem;
		width: calc(100% - 4rem);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		margin-bottom: 0.5rem;
	}

	ul li:last-child {
		margin-bottom: 0;
	}

	.featured {
		padding: 0.4rem;
		background: linear-gradient(
			90deg,
			var(--palette-red),
			var(--palette-purple)
		);
	}
</style>
