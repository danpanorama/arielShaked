
 const pool = require("./mysql2");

const checkIfEmailExists = (email) => {
    return pool.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
  };
  
  const checkIfEmailAndPasswordMatch = (email, password) => {
    return pool.execute(
      `SELECT * FROM users WHERE email = ? AND password = ?`,
      [email, password]
    );
  };
  
  const insertNewUser = (username, email, password, role) => {
    return pool.execute(
      `INSERT INTO users (username, email, password, role) 
       VALUES (?, ?, ?, ?)`,
      [username, email, password, role]
    );
  };
  

  const updateUser = (username, email, password, userId) => {
    return pool.execute(
      `UPDATE users 
       SET username = ?, email = ?, password = ? 
       WHERE id = ?`,
      [username, email, password, userId]
    );
  };
  

  const updateUserRole = (role, userId) => {
    return pool.execute(
      `UPDATE users 
       SET role = ? 
       WHERE id = ?`,
      [role, userId]
    );
  };
  

module.exports.checkIfEmailExists = checkIfEmailExists;
module.exports.checkIfEmailAndPasswordMatch = checkIfEmailAndPasswordMatch;
module.exports.insertNewUser = insertNewUser;
module.exports.updateUser = updateUser;
module.exports.updateUserRole = updateUserRole;
