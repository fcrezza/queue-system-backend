import {Router} from "express";

import {
  authenticatedUserController,
  studentSignupController,
  professorSignupController,
  studentLoginController,
  professorLoginController,
  logoutController
} from "../controller/auth";

const router = Router();
router.post("/signup/student", studentSignupController);
router.post("/signup/professor", professorSignupController);
router.post("/login/student", studentLoginController);
router.post("/login/professor", professorLoginController);
router.delete("/logout", logoutController);
router.get("/user", authenticatedUserController);

export default router;
