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
		<div id="nav-wrapper">
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
		</div>
	{/if}

	<div id="menu">
		<button class="centered" on:click={toggleNav}>
			<div class="hamburger" style="background-image: url({buttonImage})">
				<span class="label"
					>{showNav
						? "Close global navigation menu"
						: "Open global navigation menu"}</span
				>
			</div>
		</button>
	</div>
</div>

<style lang="scss">
	@import "../../mixins.scss";

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
		width: 3rem;
		height: 3rem;
		border-radius: 100rem;
		background-color: var(--palette-white);
		box-shadow: var(--secondary-box-shadow);
		pointer-events: all;
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
		width: 100%;
		background-color: var(--palette-white);
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 0 1rem rgba(#000000, 0.2);
		pointer-events: all;

		@include medium {
			max-width: 35vmin;
		}
	}

	#nav-wrapper {
		display: flex;
		justify-content: flex-end;
		padding: 1rem;
		padding-bottom: 0;

		@include medium {
			padding: 2rem;
			padding-bottom: 0;
		}
	}

	#navigator {
		position: fixed;
		z-index: 1;
		bottom: 0;
		overflow: hidden;
		pointer-events: none;
		width: 100%;
	}

	#menu {
		display: flex;
		justify-content: flex-end;
		height: 3rem;
		padding: 1rem;
		padding-bottom: 2rem;

		@include medium {
			padding: 2rem;
			padding-top: 1rem;
		}
	}

	.hamburger {
		width: 2rem;
		height: calc(2 * 17 / 19 * 1rem);
		background-color: transparent;
		background-size: contain;
		background-repeat: no-repeat;
	}
</style>
