class Study {
  constructor(connection) {
    this.connection = connection;
  }

  async getAllStudies() {
    const statement = "select * from studies";
    const [result] = await this.connection.query(statement);
    return result;
  }

  async getStudyById(data) {
    const statement = "select * from studies where id = ?";
    const [[result]] = await this.connection.execute(statement, [data.id]);
    return result;
  }
}

export default Study;
