<script lang="ts">
	import ProjectFooter from "$lib/components/ProjectFooter.svelte";
	import { onMount } from "svelte";
	import { page } from "$app/stores";

	const msInDay = 1000 * 60 * 60 * 24;
	const msInWeek = msInDay * 7;
	const msInYear = msInDay * 365;

	const regexISO = /^(\d{4})-(\d{2})-(\d{2})$/;

	let expectancy = 79;

	let validDate = false;
	let parseError = "";

	let age = 0;
	let weeks = 0;

	let target = 1 / 120;
	let rolling = 0;

	$: dob = $page.query.get("dob");
	$: receivedQuery = dob !== null;

	$: if (receivedQuery) {
		[validDate, parseError] = isValidDate(dob);
	}

	$: if (validDate) {
		const ms = new Date().valueOf() - new Date(dob).valueOf();

		age = Math.trunc(ms / msInYear);
		weeks = Math.trunc(ms / msInWeek);

		target = Math.max(age / weeks, 1 / 120);
		rolling = 0;
	}

	function isValidDate(date: string): [boolean, string?] {
		if (!regexISO.test(date)) {
			return [
				false,
				`The given date does not follow the ISO 8601 standard (e.g. ${new Date()
					.toISOString()
					.substring(0, 10)}).`,
			];
		}

		const ms = new Date(date).valueOf();

		if (isNaN(ms)) {
			return [false, "The given date does not exist."];
		}

		if (ms > new Date().valueOf()) {
			return [false, "Time travel is dangerous!"];
		}

		return [true, null];
	}

	function update() {
		if (!validDate) {
			return;
		}

		rolling = rolling < weeks ? rolling + 1 : weeks;
	}

	const maxFrameSkip = 10;
	const maxDeltaTime = maxFrameSkip * target;

	let totalElapsedTime = 0;
	let accumulator = 0;

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

		/* if (rolling >= weeks) {
			return;
		} */

		requestAnimationFrame((timeStamp) => loop(timeStamp));
	}

	onMount(() => loop(0));
</script>

<svelte:head>
	<title>Life | thismarvin</title>
</svelte:head>

<main>
	<section>
		{#if !validDate}
			<form action="">
				<div id="date-wrapper">
					<label for="birthday">Enter your date of birth:</label>
					<input class="input-date" type="date" name="dob" value="2000-03-17" />
				</div>
				<div id="button-wrapper">
					<input class="input-button" type="submit" value="Generate Calendar" />
				</div>
			</form>
			{#if receivedQuery}
				<div id="error">
					<h4>Parse Error:</h4>
					<p>{parseError}</p>
				</div>
			{/if}
		{:else}
			<div id="top">
				<h4>{new Date().toLocaleDateString()}</h4>
				<h4>{rolling} week{rolling > 1 ? "s" : ""}</h4>
			</div>
			<div id="calendar-wrapper">
				<div id="calendar">
					{#each Array(expectancy) as _, y}
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
		{/if}
	</section>
</main>

<ProjectFooter
	title="Calendar"
	references={[
		{
			title: `"Mortality in the United States, 2019."`,
			source: "CDC",
			href: "https://www.cdc.gov/nchs/products/databriefs/db395.htm",
		},
		{
			title: "View source code",
			href: "https://github.com/thismarvin/www/tree/dev/src/routes/calendar",
		},
	]}
/>

<style lang="scss">
	section {
		padding: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		padding: 4rem 2rem 2rem 2rem;
		margin: 1rem;
		border-radius: 0.5rem;
		box-shadow: var(--secondary-box-shadow);
	}

	label {
		font-weight: 500;
		padding-bottom: 1rem;
	}

	.input-date {
		appearance: none;
		-webkit-appearance: none;
		font-family: "Fira Sans", sans-serif;
		font-size: 0.8rem;
		font-weight: 500;
		width: 100%;
		width: calc(100% - 1rem);
		height: 1.5rem;
		border: 0;
		padding: 0.5rem;
		margin: 0;
		color: var(--secondary-text-color);
		background-color: var(--palette-almost-white);
	}

	.input-button {
		appearance: none;
		-webkit-appearance: none;
		font-family: "Fira Sans", sans-serif;
		font-size: 0.9rem;
		font-weight: 500;
		width: 100%;
		height: 3rem;
		border: 0;
		padding: 0.5rem;
		margin: 0;
		box-shadow: var(--primary-box-shadow);
		color: var(--primary-text-color);
		background-color: var(--palette-white);
	}

	#top {
		display: flex;
		justify-content: space-between;
	}

	#top h4 {
		margin: 1rem 0;
	}

	#date-wrapper {
		display: flex;
		flex-direction: column;
		padding-bottom: 2rem;
	}

	#button-wrapper {
		display: flex;
		flex-direction: column;
		padding: 0.4rem;
		background: linear-gradient(
			90deg,
			var(--palette-red),
			var(--palette-purple)
		);
		border-radius: 0.5rem;
	}

	#calendar-wrapper {
		border: 2px solid var(--palette-black);
		box-shadow: var(--secondary-box-shadow);
	}

	#calendar {
		--size: calc((100vw - 2rem - 4px - 53px) / 52);
		border-left: 1px solid var(--palette-light-gray);
		border-top: 1px solid var(--palette-light-gray);
	}

	#error {
		padding: 1rem;
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
