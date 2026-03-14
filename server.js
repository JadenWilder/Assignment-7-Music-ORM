const express = require("express");
require("dotenv").config();
const { sequelize, Track } = require("./database/setup");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/tracks", async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.status(200).json(tracks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tracks." });
  }
});

app.get("/api/tracks/:id", async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);

    if (!track) {
      return res.status(404).json({ error: "Track not found." });
    }

    res.status(200).json(track);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch track." });
  }
});

app.post("/api/tracks", async (req, res) => {
  try {
    const {
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear,
    } = req.body;

    if (
      !songTitle ||
      !artistName ||
      !albumName ||
      !genre ||
      duration === undefined ||
      releaseYear === undefined
    ) {
      return res.status(400).json({
        error:
          "songTitle, artistName, albumName, genre, duration, and releaseYear are required.",
      });
    }

    const newTrack = await Track.create({
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear,
    });

    res.status(201).json(newTrack);
  } catch (error) {
    res.status(500).json({ error: "Failed to create track." });
  }
});

app.put("/api/tracks/:id", async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);

    if (!track) {
      return res.status(404).json({ error: "Track not found." });
    }

    const {
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear,
    } = req.body;

    await track.update({
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear,
    });

    res.status(200).json(track);
  } catch (error) {
    res.status(500).json({ error: "Failed to update track." });
  }
});

app.delete("/api/tracks/:id", async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);

    if (!track) {
      return res.status(404).json({ error: "Track not found." });
    }

    await track.destroy();
    res.status(200).json({ message: "Track deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete track." });
  }
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
}

startServer();