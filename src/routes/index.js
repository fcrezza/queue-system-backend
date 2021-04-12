import {Router} from "express";

// import student from "./student";
// import professor from "./professor";
// import common from "./common";
import auth from "./auth";

const router = Router();
// router.use(student);
// router.use(professor);
// router.use(common);
router.use("/api/auth", auth);

export default router;
