//dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");

//port
const PORT = process.env.PORT || 3002;

//initiate the server
const app = express();

// analyze incoming string or array data
app.use(express.urlencoded({ extended: true }));

// analyze incoming JSON data
app.use(express.json());
app.use(express.static('public'));

//GET REQUESTS

//returns index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

//returns notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/notes.html"));
});

//returns db.json file-- where all notes will be saved
app.get("/api/notes", (req, res) => {
  let results = notes;
  res.json(results);
});

//POST REQUEST:

//new notes to save on the request body, and add them to the json file, and then return a new note to the client
app.post("/api/notes", (req, res) => {
  req.body.id = notes.length.toString();
  const newNote = req.body
  notes.push(newNote);
  res.json(newNote);
});

//GET * REQUEST

//returns index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});


//To delete a note, it reads all the notes from the db.json file, removes the note with the given id property and rewrite the note to the db.json file
app.delete("/api/notes/:id", (req,res) => {
    const deleteNote = notes.findIndex((note) => note.id === req.params.id);
    notes.splice(deleteNote, 1);
    //use fs module to update array after deleted
    fs.writeFileSync("./data/db.json", JSON.stringify(notes, null, 2), function(err){
      if (err) throw err;
    })
    res.json("Note deleted!")
});

//server listening
app.listen(PORT, () => {
  if (PORT === process.env.PORT) {
    console.log(`App listening on http://localhost:${PORT}`);
  } else {
    console.log(`App listening on port ${PORT}`);
  }
});