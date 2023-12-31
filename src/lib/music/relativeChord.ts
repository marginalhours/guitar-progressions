/**
 * This file contains types and helpers for working with intervals
 */

import { isLowerCase } from '../utilities';
import type { Interval, Quality } from './types';

export type RelativeChord = {
	number: Interval;
	quality: Quality;
};

const intervalNumberToSemitones: { [key in Interval]: number } = {
	I: 0,
	II: 2,
	bIII: 3,
	III: 4,
	IV: 5,
	V: 7,
	bVI: 8,
	VI: 9,
	bVII: 10,
	VII: 11,
	VIII: 12
};

/** Just the semitones required to reach a different letter number */
export const relativeChordInSemitones = ({ number }: RelativeChord): number => {
	return intervalNumberToSemitones[number];
};

/** Gives guitar-style chord notation */
export const relativeChordToString = (interval: RelativeChord): string => {
	const { number, quality } = interval;

	switch (quality) {
		case 'major':
			return number;
		case 'minor':
			return number.toLowerCase();
		case '5':
			return `${number}5`;
		case 'dominant-7th':
			return `${number}7`;
		case 'major-7th':
			return `${number}maj7`;
		case 'minor-7th':
			return `${number}m7`;
		case 'minor-major-7th':
			return `${number.toLowerCase()}maj7`;
		case 'suspended-4th':
			return `${number}sus4`;
		case 'suspended-2nd':
			return `${number}sus2`;
		case '6':
			return `${number}6`;
		case 'minor-major-6':
			return `${number.toLowerCase()}maj6`;
		case '9':
			return `${number}9`;
		case 'minor-9':
			return `${number.toLowerCase()}9`;
		case 'minor-major-9':
			return `${number.toLowerCase()}maj9`;
		case '11':
			return `${number}11`;
		case 'minor-11':
			return `${number.toLowerCase()}11`;
		case 'major-11':
			return `${number}maj11`;
		case 'minor-major-11':
			return `${number.toLowerCase()}maj11`;
		case 'major-add-9':
			return `${number}add9`;
		case 'minor-add-9':
			return `${number.toLowerCase()}add9`;
		case '6-add-9':
			return `${number}6add9`;
		case 'minor-6-add-9':
			return `${number.toLowerCase()}6add9`;
		case 'dominant-7th-add-11':
			return `${number}7add11`;
		case 'major-7th-add-11':
			return `${number}maj7add11`;
		case 'minor-7th-add-11':
			return `${number.toLowerCase()}7add11`;
		case 'minor-major-7th-add-11':
			return `${number.toLowerCase()}maj7add11`;
		case 'dominant-7th-add-13':
			return `${number}7add13`;
		case 'major-7th-add-13':
			return `${number}maj7add13`;
		case 'minor-7th-add-13':
			return `${number.toLowerCase()}7add13`;
		case 'minor-major-7th-add-13':
			return `${number.toLowerCase()}maj7add13`;
		case 'dominant-7th-flat-5':
			return `${number}7b5`;
		case 'augmented':
			return `${number}aug`;
		case 'augmented-7th':
			return `${number}aug7`;
		case 'dominant-7th-flat-9th':
			return `${number}7b9`;
		case 'dominant-7th-sharp-9th':
			return `${number}7s9`;
		case 'augmented-7th-flat-9th':
			return `${number}aug7b9`;
		case 'minor-7th-flat-5':
			return `${number.toLowerCase()}7b5`;
		case 'minor-7th-sharp-5':
			return `${number.toLowerCase()}7s5`;
		case 'minor-7th-flat-9th':
			return `${number.toLowerCase()}7b9`;
		case '6-suspended-4th':
			return `${number}6sus4`;
		case '6-suspended-2nd':
			return `${number}6sus2`;
		case 'dominant-7th-suspended-4th':
			return `${number}7sus4`;
		case 'dominant-7th-suspended-2nd':
			return `${number}7sus2`;
		case 'major-7th-suspended-4th':
			return `${number}maj7sus4`;
		case 'major-7th-suspended-2nd':
			return `${number}maj7sus2`;
		case 'diminished':
			return `${number}dim`;
		case 'diminished-7th':
			return `${number}dim7`;
		default:
			return number;
	}
};

