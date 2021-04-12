import {Router} from "express";
import {
  signup,
  login,
  logout,
  fetchFaculties,
  fetchGenders,
  fetchStudyPrograms,
  fetchUser,
  fetchProfessorsByStudyProgram
} from "../controller/common";

const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/genders", fetchGenders);
router.get("/faculties", fetchFaculties);
router.get("/user", fetchUser);
router.get("/studyPrograms", fetchStudyPrograms);
router.get("/studyPrograms/:id/professors", fetchProfessorsByStudyProgram);

export default router;
