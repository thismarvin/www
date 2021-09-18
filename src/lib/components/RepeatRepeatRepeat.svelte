<script lang="ts">
	export let phrase = "repeat";

	const repeated = new Array(3).fill(phrase).join("");
</script>

<div id="wrapper">
	<div id="container" class="centered">
		<ul>
			<li>{repeated}</li>
			<li>{repeated}</li>
			<li>{repeated}</li>
		</ul>
	</div>
</div>

<style lang="scss">
	ul {
		margin: 0;
		padding: 2rem;
		width: 100%;
		list-style: none;
	}

	li {
		font-weight: 600;
		font-style: italic;
	}

	ul li:nth-child(1) {
		text-align: left;
	}
	ul li:nth-child(2) {
		text-align: center;
	}
	ul li:nth-child(3) {
		text-align: right;
	}

	#wrapper {
		position: relative;
		padding-top: calc(1 / (1 / 1) * 100%);
	}

	#container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		box-shadow: var(--secondary-box-shadow);
	}
</style>
