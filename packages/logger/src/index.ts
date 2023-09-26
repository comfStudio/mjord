/* eslint-disable no-console */
import {
  createConsoleProcessor,
  createDateAndLevelPrependProcessor,
  createThrottleProcessor,
  Logger,
  LogLevel,
  Processor,
  Record,
} from "@grabrinc/isomorphic-logger";

function createObjectTransformProcessor(): Processor {
  return (records: Record[]): Promise<Record[]> | Record[] | Promise<null> | null => {
    console.debug({ records });
    return records.map((v, i) => ({
      ...v,
      messages: v.messages,
    }));
  };
}

export default function setupLogger() {
  const logger = new Logger();
  // eslint-disable-next-line no-restricted-syntax
  for (const k of Object.keys(Logger.prototype)) {
    logger[k] = logger[k].bind(logger);
  }

  logger.channel(
    ...[
      // createStackTraceTransformProcessor(), // Converts error objects to string representing stack trace.
      createDateAndLevelPrependProcessor(), // Prepends every message with date and time.
      // @ts-expect-error
      process.env.NODE_ENV !== "test" ? createThrottleProcessor({ delay: 100, length: 10 }) : undefined, // Batch logged messages.
      createObjectTransformProcessor(),
      createConsoleProcessor(), // Write batched messages to console.
    ].filter(Boolean)
  );

  logger.setLevel(
    // @ts-expect-error
    process.env.NODE_ENV !== "production" ? LogLevel.DEBUG : LogLevel.INFO
  );

  function log(...args: any[]) {
    logger.info(...args);
  }

  type func = (...args: any[]) => void;

  // eslint-disable-next-line no-underscore-dangle
  log.logger = logger;
  log.i = logger.info.bind(logger) as func;
  log.info = logger.info.bind(logger) as func;
  log.w = logger.warn.bind(logger) as func;
  log.warn = logger.warn.bind(logger) as func;
  log.e = logger.error.bind(logger) as func;
  log.error = logger.error.bind(logger) as func;
  log.c = logger.error.bind(logger) as func;
  log.critical = logger.error.bind(logger) as func;
  log.d = logger.debug.bind(logger) as func;
  log.debug = logger.debug.bind(logger) as func;

  return log;
}

export type Logger = ReturnType<typeof setupLogger>;
