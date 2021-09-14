<script lang="ts">
	export let name = "www";
	export let href = "/";
	export let date = new Date();

	const dateString = date.toISOString().substring(0, 7);
</script>

<div class="project">
	<a {href}>
		<span>~/Projects/{name}</span>
		<span>{dateString}</span>
	</a>
</div>

<style lang="scss">
	a {
		display: flex;
		justify-content: space-between;
		font-weight: 500;
		text-decoration: none;
		padding: 1rem;
		width: calc(100% - 2rem);
		box-shadow: 0.5rem 0.5rem 1rem rgba(#000000, 0.2);
		color: var(--palette-white);
		background-color: var(--palette-black);
	}
</style>
