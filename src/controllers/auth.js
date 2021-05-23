// TODO: Handle error when passport.authenticate called?
import bcrypt from "bcrypt";
import path from "path";
import Joi from "joi";
import {v2 as cloudinary} from "cloudinary";

import passport from "../utils/passport";
import {HTTPBadRequestError, HTTPForbiddenError} from "../utils/errors";
import {pool} from "../services/main";
import Student from "../services/student";
import Professor from "../services/professor";
import Gender from "../services/gender";
import Study from "../services/study";

export async function professorSignupController(request, response, next) {
  const inputValidation = Joi.object({
    nidn: Joi.string()
      .trim()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.base": "nidn yang dimasukan tidak valid",
        "string.pattern.base": "nidn hanya boleh mengandung angka 0-9",
        "string.empty": "nidn tidak boleh kosong",
        "any.required": "nidn tidak boleh kosong"
      }),
    fullname: Joi.string().trim().required().messages({
      "string.base": "Nama lengkap yang dimasukan bukan valid string",
      "string.empty": "Nama lengkap tidak boleh kosong",
      "any.required": "Nama lengkap tidak boleh kosong"
    }),
    email: Joi.string().email().trim().required().messages({
      "string.base": "Email yang dimasukan bukan valid string",
      "string.email": "Email yang dimasukan tidak valid",
      "string.empty": "Email tidak boleh kosong",
      "any.required": "Email tidak boleh kosong"
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "Password yang dimasukan bukan valid string",
      "string.min": "Password minimal mengandung 8 karakter",
      "string.empty": "Password tidak boleh kosong",
      "any.required": "Password tidak boleh kosong"
    }),
    address: Joi.string().trim().required().messages({
      "string.base": "Alamat yang dimasukan tidak valid",
      "string.empty": "Alamat tidak boleh kosong",
      "any.required": "Alamat tidak boleh kosong"
    }),
    gender: Joi.number().integer().required().messages({
      "number.base": "Jenis kelamin yang dimasukan tidak valid",
      "any.required": "Jenis kelamin tidak boleh kosong"
    }),
    study: Joi.number().integer().required().messages({
      "number.base": "Prodi yang dimasukan tidak valid",
      "any.required": "Prodi tidak boleh kosong"
    })
  });

  const {error, value: input} = inputValidation.validate(request.body);

  if (error) {
    throw new HTTPBadRequestError(error.details[0].message);
  }

  request.body = input;

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const professorAvatar = await cloudinary.uploader.upload(
    // eslint-disable-next-line
    path.join(__dirname, "../assets/images/default.png"),
    {
      folder: "uniguidance/professors",
      resource_type: "image"
    }
  );
  const connection = await pool.getConnection();
  const professor = new Professor(connection);
  await professor.insertProfessor({
    ...input,
    password: hashedPassword,
    avatar: professorAvatar.public_id
  });

  // eslint-disable-next-line
  passport.authenticate("professor", (error, user) => {
    if (error) {
      return next(error);
    }

    request.login(user, async err => {
      if (err) {
        return next(err);
      }

      const gender = new Gender(connection);
      const professorGender = await gender.getGenderById({id: user.gender_id});
      const study = new Study(connection);
      const professorStudy = await study.getStudyById({id: user.study_id});
      connection.release();

      return response.json({
        id: user.id,
        nidn: user.nidn,
        fullname: user.fullname,
        email: user.email,
        address: user.address,
        avatar: professorAvatar.secure_url,
        gender: professorGender,
        study: professorStudy,
        is_verified: user.is_verified,
        role: user.role,
        created_at: user.created_at
      });
    });
  })(request, response, next);
}

export async function professorEmailSignupController(request, response) {
  const inputValidation = Joi.object({
    email: Joi.string().email().trim().required().messages({
      "string.base": "Email yang dimasukan bukan valid string",
      "string.email": "Email yang dimasukan tidak valid",
      "string.empty": "Email tidak boleh kosong",
      "any.required": "Email tidak boleh kosong"
    })
  });

  const {error: validationError, value: input} = inputValidation.validate(
    request.body
  );

  if (validationError) {
    throw new HTTPBadRequestError(validationError.details[0].message);
  }

  const connection = await pool.getConnection();
  const professorService = new Professor(connection);
  const professor = await professorService.getProfessorByEmail(input);
  connection.release();

  if (professor) {
    throw new HTTPForbiddenError("Alamat email ini sudah pernah digunakan");
  }

  response.json({
    message: "Alamat email ini tersedia dan belum pernah digunakan"
  });
}

