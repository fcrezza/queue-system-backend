import session from "express-session";
import MySqlStore from "express-mysql-session";

import {pool, getConfig} from "../services/main";

MySqlStore(session);
const sessionStore = new MySqlStore(getConfig(), pool);
export default session({
  name: "session",
  // This is the secret used to sign the session ID cookie, use env if available
  secret: process.env.SECRETKEY || "a9bb2391-b347-47d0-97ac-caad0457d503",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: "auto"
  }
});
