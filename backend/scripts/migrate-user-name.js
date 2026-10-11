const path = require("path");
const dns = require("dns");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

dns.setServers(dnsServers);

async function migrateUserName() {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not configured");
  }

  await mongoose.connect(process.env.MONGODB_URL);
  const users = mongoose.connection.collection("users");

  const result = await users.updateMany(
    {
      name: { $exists: false },
      username: { $type: "string" },
    },
    [{ $set: { name: "$username" } }],
  );

  const indexes = await users.indexes();
  const usernameIndexes = indexes.filter((index) => index.key.username === 1);

  for (const index of usernameIndexes) {
    await users.dropIndex(index.name);
  }

  console.log(`Migrated ${result.modifiedCount} legacy user name(s).`);
  if (usernameIndexes.length > 0) {
    console.log("Removed legacy username index(es).");
  }
}

migrateUserName()
  .catch((error) => {
    console.error("User name migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
