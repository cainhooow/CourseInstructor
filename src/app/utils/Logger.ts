import { Request } from "express";
import { green, yellow, cyan, red, blue, magenta } from "console-log-colors";

type LogLevel = "INFO" | "DEBUG" | "ERROR" | "CRITICAL" | "DATABASE";

export default class Logger {
  static printRequest(req: Request) {
    const { path, ip } = req;

    const log = `${cyan(new Date().toLocaleString())} - ${green(
      path
    )} - ${yellow(ip)}`;

    switch (req.method) {
      case "GET":
        return console.log(`🟣 [${green(req.method)}] ${log}`);
      case "POST":
        return console.log(`🟣 [${yellow(req.method)}] ${log}`);
      case "PUT":
        return console.log(`🟣 [${cyan(req.method)}] ${log}`);
      case "OPTIONS":
        return console.log(`🟣 [${red(req.method)}] ${log}`);
      default:
        return console.log(`🟣 [${req.method}] ${log}`);
    }
  }

  static welcome(port: number) {
    console.log(
      `☑️ ${green("Server running on port:")} ${blue(port)} \n☑️ ${green(
        "Host:"
      )} ${blue(`http://localhost:${port}`)}
      `
    );
  }

  static database(...args: any[]) {
    console.debug(
      `📦 [${green("DATABASE")}] ${cyan(new Date().toLocaleString())} - ${blue(
        args
      )}`
    );
  }

  static debug(...args: any[]) {
    console.debug(
      `🟡 [${magenta("DEBUG")}] ${cyan(new Date().toLocaleString())} - ${blue(
        args
      )}`
    );
  }

  static critical(...args: any[]) {
    console.error(
      `🔴 [${red("CRITICAL")}] ${red(new Date().toLocaleString())} - ${red(
        args
      )}`
    );
  }

  static error(...args: any[]) {
    console.error(
      `🟠 [${red("ERROR")}] ${cyan(new Date().toLocaleString())} - ${blue(
        args
      )}`
    );
  }

  static info(...args: any[]) {
    console.info(
      `🟣 [${magenta("INFO")}] ${blue(
        new Date().toLocaleDateString()
      )} - ${cyan(args)}`
    );
  }

  static log(level: LogLevel, ...args: any[]) {
    const levelKey = level.toLowerCase();

    const levels: Record<string, any> = {
      critical: this.critical,
      info: this.info,
      error: this.error,
      debug: this.debug,
      database: this.database,
    };

    return levels[levelKey] ? levels[levelKey](...args) : this.debug(...args);
  }
}
