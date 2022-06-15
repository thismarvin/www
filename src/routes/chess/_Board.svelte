<script lang="ts">
	import { JsKingSafety, Keeper } from "./chess";
	import { browser } from "$app/env";
	import { onDestroy, onMount } from "svelte";

	type Delta = {
		dx: number;
		dy: number;
	};

	export let lightColor = "#dee3e6";
	export let darkColor = "#8ca2ad";
	export let startingFen =
		"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

	const width = 8;
	const height = 8;

	const keeper = Keeper.from_fen(startingFen);

	let pieces = keeper.board();
	const deltas: Delta[] = new Array(64).fill({ dx: 0, dy: 0 });
	const pieceLookup = new Array(64).fill(null);

	for (let i = 0; i < 64; ++i) {
		if (pieces[i] !== "") {
			pieceLookup[i] = i;
		}
	}

	let turns = 0;
	let plies_white = 0;
	let plies_black = 0;

	let boardElement: HTMLElement;
	let piecesNodeList: NodeListOf<HTMLElement>; // eslint-disable-line no-undef

	function getCellColorClass(index: number): string {
		const x = index % width;
		const y = Math.floor(index / width);

		return (x + y) % 2 === 0 ? "light" : "dark";
	}

	function getPieceStatusClass(index: number): string {
		for (let i = 0; i < pieceLookup.length; ++i) {
			if (pieceLookup[i] == index) {
				return "";
			}
		}

		return "captured";
	}

	function makeMove(lan: string) {
		function transform(start: number, end: number, dx: number, dy: number) {
			let index = pieceLookup[start];

			deltas[index] = {
				dx: deltas[index].dx + dx,
				dy: deltas[index].dy + dy,
			};

			pieceLookup[end] = pieceLookup[start];
			pieceLookup[start] = null;

			piecesNodeList.item(
				index
			).style.transform = `translate(calc(var(--cell-size) * ${deltas[index].dx}), calc(var(--cell-size) * ${deltas[index].dy}))`;
		}

		const meta = keeper.move_meta(lan).split(",");

		const start = parseInt(meta[0]);
		const end = parseInt(meta[1]);
		const dx = parseInt(meta[2]);
		const dy = parseInt(meta[3]);

		transform(start, end, dx, dy);

		keeper.make_move(lan);

		switch (parseInt(meta[4])) {
			case 1: {
				let tmp = (() => {
					switch (meta[5]) {
						case "K": {
							return {
								start: 63,
								end: 61,
								dx: -2,
								dy: 0,
							};
						}
						case "Q": {
							return {
								start: 56,
								end: 59,
								dx: 3,
								dy: 0,
							};
						}
						case "k": {
							return {
								start: 7,
								end: 5,
								dx: -2,
								dy: 0,
							};
						}
						case "q": {
							return {
								start: 0,
								end: 3,
								dx: 3,
								dy: 0,
							};
						}
						default:
							return null;
					}
				})();

				if (tmp == null) {
					break;
				}

				transform(tmp.start, tmp.end, tmp.dx, tmp.dy);

				break;
			}
			case 2: {
				let tmp = parseInt(meta[5]);
				pieceLookup[tmp] = null;

				break;
			}
			case 3: {
				pieces[pieceLookup[end]] = meta[5];

				break;
			}
			default:
				break;
		}

		pieces = [...pieces];
	}

	function randomPlay() {
		function getMove(plies: number) {
			if (plies % 2 == 0) {
				return keeper.suggest(1);
			}

			let moves = keeper.moves();

			return moves[Math.floor(Math.random() * moves.length)];
		}

		let lan = (() => {
			if (turns % 2 == 0) {
				let lan = getMove(plies_white);
				plies_white += 1;

				return lan;
			}

			let lan = getMove(plies_black);
			plies_black += 1;

			return lan;
		})();

		makeMove(lan);

		turns += 1;
	}

	function update() {
		switch (keeper.king_safety()) {
			case JsKingSafety.Checkmate: {
				return;
			}
			case JsKingSafety.Stalemate: {
				return;
			}
			default:
				break;
		}

		// TODO(thismarvin): Allow the user to make moves!
		randomPlay();
	}

	const target = 0.5;
	const maxFrameSkip = 10;
	const maxDeltaTime = maxFrameSkip * target;

	let totalElapsedTime = 0;
	let accumulator = 0;
	let requestHandle: number | null = null;

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

		if (browser) {
			requestHandle = requestAnimationFrame((timeStamp) => loop(timeStamp));
		}
	}

	onMount(() => {
		boardElement.style.setProperty("--light-color", lightColor);
		boardElement.style.setProperty("--dark-color", darkColor);

		piecesNodeList = document.querySelectorAll<HTMLElement>(".piece");

		loop(0);
	});

	onDestroy(() => {
		if (browser && requestHandle !== null) {
			cancelAnimationFrame(requestHandle);
		}
	});
</script>

<div class="container">
	<div bind:this={boardElement} class="board">
		{#each Array(width * height) as _, i}
			<div class="cell {getCellColorClass(i)}" />
		{/each}
	</div>
	<div class="board">
		{#each pieces as piece, i}
			<div class="piece {piece} {getPieceStatusClass(i)}" />
		{/each}
	</div>
</div>

<style lang="scss">
	.container {
		--max-size: 600px;
		--size: calc(100vw - 2rem);
		display: grid;
		width: var(--size);
		height: var(--size);
		max-width: var(--max-size);
		max-height: var(--max-size);
	}

	.container > * {
		grid-area: 1 / 1;
	}

	.board {
		--max-cell-size: calc(var(--max-size) / 8);
		--cell-size: min(calc(var(--size) / 8), var(--max-cell-size));
		--light-color: var(--palette-almost-white);
		--dark-color: var(--palette-black);
		display: grid;
		grid-template-columns: repeat(8, var(--cell-size));
		grid-template-rows: repeat(8, var(--cell-size));
		box-shadow: var(--primary-box-shadow);
	}

	.cell {
		width: var(--cell-size);
		height: var(--cell-size);
		max-width: var(--max-cell-size);
		max-height: var(--max-cell-size);
	}

	.light {
		background-color: var(--light-color);
	}

	.dark {
		background-color: var(--dark-color);
	}

	.piece {
		width: var(--cell-size);
		height: var(--cell-size);
		background-size: 100%;
		transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out;
	}

	.captured {
		opacity: 0;
	}

	.P {
		background-image: url("/chess/pawn_w.svg");
	}

	.N {
		background-image: url("/chess/knight_w.svg");
	}

	.B {
		background-image: url("/chess/bishop_w.svg");
	}

	.R {
		background-image: url("/chess/rook_w.svg");
	}

	.Q {
		background-image: url("/chess/queen_w.svg");
	}

	.K {
		background-image: url("/chess/king_w.svg");
	}

	.p {
		background-image: url("/chess/pawn_b.svg");
	}

	.n {
		background-image: url("/chess/knight_b.svg");
	}

	.b {
		background-image: url("/chess/bishop_b.svg");
	}

	.r {
		background-image: url("/chess/rook_b.svg");
	}

	.q {
		background-image: url("/chess/queen_b.svg");
	}

	.k {
		background-image: url("/chess/king_b.svg");
	}
</style>
