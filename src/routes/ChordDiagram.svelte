<script lang="ts">
	/**
	 * This is the single component file for rendering SVG chord diagrams.
	 * It powers a lot of the app.
	 */
	import { fade } from 'svelte/transition';

	interface DiagramStyle {
		// Colors
		background: string;
		boardColor: string;
		lineColor: string;
		dotColor: string;
		// Spacing / sizing
		lineWidth: number;
		marginLeft: number;
		marginRight: number;
		marginTop: number;
		marginBottom: number;
		diagramWidth: number;
		diagramHeight: number;
		dotRadius: number;
		labelFontSize: number;
	}

	const defaultDiagramStyle: DiagramStyle = {
		background: '#fff',
		boardColor: '#fff',
		dotColor: '#111',
		lineColor: '#333',
		lineWidth: 2,
		marginLeft: 28,
		marginRight: 42,
		marginTop: 25,
		marginBottom: 5,
		diagramWidth: 150,
		diagramHeight: 150,
		dotRadius: 9,
		labelFontSize: 24
	};

	export let fretted: (number | null)[] = [];
	export let style: DiagramStyle = defaultDiagramStyle;

	const findLowestFret = (fretted: number[]) => {
		// Exception for Am7 (lowest fretting is all open strings)
		if (fretted.every((fret) => fret === 0)) {
			return 1;
		}

		const maxFret = Math.max(...fretted);
		let lowestFret = maxFret > 4 ? maxFret - 3 : 1;

		for (let i = 0; i < 25; i++) {
			if (fretted.every((fret) => fret <= 0 || fret > lowestFret)) {
				lowestFret += 1;
			} else {
				break;
			}
		}

		// This is (usually) safe and looks way better
		if (lowestFret === 2) {
			lowestFret = 1;
		}

		return lowestFret;
	};

	// Layout calculations

	const diagramStyle = { ...style, ...defaultDiagramStyle };

	const { diagramWidth, diagramHeight, dotRadius, labelFontSize } = diagramStyle;

	$: lowestFret = findLowestFret(fretted);
	$: relativeFrets = fretted.map((fret) => fret - lowestFret);

	const boardWidth = diagramWidth - (diagramStyle.marginLeft + diagramStyle.marginRight);
	const boardHeight = diagramHeight - (diagramStyle.marginTop + diagramStyle.marginBottom);

	const dotFretIncrement = boardHeight / 5;

	const fretLabelXcoord = diagramWidth - 1.2 * labelFontSize;
	const fretLabelYCoord = diagramStyle.marginTop + 0.5 * dotFretIncrement;

	let dotYCoords: (number | null)[];
	$: dotYCoords = relativeFrets.map((fret) => {
		return diagramStyle.marginTop + (fret + 0.5) * dotFretIncrement;
	});

	// middle strings only
	const stringXcoords = [
		diagramStyle.marginLeft - diagramStyle.lineWidth / 2 + Math.floor((1 / 5) * boardWidth),
		diagramStyle.marginLeft - diagramStyle.lineWidth / 2 + Math.floor((2 / 5) * boardWidth),
		diagramStyle.marginLeft - diagramStyle.lineWidth / 2 + Math.floor((3 / 5) * boardWidth),
		diagramStyle.marginLeft - diagramStyle.lineWidth / 2 + Math.floor((4 / 5) * boardWidth)
	];

	const fretYcoords = [
		diagramStyle.marginTop - diagramStyle.lineWidth / 2 + Math.floor((1 / 5) * boardHeight),
		diagramStyle.marginTop - diagramStyle.lineWidth / 2 + Math.floor((2 / 5) * boardHeight),
		diagramStyle.marginTop - diagramStyle.lineWidth / 2 + Math.floor((3 / 5) * boardHeight),
		diagramStyle.marginTop - diagramStyle.lineWidth / 2 + Math.floor((4 / 5) * boardHeight)
	];

	const dotXcoords = [
		diagramStyle.marginLeft + Math.floor((0 / 5) * boardWidth),
		diagramStyle.marginLeft + Math.floor((1 / 5) * boardWidth),
		diagramStyle.marginLeft + Math.floor((2 / 5) * boardWidth),
		diagramStyle.marginLeft + Math.floor((3 / 5) * boardWidth),
		diagramStyle.marginLeft + Math.floor((4 / 5) * boardWidth),
		diagramStyle.marginLeft + Math.floor((5 / 5) * boardWidth)
	];
