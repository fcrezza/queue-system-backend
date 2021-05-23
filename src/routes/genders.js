import {Router} from "express";

import {getGendersController} from "../controllers/genders";

const router = Router();
router.get("/", getGendersController);

export default router;
