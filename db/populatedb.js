const { Client } = require("pg");
require("dotenv").config();

// const SQL = `
// CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//     first_name varchar(255),
//     last_name varchar(255),
//     email varchar(255),
//     password varchar(255),
//     member boolean,
//     admin boolean
// );

// INSERT INTO users (first_name, last_name, email, password, member, admin)
// VALUES
//   ('Nick', 'Preziosi', 'nickprez@gmail.com', 'password', 'true', 'true');
// `;

const SQL = `
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar(255),
    message text,
    time TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    author INTEGER REFERENCES users(id)
);

`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
