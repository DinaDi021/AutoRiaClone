module.exports = {
  async up(db, client) {
    await db
      .collection("users")
      .updateMany({}, { $set: { userType: "personal" } });
  },

  async down(db, client) {
    await db.collection("users").updateMany({}, { $unset: { userType: "" } });
  },
};
