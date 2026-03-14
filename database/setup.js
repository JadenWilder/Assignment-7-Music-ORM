const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_STORAGE || "./database/music_library.db",
  logging: false,
});

const Track = sequelize.define(
  "Track",
  {
    trackId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    songTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artistName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    albumName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tracks",
    timestamps: false,
  }
);

async function setupDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful.");

    await sequelize.sync({ force: false });
    console.log("Database and tables created successfully.");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { sequelize, Track };