export async function professorNIDNSignupController(request, response) {
  const inputValidation = Joi.object({
    nidn: Joi.string()
      .trim()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.base": "nidn yang dimasukan tidak valid",
        "string.pattern.base": "nidn hanya boleh mengandung angka 0-9",
        "string.empty": "nidn tidak boleh kosong",
        "any.required": "nidn tidak boleh kosong"
      })
  });

  const {error: validationError, value: input} = inputValidation.validate(
    request.body
  );

  if (validationError) {
    throw new HTTPBadRequestError(validationError.details[0].message);
  }

  const connection = await pool.getConnection();
  const professorService = new Professor(connection);
  const professor = await professorService.getProfessorByNIDN(input);
  connection.release();

  if (professor) {
    throw new HTTPForbiddenError("NIDN sudah pernah digunakan");
  }

  response.json({
    message: "NIDN tersedia dan belum pernah digunakan"
  });
}

export async function studentSignupController(request, response, next) {
  const inputValidation = Joi.object({
    fullname: Joi.string().trim().required().messages({
      "string.base": "Nama lengkap yang dimasukan bukan valid string",
      "string.empty": "Nama lengkap tidak boleh kosong",
      "any.required": "Nama lengkap tidak boleh kosong"
    }),
    email: Joi.string().email().trim().required().messages({
      "string.base": "Email yang dimasukan bukan valid string",
      "string.email": "Email yang dimasukan tidak valid",
      "string.empty": "Email tidak boleh kosong",
      "any.required": "Email tidak boleh kosong"
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "Password yang dimasukan bukan valid string",
      "string.min": "Password minimal mengandung 8 karakter",
      "string.empty": "Password tidak boleh kosong",
      "any.required": "Password tidak boleh kosong"
    }),
    nim: Joi.string()
      .trim()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.base": "NIM yang dimasukan tidak valid",
        "string.pattern.base": "Nim hanya boleh mengandung angka 0-9",
        "string.empty": "NIM tidak boleh kosong",
        "any.required": "NIM tidak boleh kosong"
      }),
    semester: Joi.number().integer().min(1).required().messages({
      "number.base": "Semester yang dimasukan tidak valid",
      "number.min": "Minimal semester 1",
      "any.required": "Semester tidak boleh kosong"
    }),
    address: Joi.string().trim().required().messages({
      "string.base": "Alamat yang dimasukan tidak valid",
      "string.empty": "Alamat tidak boleh kosong",
      "any.required": "Alamat tidak boleh kosong"
    }),
    gender: Joi.number().integer().required().messages({
      "number.base": "Jenis kelamin yang dimasukan tidak valid",
      "any.required": "Jenis kelamin tidak boleh kosong"
    }),
    study: Joi.number().integer().required().messages({
      "number.base": "Prodi yang dimasukan tidak valid",
      "any.required": "Prodi tidak boleh kosong"
    }),
    professor: Joi.number().integer().required().messages({
      "number.base": "Dosen yang dimasukan tidak valid",
      "any.required": "Dosen tidak boleh kosong"
    })
  });

  const {error, value: input} = inputValidation.validate(request.body);

  if (error) {
    throw new HTTPBadRequestError(error.details[0].message);
  }

  request.body = input;

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const studentAvatar = await cloudinary.uploader.upload(
    // eslint-disable-next-line
    path.join(__dirname, "../assets/images/default.png"),
    {
      folder: "uniguidance/students",
      resource_type: "image"
    }
  );
  const connection = await pool.getConnection();
  const student = new Student(connection);
  await student.insertStudent({
    ...input,
    password: hashedPassword,
    avatar: studentAvatar.public_id
  });

  // eslint-disable-next-line
  passport.authenticate("student", (error, user) => {
    if (error) {
      return next(error);
    }

    request.login(user, async err => {
      if (err) {
        return next(err);
      }

      const professor = new Professor(connection);
      const studentProfessor = await professor.getProfessorById({
        id: user.professor_id
      });
      const professorAvatar = await cloudinary.api.resource(
        studentProfessor.avatar
      );
      const gender = new Gender(connection);
      const genders = await gender.getAllGenders();
      const study = new Study(connection);
      const studies = await study.getAllStudies();
      connection.release();
      const professorData = {
        id: studentProfessor.id,
        nidn: studentProfessor.nidn,
        fullname: studentProfessor.fullname,
        email: studentProfessor.email,
        address: studentProfessor.address,
        avatar: professorAvatar.secure_url,
        gender: genders.find(({id}) => studentProfessor.gender_id === id),
        study: studies.find(({id}) => studentProfessor.study_id === id),
        is_verified: studentProfessor.is_verified,
        role: "professor",
        created_at: studentProfessor.created_at
      };

      return response.json({
        id: user.id,
        nim: user.nim,
        fullname: user.fullname,
        email: user.email,
        semester: user.semester,
        avatar: studentAvatar.secure_url,
        address: user.address,
        gender: genders.find(({id}) => user.gender_id === id),
        study: studies.find(({id}) => user.study_id === id),
        role: user.role,
        is_verified: user.is_verified,
        created_at: user.created_at,
        professor: professorData
      });
    });
  })(request, response, next);
}

