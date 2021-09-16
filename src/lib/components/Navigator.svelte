<script lang="ts">
	let hamburgerSelected = false;
	$: buttonImage = hamburgerSelected ? "./close.svg" : "./hamburger.svg";

	type NavElement = {
		name: string;
		href: string;
	};

	function createNavElement(name: string, href: string): NavElement {
		return {
			name,
			href,
		};
	}

	const navElements = [
		createNavElement("Contact", "/contact"),
		createNavElement("Projects", "/ls"),
		createNavElement("Home", "/"),
	];

	function selectHamburger() {
		hamburgerSelected = !hamburgerSelected;
	}
</script>

<header>
	{#if hamburgerSelected}
		<div id="nav-wrapper">
			<nav>
				<ul>
					{#each navElements as element}
						<li>
							<a href={element.href} on:click={selectHamburger}
								>{element.name}</a
							>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	{/if}
	<div id="head">
		<ul>
			<li class="centered">
				<a id="logo" href="/" on:click={() => (hamburgerSelected = false)}>
					<span class="label">thismarvin</span>
				</a>
			</li>
			<li class="centered">
				<button
					id="menu"
					on:click={selectHamburger}
					style="background-image: url({buttonImage})"
				>
					<span class="label"
						>{hamburgerSelected
							? "Close global navigation menu"
							: "Open global navigation menu"}</span
					>
				</button>
			</li>
		</ul>
	</div>
</header>

<style lang="scss">
	header {
		position: fixed;
		z-index: 1;
		bottom: 0;
		overflow: hidden;
		padding: 1rem;
		width: calc(100% - 2rem);
		box-shadow: 0 0 1rem rgba(#000000, 0.1);
		background-color: var(--palette-white);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	a {
		text-decoration: none;
		color: var(--palette-black);
	}

	button {
		margin: 0;
		border: 0;
		padding: 0;
	}

	nav a {
		display: flex;
		justify-content: flex-start;
		font-weight: 600;
		border: 0.2rem solid var(--palette-black);
		border-top: 0;
		padding: 0.75rem 1rem;
		width: calc(100% - 0.4rem - 2rem);
		box-shadow: 0.5rem 0.5rem 1rem rgba(#000000, 0.1);
		background-color: var(--palette-white);
	}

	nav ul li:first-child {
		border-top: 0.2rem solid var(--palette-black);
	}

	#nav-wrapper {
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		padding-bottom: 2rem;
		height: 100vh;
	}

	#head ul {
		display: flex;
		justify-content: space-between;
	}

	#logo {
		width: 2rem;
		height: calc(2 * 39 / 90 * 1rem);
		background-image: url("./logo.svg");
		background-color: transparent;
		background-size: contain;
		background-repeat: no-repeat;
	}

	#menu {
		width: 2rem;
		height: calc(2 * 17 / 19 * 1rem);
		background-color: transparent;
		background-size: contain;
		background-repeat: no-repeat;
	}
</style>
