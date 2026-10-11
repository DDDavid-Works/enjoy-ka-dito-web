// Cache life for fallback results (API unreachable). Retries soon, but unlike the built-in `seconds` profile
// it isn't "short-lived", which Cache Components would treat as request-time data and break prerendering.
export const FAILURE_LIFE = { stale: 30, revalidate: 30, expire: 600 }
