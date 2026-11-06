import Prism from 'prismjs';

// `prismjs/components/prism-cypher` (used in parser-adapter) is a plain script that mutates the global
// `Prism`. Bundlers keep prismjs' CJS core lazy and may evaluate the component
// before the core has run, so force the core to initialise (and publish the
// global) from a module that is imported first.
(globalThis as { Prism?: typeof Prism }).Prism = Prism;
