/**
 * Logger.ts
 *
 * name：Logger
 * function：Logging operation
 * updated: 2025/02/03
 **/

"use strict";

// define modules
import * as log4js from "log4js"; // Logger
import * as path from "path"; // path

// Logger class
class Logger {
  // logger
  static logger: any;
  // logger dir path
  static loggerDir: string;

  // construnctor
  constructor(dirpath: string, header?: string) {
    // logger dir path
    Logger.loggerDir = dirpath;
    // fixed headder
    const fixedHeader: string = header ? header : "";
    // Logger config
    const prefix: string = `${fixedHeader}_${new Date()
      .toJSON()
      .slice(0, 10)}.log`;
    // logger config
    log4js.configure({
      appenders: {
        app: {
          type: "dateFile",
          filename: path.join(Logger.loggerDir, prefix),
        },
        out: { type: "stdout" },
      },
      categories: {
        default: { appenders: ["out", "app"], level: "all" },
      },
    });
    // logger instance
    Logger.logger = log4js.getLogger();
  }

  // logger init
  initialize = (level: string) => {
    Logger.logger.level = level;
  };

  // log info
  info = (message: string) => {
    Logger.logger.info(message);
  };

  // log error
  error = (e: unknown) => {
    // error
    if (e instanceof Error) {
      // error
      Logger.logger.error(e.message);
    }
  };

  // log debug info
  debug = (message: string) => {
    Logger.logger.debug(message);
  };

  // log trace info
  trace = (message: string) => {
    Logger.logger.trace(message);
  };

  // shutdown logger
  exit = () => {
    log4js.shutdown((err: unknown) => {
      if (err) throw err;
      process.exit(0);
    });
  };
}

// export module
export default Logger;
