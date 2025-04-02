import express from "express";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import Router from "./versions/route";
import LocalStrategy from "./strategy/local.strategy";
import JwtAuthStrategy from "./strategy/jwt.strategy";
import Logger from "./utils/logger";
import { handle, i18next } from "@fastexpress/resources";

export default class App {
  private app = express();
  private port: number;

  constructor(port: number) {
    this.port = port;
    this._configure();
  }

  public listen() {
    this._listen();
    return this.app;
  }

  private _listen() {
    this.app.listen(this.port, () => {
      Logger.welcome(this.port);
    });
  }

  private _configure() {
    Logger.log("INFO", "Configuring app defaults");
    dotenv.config();

    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(passport.initialize());
    this.app.use(handle(i18next as any));

    this._router();
    this._strategy();
  }

  private _strategy() {
    Logger.log("INFO", "Setup app strategies");
    new JwtAuthStrategy();
    new LocalStrategy();
  }

  private _router() {
    Logger.log("INFO", "Setup router");
    this.app.use(new Router().getRouter());
  }
}
