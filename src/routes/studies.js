import {Router} from "express";

import {getStudiesController} from "../controllers/studies";

const router = Router();
router.get("/", getStudiesController);

export default router;
