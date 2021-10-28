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

	function sortByName(a: Project, b: Project): number {
		return a.name.localeCompare(b.name);
	}

	function sortByDate(a: Project, b: Project): number {
		if (a.date < b.date) {
			return -1;
		}

		if (a.date > b.date) {
			return 1;
		}

		return 0;
	}

	const projects: Project[] = [
		createProject("Life", "/life", "2021-08-25"),
		createProject("Calendar", "/calendar", "2021-09-21"),
		createProject("Sand", "/sand", "2021-10"),
		createProject("Chess", "/chess", "2021-10"),
	];

	const projectsSortedByName = projects.slice().sort(sortByName);
	const projectsSortedByNameButReversed = projectsSortedByName
		.slice()
		.reverse();
	const projectsSortedByDate = projects.slice().sort(sortByDate);
	const projectsSortedByDateButReversed = projectsSortedByDate
		.slice()
		.reverse();

	enum SortingCategory {
		Name,
		Date,
	}

	let selectedCategory = SortingCategory.Name;
	let reversed = false;

	function toggleCategory(category: SortingCategory) {
		if (selectedCategory === category) {
			reversed = !reversed;
		} else {
			selectedCategory = category;
			reversed = false;
		}

		renderedProjects = updateProjects();
	}

	function updateProjects() {
		switch (selectedCategory) {
			case SortingCategory.Name: {
				if (reversed) {
					return projectsSortedByNameButReversed;
				}

				return projectsSortedByName;
			}
			case SortingCategory.Date: {
				if (reversed) {
					return projectsSortedByDateButReversed;
				}

				return projectsSortedByDate;
			}
		}
	}

	let renderedProjects = updateProjects();

	const featured = 0;
</script>

<svelte:head>
	<title>Projects | thismarvin</title>
</svelte:head>

<main>
	<section>
		<div id="repeat-wrapper">
			<RepeatRepeatRepeat phrase={"projects."} />
		</div>
		<h4>Featured Project</h4>
		<ul class="featured">
			<li>
				<ProjectEntry {...projects[featured]} />
			</li>
		</ul>
		<h4>A collection of interactive projects</h4>
		<ul id="sorter">
			<li>
				<button on:click={() => toggleCategory(SortingCategory.Name)}>
					Name
					<div class="category centered">
						<div
							class="triangle {selectedCategory !== SortingCategory.Name
								? 'yeet'
								: reversed
								? 'flip'
								: ''}"
						/>
					</div>
				</button>
			</li>

			<li>
				<button on:click={() => toggleCategory(SortingCategory.Date)}
					>Date
					<div class="category centered">
						<div
							class="triangle {selectedCategory !== SortingCategory.Date
								? 'yeet'
								: reversed
								? 'flip'
								: ''}"
						/>
					</div>
				</button>
			</li>
		</ul>
		<ul>
			{#each renderedProjects as project}
				<li>
					<ProjectEntry {...project} />
				</li>
			{/each}
		</ul>
	</section>
</main>

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
		margin: auto;
		padding: 2rem;
		padding-bottom: calc(2rem + var(--nav-height));
		width: calc(100% - 4rem);
		max-width: 350px;

		@include medium {
			padding: 4rem 2rem;
		}
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

	.triangle {
		width: 0.8rem;
		height: calc(0.8 * 13 / 30 * 1rem);
		transform: rotateZ(0deg);
		background-image: url("./triangle.svg");
		background-color: transparent;
		background-size: contain;
		background-repeat: no-repeat;
	}

	.category {
		padding-left: 0.5rem;
		height: 1rem;
	}

	.yeet {
		transform: translate(-1000rem, -1000rem);
	}

	.flip {
		transform: rotateZ(180deg);
	}

	#repeat-wrapper {
		padding: 2rem 0;
	}

	#sorter {
		display: flex;
		justify-content: space-between;
	}

	#sorter button {
		font-family: "Fira Sans", sans-serif;
		font-size: min(3.5vw, 12px);
		display: flex;
		margin: 0;
		border: 0.1em solid var(--palette-light-gray);
		padding: 0.5em 1em;
		border-radius: 2em;
		color: var(--secondary-text-color);
		background-color: var(--palette-white);
	}
</style>
