module.exports = {
  async up(db, client) {
    await db
      .collection("cars")
      .updateMany({}, { $set: { country: "Ukraine" } });
  },
};
