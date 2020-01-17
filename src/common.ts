export type Failable<T> = { ok: false; error: Error } | { ok: true; value: T }
