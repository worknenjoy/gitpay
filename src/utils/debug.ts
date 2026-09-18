export const extractDebugObject = (obj: any): any => {
  if (typeof obj === 'function') {
    try {
      obj(NaN)
      const err = new Error()
      const stackLines = err.stack.split('\n')
      const callerLine = stackLines[2] || stackLines[1]
      const objSerializable = {
        err,
        stackLines,
        callerLine
      }
      return objSerializable
    } catch (err) {
      const stackLines = err.stack.split('\n')
      const callerLine = stackLines[2] || stackLines[1]
      const objSerializable = {
        err,
        stackLines,
        callerLine
      }
      return objSerializable
    }
  } else {
    return obj
  }
}

export const formatDebugObject = (name: string, obj: any, indent: number = 2): string => {
  const objJson = JSON.stringify(extractDebugObject(obj), null, indent)
  return `\x1b[1;38;2;240;79;120m${name}: \x1b[1;38;2;143;211;255m${objJson}\x1b[0m`
}

export const consoleDebugObject = (name: string, obj: any, indent: number = 2) => {
  const style =
    'font-weight: bold; padding: 4px; border-radius: 4px; font-size: 20px; font-family: Monaco, Monospace'
  const formatted = formatDebugObject(name, obj, indent)

  console.log(`%c${formatted}`, style)
  console.log()
}
