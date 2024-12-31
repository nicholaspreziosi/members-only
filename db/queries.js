const pool = require("./pool");

// User Queries
const findUserByEmail = async (email) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows[0];
};

const findUserById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
};

const createUser = async (user) => {
  const firstName = user.first_name;
  const lastName = user.last_name;
  const email = user.email;
  const password = user.password;
  const member = user.member;
  const admin = user.admin;
  await pool.query(
    "INSERT INTO users (first_name, last_name, email, password, member, admin) VALUES ($1, $2, $3, $4, $5, $6);",
    [firstName, lastName, email, password, member, admin]
  );
  return;
};

const updateUserFirstName = async (firstName, id) => {
  await pool.query("UPDATE users SET first_name = ($1) WHERE id = ($2)", [
    firstName,
    id,
  ]);
  return;
};

const updateUserLastName = async (lastName, id) => {
  await pool.query("UPDATE users SET last_name = ($1) WHERE id = ($2)", [
    lastName,
    id,
  ]);
  return;
};

const updateUserMember = async (isMember, id) => {
  await pool.query("UPDATE users SET member = ($1) WHERE id = ($2)", [
    isMember,
    id,
  ]);
  return;
};

const updateUserAdmin = async (isAdmin, id) => {
  await pool.query("UPDATE users SET admin = ($1) WHERE id = ($2)", [
    isAdmin,
    id,
  ]);
  return;
};

const updateUserPassword = async (hashedPassword, id) => {
  await pool.query("UPDATE users SET password = ($1) WHERE id = ($2)", [
    hashedPassword,
    id,
  ]);
  return;
};

// Post Queries
const getPosts = async () => {
  const { rows } = await pool.query(
    "SELECT users.id, posts.id, posts.title, posts.time, posts.message, first_name, last_name FROM users JOIN posts ON users.id=posts.author ORDER BY time DESC"
  );
  return rows;
};

const createPost = async (post) => {
  const { title, message, author } = post;
  await pool.query(
    "INSERT INTO posts (title, message, author) VALUES ($1, $2, $3);",
    [title, message, author]
  );
  return;
};

const deletePost = async (id) => {
  await pool.query("DELETE FROM posts WHERE id IN ($1);", [id]);
  return;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getPosts,
  createPost,
  deletePost,
  updateUserFirstName,
  updateUserLastName,
  updateUserAdmin,
  updateUserMember,
  updateUserPassword,
};
