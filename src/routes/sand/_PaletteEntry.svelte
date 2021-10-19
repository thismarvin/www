<script lang="ts">
	import { noop } from "svelte/internal";

	export let name = "Sand";
	export let color = "#ffffff";
	export let selected = false;
	export let onclick: () => void = noop;
</script>

<button
	class={selected ? "selected" : ""}
	on:click={onclick}
	style="background-color: {color};"
>
	<span class="label">{name}</span>
</button>

<style lang="scss">
	button {
		width: 3rem;
		height: 3rem;
		margin: 0;
		border: 0.2rem dotted var(--palette-black);
		padding: 0;
		border-radius: 100rem;
	}

	.selected {
		border: 0.3rem solid var(--palette-black);
		box-shadow: var(--secondary-box-shadow);
	}
</style>
