// -----------------------------
// Student Management System
// Using Node.js, Express & MongoDB (Mongoose)
// -----------------------------

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/studentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Database connection error:", err));

// -----------------------------
// MODEL (M in MVC)
// -----------------------------
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 5 },
  course: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

// -----------------------------
// CONTROLLER (C in MVC)
// -----------------------------

// 🟢 Create Student
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: "Student added successfully!", student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔵 Read All Students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟠 Update Student by ID
app.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent)
      return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student updated successfully!", updatedStudent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔴 Delete Student by ID
app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent)
      return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// SERVER START
// -----------------------------
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
