import { runApiExtractor } from '../../scripts/runApiExtractor.js';

// Deliberately outside src/ so it is not part of the package's tsc build.
runApiExtractor(import.meta.dirname);
