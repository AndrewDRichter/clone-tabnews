import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  await client.connect();

  try {
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  } finally {
    await client.end();
  }
}

async function getDatabaseStatus() {
  const dbVersionQuery = await query("SHOW server_version;");
  const dbVersion = dbVersionQuery.rows[0].server_version;

  const dbMaxConnectionsQuery = await query("SHOW max_connections;");
  const dbMaxConn = parseInt(dbMaxConnectionsQuery.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const dbUsedConnectionsQuery = await query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const dbUsedConn = dbUsedConnectionsQuery.rows[0].count;

  return {
    dbVersion: dbVersion,
    dbMaxConn: dbMaxConn,
    dbUsedConn: dbUsedConn,
  };
}

export default {
  query: query,
  getDatabaseStatus: getDatabaseStatus,
};
