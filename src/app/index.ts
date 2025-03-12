import express from "express";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
// import JwtAuthStrategy from "./strategy/JwtStrategy";
import Router from "./versions/route";

export default class App {
  private app = express();
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.__configure();
  }

  public listen() {
    this.__listen();
    return this.app;
  }

  private __listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  private __configure() {
    dotenv.config();

    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(passport.initialize());

    this.__router();
    this.__strategy();
  }

  private __strategy() {
    // new JwtAuthStrategy();
  }

  private __router() {
    this.app.use(new Router().getRouter());
  }
}
