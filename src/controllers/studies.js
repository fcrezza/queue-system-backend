import {pool} from "../services/main";
import Study from "../services/study";

export async function getStudiesController(request, response) {
  const connection = await pool.getConnection();
  const studyService = new Study(connection);
  const studies = await studyService.getAllStudies();
  connection.release();
  response.json(studies);
}

export function ok() {}
