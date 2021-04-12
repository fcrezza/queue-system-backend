import passport from "passport";
import bcrypt from "bcrypt";
import {Strategy as LocalStrategy} from "passport-local";

import {HTTPBadRequestError, HTTPNotFoundError} from "./errors";
import {pool} from "../services/main";
import Student from "../services/student";
import Professor from "../services/professor";

passport.use(
  "professor",
  new LocalStrategy(
    {usernameField: "email", passwordField: "password"},
    async (email, password, done) => {
      const connection = await pool.getConnection();
      const professor = new Professor(connection);
      const professorData = await professor.getProfessorByEmail({email});
      connection.release();

      if (!professorData) {
        return done(
          new HTTPNotFoundError(`Tidak ada akun dengan email ${email}`)
        );
      }

      const matchPassword = await bcrypt.compare(
        password,
        professorData.password
      );

      if (!matchPassword) {
        return done(
          new HTTPBadRequestError("Password yang kamu masukan salah")
        );
      }

      return done(null, {
        ...professorData,
        role: "professor"
      });
    }
  )
);

passport.use(
  "student",
  new LocalStrategy(
    {usernameField: "email", passwordField: "password"},
    async (email, password, done) => {
      const connection = await pool.getConnection();
      const student = new Student(connection);
      const studentData = await student.getStudentByEmail({email});
      connection.release();

      if (!studentData) {
        return done(
          new HTTPNotFoundError(`Tidak ada akun dengan email ${email}`)
        );
      }

      const matchPassword = await bcrypt.compare(
        password,
        studentData.password
      );

      if (!matchPassword) {
        return done(
          new HTTPBadRequestError("Password yang kamu masukan salah")
        );
      }

      return done(null, {
        ...studentData,
        role: "student"
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, {id: user.id, role: user.role});
});

passport.deserializeUser(async (user, done) => {
  const {id, role} = user;
  const connection = await pool.getConnection();

  if (role === "professor") {
    const professor = new Professor(connection);
    const professorData = await professor.getProfessorById({id}, connection);
    done(null, {...professorData, role});
  } else {
    const student = new Student(connection);
    const studentData = await student.getStudentById({id}, connection);
    done(null, {...studentData, role});
  }

  connection.release();
});

export default passport;
