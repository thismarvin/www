<script lang="ts">
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
<footer>
	<hr />
	<h3>Conway's Game of Life</h3>
	<div id="links">
		<h4>Learn More</h4>
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
		height: calc(100vh - 4rem - var(--nav-height));
	}

	footer {
		padding: 2rem 2rem calc(2rem + var(--nav-height)) 2rem;
	}

	hr {
		border: 0;
		height: 0.1rem;
		background-color: var(--palette-black);
	}

	h4 {
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
		padding: 0.5rem;
		width: 100%;
		color: var(--palette-black);
		background-color: var(--palette-white);
	}
</style>
