<script lang="ts">
	type Reference = {
		title: string;
		source?: string;
		href: string;
	};

	export let title = "Project";
	export let references: Reference[] = [];
</script>

<footer>
	<div id="wrapper">
		<div id="container">
			<h4>{title}</h4>
			<h5>Learn More</h5>
			<ul>
				{#each references as reference}
					<li>
						<a href={reference.href}
							>{reference.title}
							{#if reference.source !== undefined}
								<span class="italic">{reference.source}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</footer>

<style lang="scss">
	footer {
		background-color: var(--palette-almost-white);
	}

	h4 {
		margin: 0;
		margin-bottom: 1rem;
	}

	h5 {
		font-size: 0.9rem;
		font-weight: 500;
		margin: 0.5rem 0;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: flex;
	}

	a {
		font-size: 0.9rem;
		font-weight: 500;
		text-decoration: none;
		border-top: 0.1rem solid var(--palette-light-gray);
		padding: 0.5rem 0;
		width: 100%;
		color: var(--secondary-text-color);
	}

	#wrapper {
		margin: auto;
		max-width: calc(800px - 4px);

		@include medium {
			border-left: 2px dotted var(--palette-light-gray);
			border-right: 2px dotted var(--palette-light-gray);
		}
	}

	#container {
		padding: 4rem 2rem;
		padding-bottom: calc(4rem + var(--nav-height));
	}
</style>
