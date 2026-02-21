import log from 'loglevel'

const DEFAULT_LEVEL = import.meta.env.DEV ? 'debug' : 'warn'

export function createLogger(namespace) {
  const logger = log.getLogger(namespace)
  logger.setLevel(DEFAULT_LEVEL)

  const originalFactory = logger.methodFactory
  logger.methodFactory = function (methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName)
    return function (...args) {
      rawMethod(`[${loggerName}]`, ...args)
    }
  }
  logger.setLevel(logger.getLevel())

  return logger
}
