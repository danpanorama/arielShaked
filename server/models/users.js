
 const pool = require("./mysql2");

const checkIfEmailExists = (email) => {
    return pool.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
  };
  const getAllUsers = () => {
    return pool.execute(
      `SELECT * FROM users `,
      []
    );
  };


  const updateUserPermission = (permission, id) => {
    return pool.execute(
      `UPDATE users SET permissions = ? WHERE id = ?`,
      [permission, id]
    );
  };


    const activate = (is_active,id ) => {
    return pool.execute(
      `UPDATE users SET is_active = ? WHERE id = ?`,
      [is_active,id ]
    );
  };
  
  const checkIfEmailAndPasswordMatch = (email, password) => {
    return pool.execute(
      `SELECT * FROM users WHERE email = ? AND password = ?`,
      [email, password]
    );
  };


  const removeUser = (id) => {
    return pool.execute(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );
  };
  
  const insertNewUser = (name, email, password, phone,permissions,is_active) => {
    return pool.execute(
      `INSERT INTO users (name, email, password, phone,permissions,is_active) 
       VALUES (?, ?, ?, ?,?,?)`,
      [name, email, password, phone,permissions,is_active]
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
module.exports.getAllUsers = getAllUsers
module.exports.updateUserPermission = updateUserPermission
module.exports.removeUser = removeUser
module.exports.activate = activate