/*
 * Turn a guitar-style interval (vii, Vdim etc) into an Interval object
 */
export const parseRelativeChord = (intervalString: string): RelativeChord | null => {
	const matches = intervalString.match(
		/^(b?[VI]+|b?[vi]+)(7sus4|7sus2|7add13|7add11|6add9|6sus4|6sus2|maj11|maj9|maj7add13|maj7add11|maj7sus4|maj7sus2|maj7|aug7b9|aug7|dim7|7b5|7s5|7b9|7s9|add9|sus4|sus2|aug|dim|11|9|7|6|5){0,1}/
	);

	if (matches === null) {
		return null;
	}

	let quality: Quality = isLowerCase(matches[1]) ? 'minor' : 'major';

	const [_, __, rawQuality] = matches;

	switch (rawQuality) {
		case 'maj7':
			quality = quality === 'major' ? 'major-7th' : 'minor-major-7th';
			break;
		case 'maj9':
			quality = quality === 'major' ? 'major-9' : 'minor-major-9';
			break;
		case '7sus4':
			quality = 'dominant-7th-suspended-4th';
			break;
		case '7sus2':
			quality = 'dominant-7th-suspended-2nd';
			break;
		case '7b5':
			quality = quality === 'major' ? 'dominant-7th-flat-5' : 'minor-7th-flat-5';
			break;
		case '7b9':
			quality = quality === 'major' ? 'dominant-7th-flat-9th' : 'minor-7th-flat-9th';
			break;
		case '7s9':
			quality = 'dominant-7th-sharp-9th';
			break;
		case '7s5':
			quality = 'minor-7th-sharp-5';
			break;
		case '6sus4':
			quality = '6-suspended-4th';
			break;
		case '6sus2':
			quality = '6-suspended-2nd';
			break;
		case 'maj7sus4':
			quality = 'major-7th-suspended-4th';
			break;
		case 'maj7sus2':
			quality = 'major-7th-suspended-2nd';
			break;
		case 'aug7b9':
			quality = 'augmented-7th-flat-9th';
			break;
		case 'aug7':
			quality = 'augmented-7th';
			break;
		case 'dim7':
			quality = 'diminished-7th';
			break;
		case 'aug':
			quality = 'augmented';
			break;
		case 'dim':
			quality = 'diminished';
			break;
		case '5':
			quality = '5';
			break;
		case '6':
			quality = quality === 'major' ? '6' : 'minor-major-6';
			break;
		case '6add9':
			quality = quality === 'major' ? '6-add-9' : 'minor-6-add-9';
			break;
		case '7add11':
			quality = quality === 'major' ? 'dominant-7th-add-11' : 'minor-7th-add-11';
			break;
		case '7add13':
			quality = quality === 'major' ? 'dominant-7th-add-13' : 'minor-7th-add-13';
			break;
		case '7':
			quality = quality === 'major' ? 'dominant-7th' : 'minor-7th';
			break;
		case '9':
			quality = quality === 'major' ? '9' : 'minor-9';
			break;
		case '11':
			quality = quality === 'major' ? '11' : 'minor-11';
			break;
		case 'maj7add11':
			quality = quality === 'major' ? 'major-7th-add-11' : 'minor-major-7th-add-11';
			break;
		case 'maj7add13':
			quality = quality === 'major' ? 'major-7th-add-13' : 'minor-major-7th-add-13';
			break;
		case 'maj11':
			quality = quality === 'major' ? 'major-11' : 'minor-major-11';
			break;
		case 'sus2':
			quality = 'suspended-2nd';
			break;
		case 'sus4':
			quality = 'suspended-4th';
			break;
		case 'add9':
			quality = `${quality}-add-9`;
			break;
	}

	let number = matches[1].toUpperCase();
	if (number[0] === 'B') {
		number = `b${number.substring(1)}`;
	}

	return { number: number as Interval, quality };
};

/*
 * Fancy tagged template literal for writing progressions like $`I iii IV V`
 */
export const progression = (strings: TemplateStringsArray, ...values: any): RelativeChord[] => {
	return strings[0].split(/[\s-]/).map(parseRelativeChord) as RelativeChord[];
};

export const progressionFromString = (string: string): RelativeChord[] => {
	return string.split(/[\s-]/).map(parseRelativeChord) as RelativeChord[];
};
