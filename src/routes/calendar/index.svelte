<script lang="ts">
	import Calendar from "./_Calendar.svelte";
	import ProjectFooter from "$lib/components/ProjectFooter.svelte";
	import { page } from "$app/stores";

	const regexISO = /^(\d{4})-(\d{2})-(\d{2})$/;

	let lifeExpectancy = 79;

	let validDate = false;
	let parseError: string | undefined = "";

	$: dob = $page.url.searchParams.get("dob");
	$: receivedQuery = dob !== null;

	$: if (dob !== null) {
		[validDate, parseError] = isValidDate(dob);
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

		return [true, undefined];
	}
</script>

<svelte:head>
	<title>Life | thismarvin</title>
</svelte:head>

<main>
	<section class="centered">
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
			<Calendar {lifeExpectancy} dob={dob ?? "unreachable"} />
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
	main {
		margin: auto;
		max-width: calc(800px - 4px);

		@include medium {
			border-left: 2px dotted var(--palette-light-gray);
			border-right: 2px dotted var(--palette-light-gray);
		}
	}

	section {
		padding: 3rem 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		margin: 4rem 0;
		padding: 4rem 2rem 2rem 2rem;
		border-radius: 0.5rem;
		box-shadow: var(--secondary-box-shadow);
		width: 100%;
		max-width: 350px;
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

	#error {
		padding: 1rem;
	}
</style>
