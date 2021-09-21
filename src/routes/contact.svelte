<script lang="ts">
	import RepeatRepeatRepeat from "$lib/components/RepeatRepeatRepeat.svelte";
</script>

<svelte:head>
	<title>Contact | thismarvin</title>
</svelte:head>

<main>
	<section>
		<RepeatRepeatRepeat phrase={"contact."} />
		<h4>Let's get in touch</h4>
		<ul>
			<li>
				<a href="mailto:contact@thismarvin.com">contact@thismarvin.com</a>
			</li>
			<li>
				<a href="https://github.com/thismarvin">github.com/thismarvin</a>
			</li>
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
</style>
