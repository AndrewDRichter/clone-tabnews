import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseStatus = await database.getDatabaseStatus();

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseStatus.dbVersion,
        max_connections: databaseStatus.dbMaxConn,
        used_connections: databaseStatus.dbUsedConn,
      },
    },
  });
}

export default status;
