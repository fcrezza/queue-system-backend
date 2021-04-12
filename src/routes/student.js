const router = require("express").Router();
const {
  changeStudentProfile,
  changeStudentPassword,
  fetchStudentsByID,
  fetchStudentsUsername,
  fetchStudentsNIM
} = require("../controller/student");

router.get("/students/:id", fetchStudentsByID);
router.post("/students/:id", changeStudentProfile);
router.get("/students/username/:username", fetchStudentsUsername);
router.get("/students/nim/:nim", fetchStudentsNIM);
router.post("/students/:id/password", changeStudentPassword);

module.exports = router;
