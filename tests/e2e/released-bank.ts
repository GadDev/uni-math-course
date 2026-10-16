import { readFileSync } from 'node:fs';

// Browser journeys must follow the version served by the release registry.
// Historical-version behaviour is tested explicitly, not by pinning all tests
// to the first published bank.
export const selectedL05Version: number = JSON.parse(
  readFileSync('content/releases.json', 'utf8'),
).lessons.L05.version;

export const selectedL05Exercises = JSON.parse(
  readFileSync(`exercises/L05/v${selectedL05Version}.json`, 'utf8'),
).exercises;