export async function studentEmailSignupController(request, response) {
  const inputValidation = Joi.object({
    email: Joi.string().email().trim().required().messages({
      "string.base": "Email yang dimasukan bukan valid string",
      "string.email": "Email yang dimasukan tidak valid",
      "string.empty": "Email tidak boleh kosong",
      "any.required": "Email tidak boleh kosong"
    })
  });

  const {error: validationError, value: input} = inputValidation.validate(
    request.body
  );

  if (validationError) {
    throw new HTTPBadRequestError(validationError.details[0].message);
  }

  const connection = await pool.getConnection();
  const studentService = new Student(connection);
  const student = await studentService.getStudentByEmail(input);
  connection.release();

  if (student) {
    throw new HTTPForbiddenError("Alamat email ini sudah pernah digunakan");
  }

  response.json({
    message: "Alamat email ini tersedia dan belum pernah digunakan"
  });
}

export async function studentNIMSignupController(request, response) {
  const inputValidation = Joi.object({
    nim: Joi.string()
      .trim()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.base": "NIM yang dimasukan tidak valid",
        "string.pattern.base": "Nim hanya boleh mengandung angka 0-9",
        "string.empty": "NIM tidak boleh kosong",
        "any.required": "NIM tidak boleh kosong"
      })
  });

  const {error: validationError, value: input} = inputValidation.validate(
    request.body
  );

  if (validationError) {
    throw new HTTPBadRequestError(validationError.details[0].message);
  }

  const connection = await pool.getConnection();
  const studentService = new Student(connection);
  const student = await studentService.getStudentByNIM(input);
  connection.release();

  if (student) {
    throw new HTTPForbiddenError("NIM sudah pernah digunakan");
  }

  response.json({
    message: "NIM tersedia dan belum pernah digunakan"
  });
}

export function professorLoginController(request, response, next) {
  const inputValidation = Joi.object({
    email: Joi.string().email().trim().required().messages({
      "string.base": "Email yang dimasukan bukan valid string",
      "string.email": "Email yang dimasukan tidak valid",
      "string.empty": "Email tidak boleh kosong",
      "any.required": "Email tidak boleh kosong"
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "Password yang dimasukan bukan valid string",
      "string.min": "Password minimal mengandung 8 karakter",
      "string.empty": "Password tidak boleh kosong",
      "any.required": "Password tidak boleh kosong"
    })
  });

  const {error: validationError, value: input} = inputValidation.validate(
    request.body
  );

  if (validationError) {
    throw new HTTPBadRequestError(validationError.details[0].message);
  }

  request.body = input;

  // eslint-disable-next-line
  passport.authenticate("professor", (err, user) => {
    if (err) {
      return next(err);
    }

    request.login(user, async error => {
      if (error) {
        return next(error);
      }

      const connection = await pool.getConnection();
      const gender = new Gender(connection);
      const professorGender = await gender.getGenderById({id: user.gender_id});
      const study = new Study(connection);
      const professorStudy = await study.getStudyById({id: user.study_id});
      connection.release();
      const professorAvatar = await cloudinary.api.resource(user.avatar);

      return response.json({
        id: user.id,
        nidn: user.nidn,
        fullname: user.fullname,
        email: user.email,
        address: user.address,
        avatar: professorAvatar.secure_url,
        gender: professorGender,
        study: professorStudy,
        is_verified: user.is_verified,
        role: user.role,
        created_at: user.created_at
      });
    });
  })(request, response, next);
}

