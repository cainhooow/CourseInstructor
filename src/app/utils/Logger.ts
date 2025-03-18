import { Request } from "express";
import { green, yellow, cyan, red, blue } from "console-log-colors";

export default class Logger {
  static printRequest(req: Request) {
    const { path, ip } = req;
    const log = `${yellow(ip)} - ${green(path)} ${cyan(
      new Date().toLocaleString()
    )}`;

    switch (req.method) {
      case "GET":
        return console.log(`[${green(req.method)}] ${log}`);
      case "POST":
        return console.log(`[${yellow(req.method)}] ${log}`);
      case "PUT":
        return console.log(`[${cyan(req.method)}] ${log}`);
      case "OPTIONS":
        return console.log(`[${red(req.method)}] ${log}`);
      default:
        return console.log(`[${req.method}] ${log}`);
    }
  }

  static welcome(port: number) {
    console.log(
      `# ${green("Server running on port:")} ${blue(port)} \n# ${green(
        "Host:"
      )} ${blue(`http://localhost:${port}`)}
      `
    );
  }
}
