import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    port: 5432,
    password: process.env.POSTGRES_PASSWORD,
  });

  await client.connect();

  const result = await client.query(queryObject);
  await client.end();

  return result;
}

export default {
  query: query,
};
