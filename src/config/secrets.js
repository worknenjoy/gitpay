// Compatibility shim:
// - Dev/Test: keeps CommonJS callers that do `require('../config/secrets')` working.
// - Build: this file is excluded from `tsc` output (see `tsconfig.json`).
module.exports = require('./secrets.ts')
