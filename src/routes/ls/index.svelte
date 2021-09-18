<script lang="ts">
	import ProjectEntry from "./_ProjectEntry.svelte";
	import RepeatRepeatRepeat from "$lib/components/RepeatRepeatRepeat.svelte";

	type Project = {
		name: string;
		href: string;
		date: Date;
	};

	function createProject(name: string, href: string, date: string): Project {
		return {
			name,
			href,
			date: new Date(date),
		};
	}

	const projects: Project[] = [
		createProject("life", "/life", "2021-08-25"),
		createProject("sand", "/sand", "2021-09"),
		createProject("chess", "/chess", "2021-09"),
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
		padding: 2rem;
		padding-bottom: calc(2rem + var(--nav-height));
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
