class Gender {
  constructor(connection) {
    this.connection = connection;
  }

  async getAllGenders() {
    const statement = "select * from genders";
    const [result] = await this.connection.query(statement);
    return result;
  }

  async getGenderById(data) {
    const statement = "select * from genders where id = ?";
    const [[result]] = await this.connection.execute(statement, [data.id]);
    return result;
  }
}

export default Gender;
