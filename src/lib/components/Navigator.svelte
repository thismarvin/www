<script lang="ts">
	let showNav = false;
	$: buttonImage = showNav ? "./close.svg" : "./hamburger.svg";

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

	function toggleNav() {
		showNav = !showNav;
	}
</script>

<div id="navigator">
	{#if showNav}
		<nav>
			<h4><a href="https://bit.ly/IqT6zt">thismarvin</a></h4>
			<ul>
				{#each navElements as element}
					<li>
						<a href={element.href} on:click={toggleNav}>{element.name}</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}

	<div id="menu">
		<div id="button-wrapper" class="centered">
			<button
				class="hamburger"
				on:click={toggleNav}
				style="background-image: url({buttonImage})"
			>
				<span class="label"
					>{showNav
						? "Close global navigation menu"
						: "Open global navigation menu"}</span
				>
			</button>
		</div>
	</div>
</div>

<style lang="scss">
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		border-top: 0.1rem solid var(--palette-light-gray);
	}

	button {
		border: 0;
		margin: 0;
		padding: 0;
		border-radius: 5rem;
	}

	h4 {
		margin-top: 0;
		margin-bottom: 0.75rem;
	}

	h4 a {
		font-size: 1.05rem;
		font-weight: 600;
	}

	a {
		display: flex;
		justify-content: flex-start;
		font-weight: 500;
		text-decoration: none;
		padding: 0.75rem 0;
		width: 100%;
		color: var(--palette-black);
	}

	nav {
		background-color: var(--palette-white);
		padding: 2rem;
		margin-bottom: 1rem;
		border-radius: 1rem;
		box-shadow: 0 0 1rem rgba(#000000, 0.2);
	}

	#navigator {
		display: flex;
		flex-direction: column;
		position: fixed;
		z-index: 1;
		bottom: 0;
		overflow: hidden;
		padding: 1rem 1rem 2rem 1rem;
		width: calc(100% - 2rem);
	}

	#menu {
		display: flex;
		justify-content: flex-end;
	}

	#button-wrapper {
		padding: 0.5rem;
		width: 2.1rem;
		height: 2.1rem;
		background-color: var(--palette-white);
		border-radius: 100rem;
		box-shadow: 0 0 1rem rgba(#000000, 0.1);
	}

	.hamburger {
		width: 2rem;
		height: calc(2 * 17 / 19 * 1rem);
		background-color: transparent;
		background-size: contain;
		background-repeat: no-repeat;
	}
</style>