</script>

<svg
	class="chord-diagram"
	viewBox="0 0 {diagramWidth} {diagramHeight}"
	xmlns="http://www.w3.org/2000/svg"
>
	<!-- Fretboard top line -->
	{#if lowestFret <= 1}
		<rect
			x={diagramStyle.marginLeft}
			y={diagramStyle.marginTop - diagramStyle.lineWidth * 1.5}
			width={boardWidth}
			height={diagramStyle.lineWidth * 2}
			stroke={diagramStyle.lineColor}
			fill={diagramStyle.lineColor}
			stroke-width={diagramStyle.lineWidth}
			rx={diagramStyle.lineWidth}
			ry={diagramStyle.lineWidth}
			stroke-linejoin="round"
		/>
	{/if}

	<!-- X's for muted strings -->
	{#each [0, 1, 2, 3, 4, 5] as stringIndex}
		{#if fretted[stringIndex] < 0}
			<text
				font-size="18px"
				transition:fade
				color={diagramStyle.dotColor}
				x={dotXcoords[stringIndex] - 6}
				y={diagramStyle.marginTop - 10}>x</text
			>
		{/if}
	{/each}

	<!-- O's for open strings -->
	{#each [0, 1, 2, 3, 4, 5] as stringIndex}
		{#if fretted[stringIndex] == 0}
			<text
				font-size="16px"
				transition:fade
				color={diagramStyle.dotColor}
				x={dotXcoords[stringIndex] - 6}
				y={diagramStyle.marginTop - 8}>O</text
			>
		{/if}
	{/each}

	<!-- Board -->
	<rect
		x={diagramStyle.marginLeft}
		y={diagramStyle.marginTop}
		width={boardWidth}
		height={boardHeight}
		stroke={diagramStyle.lineColor}
		fill={diagramStyle.boardColor}
		stroke-width={diagramStyle.lineWidth}
		rx={diagramStyle.lineWidth}
		ry={diagramStyle.lineWidth}
		stroke-linejoin="round"
	/>

	<!-- Middle strings -->
	{#each stringXcoords as xco}
		<rect
			x={xco}
			y={diagramStyle.marginTop}
			width={diagramStyle.lineWidth}
			height={boardHeight}
			fill={diagramStyle.lineColor}
		/>
	{/each}

	<!-- Fret lines -->
	{#each fretYcoords as yco}
		<rect
			x={diagramStyle.marginLeft}
			y={yco}
			width={boardWidth}
			height={diagramStyle.lineWidth}
			fill={diagramStyle.lineColor}
		/>
	{/each}

	<!-- Fretted strings -->
	{#each [0, 1, 2, 3, 4, 5] as stringIndex}
		{#if relativeFrets[stringIndex] >= 0}
			<circle
				class="chord-diagram-note"
				transition:fade
				fill={diagramStyle.dotColor}
				cx={dotXcoords[stringIndex]}
				cy={dotYCoords[stringIndex]}
				r={dotRadius}
			/>
		{/if}
	{/each}

	<!-- First fret label -->
	{#if lowestFret > 1}
		<text
			x={fretLabelXcoord}
			y={fretLabelYCoord}
			class="chord-diagram-fret-label"
			font-size={labelFontSize}
			dominant-baseline="central"
			text-anchor="start"
			>{lowestFret}
		</text>
	{/if}
</svg>

<style>
	.chord-diagram {
		filter: drop-shadow(1px 2px 1px rgb(0 0 0 / 0.4));
		user-select: none;
	}

	.chord-diagram-note {
		transition: cy 300ms ease-in-out;
	}

	.chord-diagram-fret-label {
		font: sans-serif;
	}
</style>
