export class Logger {
  constructor(private scope: string) {}

  info(...args: unknown[]) {
    console.log(`[${this.scope}]`, ...args)
  }

  error(...args: unknown[]) {
    console.error(`[${this.scope}]`, ...args)
  }

  warn(...args: unknown[]) {
    console.warn(`[${this.scope}]`, ...args)
  }
}