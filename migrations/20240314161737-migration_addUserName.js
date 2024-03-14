module.exports = {
  async up(db, client) {
    await db
      .collection("users")
      .updateMany(
        {},
        { $set: { userName: { $concat: ["$firstName", " ", "$lastName"] } } },
      );
  },

  async down(db, client) {
    await db.collection("users").updateMany({}, { $unset: { userName: "" } });
  },
};
