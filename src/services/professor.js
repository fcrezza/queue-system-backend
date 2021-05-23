class Professor {
  constructor(connection) {
    this.connection = connection;
  }

  async getProfessorById(data) {
    const statement = "select * from professors where id = ?";
    const [[result]] = await this.connection.execute(statement, [data.id]);
    return result;
  }

  async getProfessorByEmail(data) {
    const statement = "select * from professors where email = ?";
    const [[result]] = await this.connection.execute(statement, [data.email]);
    return result;
  }

  async getProfessorByNIDN(data) {
    const statement = "select * from professors where nidn = ?";
    const [[result]] = await this.connection.execute(statement, [data.nidn]);
    return result;
  }

  async getProfessorByStudy(data) {
    const statement = "select * from professors where study_id = ?";
    const [result] = await this.connection.execute(statement, [data.study]);
    return result;
  }

  async insertProfessor(data) {
    const statement =
      "insert into professors (nidn, fullname, email, password, study_id, address, gender_id, avatar) values (?, ?, ? ,? ,? ,?, ?, ?)";
    const result = await this.connection.execute(statement, [
      data.nidn,
      data.fullname,
      data.email,
      data.password,
      data.study,
      data.address,
      data.gender,
      data.avatar
    ]);
    return result;
  }
}

export default Professor;
