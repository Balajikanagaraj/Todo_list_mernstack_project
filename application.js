const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/todo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const trySchema = new mongoose.Schema({
  name: String
});

const item = mongoose.model("task", trySchema);

app.get("/", function (req, res) {
  item.find({})
    .then(foundItems => {
      res.render("list", { dayej: foundItems });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Error fetching tasks");
    });
});

app.post("/", function (req, res) {
  const newTask = new item({
    name: req.body.ele1
  });

  newTask.save()
    .then(() => res.redirect("/"))
    .catch(err => {
      console.error("Error saving new task:", err);
      res.status(500).send("Error saving task");
    });
});

app.delete("/delete/:id", function (req, res) {
  const taskId = req.params.id;
  item.findByIdAndDelete(taskId)
    .then(deletedTask => {
      if (deletedTask) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      console.error("Error deleting task:", err);
      res.sendStatus(500);
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
