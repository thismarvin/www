<script lang="ts">
	import { onMount } from "svelte";

	export let lifeExpectancy = 79;
	export let dob = "2000-03-17";

	const msInWeek = 1000 * 60 * 60 * 24 * 7;
	const target = 1 / 52;
	const now = new Date();
	const dateString = now.toLocaleDateString();

	let totalWeeks = 0;
	let rolling = 0;

	$: {
		const ms = now.valueOf() - new Date(dob).valueOf();

		totalWeeks = Math.trunc(ms / msInWeek);
		rolling = 0;
	}

	const maxFrameSkip = 10;
	const maxDeltaTime = maxFrameSkip * target;

	let totalElapsedTime = 0;
	let accumulator = 0;

	function update() {
		rolling = rolling < totalWeeks ? rolling + 1 : totalWeeks;
	}

	function loop(timeStamp: number) {
		let deltaTime = (timeStamp - totalElapsedTime) / 1000;

		if (Number.isNaN(deltaTime)) {
			deltaTime = 0;
		}

		if (deltaTime > maxDeltaTime) {
			deltaTime = maxDeltaTime;
		}

		totalElapsedTime = timeStamp;

		accumulator += deltaTime;

		while (accumulator >= target) {
			update();

			accumulator -= target;
		}

		if (rolling >= totalWeeks) {
			return;
		}

		requestAnimationFrame((timeStamp) => loop(timeStamp));
	}

	onMount(() => loop(0));
</script>

<div class="calendar">
	<div class="metadata">
		<h4>{dateString}</h4>
		<h4>{rolling} week{Math.abs(rolling) === 1 ? "" : "s"}</h4>
	</div>
	<div class="grid-wrapper">
		<div class="grid">
			{#each Array(lifeExpectancy) as _, y}
				<div class="year">
					{#each Array(52) as _, x}
						<div class="week">
							<div class="inner {y * 52 + x < rolling ? 'lived' : ''}" />
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	h4 {
		margin: 1rem 0;
	}

	.calendar {
		max-width: calc(10px * 52 + 1px + 4px);
	}

	.metadata {
		display: flex;
		justify-content: space-between;
	}

	.grid-wrapper {
		border: 2px solid var(--palette-black);
		box-shadow: var(--secondary-box-shadow);
	}

	.grid {
		--size: min(calc((100vw - 2rem - 4px - 53px) / 52), 9px);
		border-left: 1px solid var(--palette-light-gray);
		border-top: 1px solid var(--palette-light-gray);
	}

	.year {
		display: flex;
	}

	.week {
		width: var(--size);
		height: var(--size);
		border-right: 1px solid var(--palette-light-gray);
		border-bottom: 1px solid var(--palette-light-gray);
		background-color: var(--palette-white);
	}

	.inner {
		width: var(--size);
		height: var(--size);
		background-color: var(--palette-black);
		opacity: 0;
		transition: opacity 0.5s ease-in;
	}

	.lived {
		opacity: 1;
	}
</style>
