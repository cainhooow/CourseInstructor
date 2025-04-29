import { FastExpress } from "@fastexpress/http";
import { handle, i18next } from "@fastexpress/resources";
import passport from "passport";
import express from "express";
import dotenv from "dotenv";
import Router from "./app/versions/route";
import JwtAuthStrategy from "./app/strategy/jwt.strategy";
import LocalStrategy from "./app/strategy/local.strategy";

dotenv.config();

const app = new FastExpress({
    port: 3000,
    baseUri: "/",
    baseController: Router,
    strategies: [JwtAuthStrategy, LocalStrategy],
    passport
});

app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(handle(i18next as any));

app.listen();