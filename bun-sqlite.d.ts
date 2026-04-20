declare module 'bun:sqlite' {
  export class Database {
    constructor(filename: string, options?: { readonly?: boolean })
    query<T = any>(sql: string): { all(): T[]; iterate(): Iterable<T> }
    close(): void
  }
}
