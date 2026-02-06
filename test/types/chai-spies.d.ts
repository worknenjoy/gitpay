import 'chai'

declare module 'chai' {
  export const spy: {
    on<T extends object, K extends keyof T>(object: T, method: K): any
    restore<T extends object, K extends keyof T>(object: T, method: K): void
  }
}

declare global {
  namespace Chai {
    interface ChaiStatic {
      spy: {
        on<T extends object, K extends keyof T>(object: T, method: K): any
        restore<T extends object, K extends keyof T>(object: T, method: K): void
      }
    }
  }
}

export {}
