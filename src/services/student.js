class Student {
  constructor(connection) {
    this.connection = connection;
  }

  async getAllStudents() {
    const statement = "select * from students";
    const [result] = await this.connection.query(statement);
    return result;
  }

  async getStudentById(data) {
    const statement = "select * from students where id = ?";
    const [[result]] = await this.connection.execute(statement, [data.id]);
    return result;
  }

  async getStudentByEmail(data) {
    const statement = "select * from students where email = ?";
    const [[result]] = await this.connection.execute(statement, [data.email]);
    console.log(result);
    return result;
  }

  async getStudentByNIM(data) {
    const statement = "select * from students where nim = ?";
    const [[result]] = await this.connection.execute(statement, [data.nim]);
    return result;
  }

  async insertStudent(data) {
    const statement =
      "insert into students (nim, fullname, email, password, study_id, semester, address, gender_id, professor_id, avatar) values (?, ?, ? ,? ,? ,?, ?, ?, ?, ?)";
    const result = await this.connection.execute(statement, [
      data.nim,
      data.fullname,
      data.email,
      data.password,
      data.study,
      data.semester,
      data.address,
      data.gender,
      data.professor,
      data.avatar
    ]);
    return result;
  }
}

export default Student;