export function studentLoginController(request, response, next) {
  const inputValidation = Joi.object({
    email: Joi.string().email().trim().required().messages({
      "string.base": "Email yang dimasukan bukan valid string",
      "string.email": "Email yang dimasukan tidak valid",
      "string.empty": "Email tidak boleh kosong",
      "any.required": "Email tidak boleh kosong"
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "Password yang dimasukan bukan valid string",
      "string.min": "Password minimal mengandung 8 karakter",
      "string.empty": "Password tidak boleh kosong",
      "any.required": "Password tidak boleh kosong"
    })
  });

  const {error: validationError, value: input} = inputValidation.validate(
    request.body
  );

  if (validationError) {
    throw new HTTPBadRequestError(validationError.details[0].message);
  }

  request.body = input;
  // eslint-disable-next-line
  passport.authenticate("student", async (err, user) => {
    if (err) {
      return next(err);
    }

    request.login(user, async error => {
      if (error) {
        return next(error);
      }

      const connection = await pool.getConnection();
      const professor = new Professor(connection);
      const studentProfessor = await professor.getProfessorById({
        id: user.professor_id
      });
      const gender = new Gender(connection);
      const genders = await gender.getAllGenders();
      const study = new Study(connection);
      const studies = await study.getAllStudies();
      connection.release();
      const professorAvatar = await cloudinary.api.resource(
        studentProfessor.avatar
      );
      const studentAvatar = await cloudinary.api.resource(user.avatar);
      const professorData = {
        id: studentProfessor.id,
        nidn: studentProfessor.nidn,
        fullname: studentProfessor.fullname,
        email: studentProfessor.email,
        address: studentProfessor.address,
        avatar: professorAvatar.secure_url,
        gender: genders.find(({id}) => studentProfessor.gender_id === id),
        study: studies.find(({id}) => studentProfessor.study_id === id),
        is_verified: studentProfessor.is_verified,
        role: "professor",
        created_at: studentProfessor.created_at
      };

      return response.json({
        id: user.id,
        nim: user.nim,
        fullname: user.fullname,
        email: user.email,
        semester: user.semester,
        avatar: studentAvatar.secure_url,
        address: user.address,
        gender: genders.find(({id}) => user.gender_id === id),
        study: studies.find(({id}) => user.study_id === id),
        role: user.role,
        is_verified: user.is_verified,
        created_at: user.created_at,
        professor: professorData
      });
    });
  })(request, response, next);
}

export function logoutController(request, response) {
  request.logout();
  request.session.destroy();
  response.clearCookie("session", {path: "/"});
  response.end("Success logout");
}

export async function authenticatedUserController(request, response) {
  if (!request.isAuthenticated()) {
    return response.json({});
  }

  const {user} = request;
  const connection = await pool.getConnection();

  if (user.role === "professor") {
    const gender = new Gender(connection);
    const professorGender = await gender.getGenderById({id: user.gender_id});
    const study = new Study(connection);
    const professorStudy = await study.getStudyById({id: user.study_id});
    connection.release();
    const professorAvatar = await cloudinary.api.resource(user.avatar);

    return response.json({
      id: user.id,
      nidn: user.nidn,
      fullname: user.fullname,
      email: user.email,
      address: user.address,
      avatar: professorAvatar.secure_url,
      gender: professorGender,
      study: professorStudy,
      is_verified: user.is_verified,
      role: user.role,
      created_at: user.created_at
    });
  }

  const professor = new Professor(connection);
  const studentProfessor = await professor.getProfessorById({
    id: user.professor_id
  });
  const gender = new Gender(connection);
  const genders = await gender.getAllGenders();
  const study = new Study(connection);
  const studies = await study.getAllStudies();
  connection.release();
  const professorAvatar = await cloudinary.api.resource(
    studentProfessor.avatar
  );
  const studentAvatar = await cloudinary.api.resource(user.avatar);
  const professorData = {
    id: studentProfessor.id,
    nidn: studentProfessor.nidn,
    fullname: studentProfessor.fullname,
    email: studentProfessor.email,
    address: studentProfessor.address,
    avatar: professorAvatar.secure_url,
    gender: genders.find(({id}) => studentProfessor.gender_id === id),
    study: studies.find(({id}) => studentProfessor.study_id === id),
    is_verified: studentProfessor.is_verified,
    role: "professor",
    created_at: studentProfessor.created_at
  };

  return response.json({
    id: user.id,
    nim: user.nim,
    fullname: user.fullname,
    email: user.email,
    semester: user.semester,
    avatar: studentAvatar.secure_url,
    address: user.address,
    gender: genders.find(({id}) => user.gender_id === id),
    study: studies.find(({id}) => user.study_id === id),
    role: user.role,
    is_verified: user.is_verified,
    created_at: user.created_at,
    professor: professorData
  });
}
