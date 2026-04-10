test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  const databaseVersion = responseBody.dependencies.database.version;
  expect(databaseVersion).toEqual("16.13");

  const dbMaxConnections = responseBody.dependencies.database.max_connections;
  expect(dbMaxConnections).toEqual(100);

  const dbUsedConnections = responseBody.dependencies.database.used_connections;
  expect(dbUsedConnections).toEqual(1);
});
