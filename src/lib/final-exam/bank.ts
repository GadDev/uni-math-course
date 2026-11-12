// Server only. Immutable content version; never import into a client island.
import data from '../../../exercises/final-exam/v1.json' with { type: 'json' };
import type { Question } from './types.ts';
export const bank = data as Question[];
