// Browser stub for Node built-ins. See `turbopack.resolveAlias` in next.config.mjs: the SDK's
// management client reaches for fs/dns/net/tls, those paths never execute in the browser, and
// Turbopack has no equivalent of webpack's `resolve.fallback: { x: false }` — aliasing to an
// empty module is how you express "this import exists but resolves to nothing" instead.
export default {};
