import {Router} from "express";

import auth from "./auth";
import students from "./students";
import professors from "./professors";
import genders from "./genders";
import studies from "./studies";

const router = Router();
router.use("/api/auth", auth);
router.use("/api/students", students);
router.use("/api/professors", professors);
router.use("/api/studies", studies);
router.use("/api/genders", genders);

export default router;
