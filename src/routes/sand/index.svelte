<script lang="ts">
	import Sandy from "./_Sandy.svelte";
</script>

<svelte:head>
	<title>Sand | thismarvin</title>
	<style>
		html {
			overflow: hidden;
		}
	</style>
</svelte:head>

<main>
	<section>
		<Sandy />
	</section>
</main>

<style lang="scss">
	main {
		display: flex;
		height: 100%;
	}

	section {
		margin: auto;
		padding: 2rem 1rem;
		width: 100%;
	}
</style>
