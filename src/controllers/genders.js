import Gender from "../services/gender";
import {pool} from "../services/main";

export async function getGendersController(request, response) {
  const connection = await pool.getConnection();
  const genderService = new Gender(connection);
  const genders = await genderService.getAllGenders();
  connection.release();
  response.json(genders);
}

export function ok() {}
