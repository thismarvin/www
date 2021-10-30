<script context="module" lang="ts">
	type LoadInput = {
		error?: Error;
		status?: number;
	};

	type LoadOutput = {
		props: {
			status: number;
			message: string;
		};
	};

	export function load({ error, status }: LoadInput): LoadOutput {
		return {
			props: {
				status: status,
				message: error.message,
			},
		};
	}
</script>

<script lang="ts">
	export let status: number;
	export let message: string;
</script>

<svelte:head>
	{#if status === 404}
		<title>Page not found | thismarvin</title>
	{:else}
		<title>Error | thismarvin</title>
	{/if}
</svelte:head>

<main>
	<section>
		{#if status === 404}
			<h1>Page not found!</h1>
			<h2>{status}</h2>
			<p>Sorry, but the page you requested could not be found.</p>
			<a href="/">Go back home.</a>
		{:else}
			<h1>Something went wrong!</h1>
			<h2>{status}</h2>
			<p>{message}</p>
		{/if}
	</section>
</main>

<style lang="scss">
	@import "../mixins.scss";

	main {
		display: flex;
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
		padding: 1rem;
		width: calc(100vw - 2rem);
		max-width: calc(800px - 2rem);

		@include medium {
			padding: 2rem;
			max-width: calc(800px - 4rem);
		}
	}

	h1 {
		margin-top: 0;
	}
</style>
