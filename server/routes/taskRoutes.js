const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", auth, getTasks);
router.post("/", auth, addTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;
