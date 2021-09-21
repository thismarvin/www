<script lang="ts">
	export let name = "www";
	export let href = "/";
	export let date = new Date();

	$: iso = date.toISOString().substring(0, 7);
</script>

<div class="project">
	<a {href}>
		<span>{name}</span>
		<span>{iso}</span>
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
		box-shadow: var(--primary-box-shadow);
		color: var(--palette-white);
		background-color: var(--palette-black);
	}
</style>
