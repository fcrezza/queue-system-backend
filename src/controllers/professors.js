// const bcrypt = require("bcrypt");
// const {
//   getProfessorsUsername,
//   getProfessorsNIP,
//   getStudentsByProfessorID,
//   findProfessorByID,
//   modifyProfessorProfile,
//   getProfessorPassword,
//   modifyProfessorPassword
// } = require("../model/professor");
// const professorSchema = require("../validation/professorSchema");
import {v2 as cloudinary} from "cloudinary";

import {pool} from "../services/main";
import Professor from "../services/professor";
import Gender from "../services/gender";
import Study from "../services/study";

// async function fetchProfessorByID(req, res, next) {
//   try {
//     const dosenData = await findProfessorByID(req.params.id);
//     res.json(dosenData);
//   } catch (error) {
//     next(error);
//   }
// }

// async function changeProfessorProfile(req, res, next) {
//   try {
//     const professorUsername = await getProfessorsUsername(req.body.username);
//     if (professorUsername) {
//       if (
//         professorUsername.username &&
//         professorUsername.id !== parseInt(req.params.id, 10)
//       ) {
//         res.status(403).json({
//           message: "Sudah ada yang menggunakan username ini"
//         });
//         return;
//       }
//     }

//     const professorNIP = await getProfessorsNIP(req.body.nip);
//     if (professorNIP) {
//       if (professorNIP.nip && professorNIP.id !== parseInt(req.params.id, 10)) {
//         res.status(403).json({
//           message: "Sudah ada yang menggunakan nip ini"
//         });
//         return;
//       }
//     }

//     const schema = await professorSchema({type: "edit"});
//     const validateInput = await schema.validate(req.body);
//     const {
//       faculty: idFakultas,
//       gender: idGender,
//       address: alamat,
//       fullname: namaLengkap,
//       ...props
//     } = validateInput;
//     await modifyProfessorProfile(req.params.id, {
//       idFakultas,
//       alamat,
//       idGender,
//       namaLengkap,
//       ...props
//     });
//     res.end();
//   } catch (error) {
//     next(error);
//   }
// }

// async function fetchProfessorsUsername(req, res, next) {
//   try {
//     const username = await getProfessorsUsername(req.params.username);
//     if (username) {
//       res.status(403).json({
//         message: `Sudah ada yang menggunakan username ini`
//       });
//       return;
//     }

//     res.end();
//   } catch (error) {
//     next(error);
//   }
// }

// async function fetchProfessorsNIP(req, res, next) {
//   try {
//     const professorsNIP = await getProfessorsNIP(req.params.nip);

//     if (professorsNIP) {
//       res.status(403).json({
//         message: `Sudah ada yang menggunakan NIP ini`
//       });
//       return;
//     }

//     res.end();
//   } catch (error) {
//     next(error);
//   }
// }

// async function changeProfessorPassword(req, res, next) {
//   const {oldPassword, newPassword} = req.body;
//   const {id} = req.params;
//   try {
//     const {password} = await getProfessorPassword(id);
//     const matchOldPassword = await bcrypt.compare(oldPassword, password);
//     if (!matchOldPassword) {
//       res.status(403).json({message: "Password lama anda tidak cocok"});
//       return;
//     }
//     const hashPassword = await bcrypt.hash(newPassword, 10);
//     await modifyProfessorPassword({
//       id,
//       newPassword: hashPassword
//     });
//     res.end();
//   } catch (error) {
//     next(error);
//   }
// }

// async function fetchStudentsByProfessorID(req, res, next) {
//   try {
//     const listMahasiswa = await getStudentsByProfessorID(req.params.id);
//     res.json(listMahasiswa);
//   } catch (error) {
//     next(error);
//   }
// }

// module.exports = {
//   changeProfessorProfile,
//   fetchProfessorByID,
//   fetchProfessorsUsername,
//   fetchProfessorsNIP,
//   changeProfessorPassword,
//   fetchStudentsByProfessorID
// };

export async function getProfessorsController(request, response) {
  const connection = await pool.getConnection();
  const professorService = new Professor(connection);
  const {study} = request.query;

  if (study) {
    const professors = await professorService.getProfessorByStudy({study});
    const genderService = new Gender(connection);
    const professorGender = await genderService.getAllGenders();
    const studyService = new Study(connection);
    const professorStudy = await studyService.getAllStudies();
    connection.release();

    const professorsData = [];
    for (let idx = 0; idx < professors.length; idx++) {
      const professorAvatar = await cloudinary.api.resource(
        professors[idx].avatar
      );
      professorsData.push({
        id: professors[idx].id,
        nidn: professors[idx].nidn,
        fullname: professors[idx].fullname,
        email: professors[idx].email,
        address: professors[idx].address,
        avatar: professorAvatar.secure_url,
        gender: professorGender.find(
          ({id}) => id === professors[idx].gender_id
        ),
        study: professorStudy.find(({id}) => id === professors[idx].study_id),
        is_verified: professors[idx].is_verified,
        role: professors[idx].role,
        created_at: professors[idx].created_at
      });
    }

    return response.json(professorsData);
  }
}

export function ok() {}
