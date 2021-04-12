import mysql from "mysql2/promise";

export const pool = mysql.createPool(getConfig());

export function getConfig() {
  if (process.env.NODE_ENV === "production") {
    return {
      host: process.env.MYSQL_ADDON_HOST,
      user: process.env.MYSQL_ADDON_USER,
      password: process.env.MYSQL_ADDON_PASSWORD,
      database: process.env.MYSQL_ADDON_DB
    };
  }

  return {
    host: process.env.MYSQL_LOCAL_HOST,
    user: process.env.MYSQL_LOCAL_USER,
    password: process.env.MYSQL_LOCAL_PASSWORD,
    database: process.env.MYSQL_LOCAL_DB
  };
}

export function query(statement, values, callback) {
  pool.getConnection((err, conn) => {
    if (err) {
      callback(err, null);
    } else {
      conn.query(statement, values, (error, results) => {
        conn.release();
        callback(error, results);
      });
    }
  });
}
