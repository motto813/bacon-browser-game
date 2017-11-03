const express = require("express");
const path = require("path");

// File created as shown in this video:
// https://www.youtube.com/watch?v=Ru3Rj_hM8bo

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(port);
console.log("Server started");
