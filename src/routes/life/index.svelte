<script lang="ts">
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
<footer>
	<div id="links">
		<h4>Conway's Game of Life</h4>
		<ul>
			<li>
				<a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
					>Wikipedia article</a
				>
			</li>
			<li>
				<a href="https://youtu.be/R9Plq-D1gEk">Numberphile YouTube video</a>
			</li>
			<li>
				<a href="https://github.com/thismarvin/www/tree/dev/src/routes/life"
					>View source code</a
				>
			</li>
		</ul>
	</div>
</footer>

<style lang="scss">
	section {
		padding: 4rem 1rem;
	}

	footer {
		padding: 4rem 2rem;
		padding-bottom: calc(4rem + var(--nav-height));
		background-color: var(--palette-almost-white);
	}

	h4 {
		margin: 0;
		margin-bottom: 0.75rem;
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
		font-weight: 500;
		font-size: 0.9rem;
		text-decoration: none;
		border-top: 0.1rem solid var(--palette-light-gray);
		padding: 0.5rem 0;
		width: 100%;
		color: var(--secondary-text-color);
	}
</style>
