import { Client } from "pg";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
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

async function getNewClient() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

export default {
  query,
  getDatabaseStatus,
  getNewClient,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}
