import {Router} from "express";

import {
  authenticatedUserController,
  studentSignupController,
  professorSignupController,
  studentLoginController,
  professorLoginController,
  logoutController,
  studentEmailSignupController,
  studentNIMSignupController,
  professorEmailSignupController,
  professorNIDNSignupController
} from "../controllers/auth";

const router = Router();
router.post("/signup/student", studentSignupController);
router.post("/signup/student/email", studentEmailSignupController);
router.post("/signup/student/nim", studentNIMSignupController);
router.post("/signup/professor", professorSignupController);
router.post("/signup/professor/email", professorEmailSignupController);
router.post("/signup/professor/nidn", professorNIDNSignupController);
router.post("/login/student", studentLoginController);
router.post("/login/professor", professorLoginController);
router.delete("/logout", logoutController);
router.get("/user", authenticatedUserController);

export default router;
