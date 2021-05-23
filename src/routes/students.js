import {Router} from "express";
import {
  // changeStudentProfile,
  // changeStudentPassword,
  // fetchStudentsByID,
  // fetchStudentsUsername,
  // fetchStudentsNIM,
  getStudents
} from "../controllers/students";

const router = Router();
router.get("/", getStudents);
// router.get("/students/:id", fetchStudentsByID);
// router.post("/students/:id", changeStudentProfile);
// router.get("/students/username/:username", fetchStudentsUsername);
// router.get("/students/nim/:nim", fetchStudentsNIM);
// router.post("/students/:id/password", changeStudentPassword);

export default router;
