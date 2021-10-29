<script lang="ts">
	import RepeatRepeatRepeat from "$lib/components/RepeatRepeatRepeat.svelte";
</script>

<svelte:head>
	<title>Contact | thismarvin</title>
</svelte:head>

<main>
	<section>
		<div id="repeat-wrapper">
			<RepeatRepeatRepeat phrase={"contact."} />
		</div>
		<h4>Let's get in touch</h4>
		<ul>
			<li class="featured">
				<a href="mailto:contact@thismarvin.com">contact@thismarvin.com</a>
			</li>
		</ul>
		<h4>Find me on</h4>
		<ul>
			<li>
				<a href="https://github.com/thismarvin">github.com/thismarvin</a>
			</li>
		</ul>
	</section>
</main>

<style lang="scss">
	@import "../mixins.scss";

	main {
		margin: auto;
		max-width: calc(800px - 4px);
		min-height: 100vh;

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
			padding-bottom: calc(2rem + var(--nav-height));
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

	a {
		display: flex;
		justify-content: center;
		font-weight: 600;
		text-decoration: none;
		padding: 1rem;
		width: calc(100% - 2rem);
		box-shadow: var(--primary-box-shadow);
		color: var(--primary-text-color);
		background-color: var(--palette-white);
	}

	.featured {
		padding: 0.4rem;
		background: linear-gradient(
			90deg,
			var(--palette-red),
			var(--palette-purple)
		);
	}

	#repeat-wrapper {
		padding: 2rem 0;
	}
</style>
