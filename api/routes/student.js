const express = require("express");
const router = express.Router();
const student = require("../model/student");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");
const cloueinary = require("cloudinary");

  cloueinary.config({ 
        cloud_name: 'da45n9rve', 
        api_key: '268466199867369', 
        api_secret: '8jGD61F4gJbHpS27mu9yy-IQRC0'
    });

// GET all students
router.get("/", checkAuth,(req, res) => {
  student
    .find()
    .then((students) => {
      res.status(200).json({
        message: "Students fetched successfully",
        students: students.map((stu) => ({
          _id: stu._id,
          name: stu.name,
          gender: stu.gender,
          email: stu.email,
          phone: stu.phone,
        })),
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

// GET a single student by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  student
    .findById(id)
    .then((student) => {
      if (student) {
        res.status(200).json({
          message: "Student found",
          student: student,
        });
      } else {
        res.status(404).json({ error: "Student not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

// POST a new student
router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const file = req.files.image;

    const result = await cloudinary.uploader.upload(file.tempFilePath);

    const newStudent = new student({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: result.secure_url,
    });

    const savedStudent = await newStudent.save();

    res.status(201).json({
      message: "Student created successfully",
      student: savedStudent,
    });
  } catch (err) {
    console.error("Upload or save failed:", err);
    res.status(500).json({ error: err.message });
  }
});



//delete data

router.delete("/:id", (req, res) => {
  student
    .findByIdAndDelete(req.params.id)
    .then((deletedStudent) => {
      if (deletedStudent) {
        res.status(200).json({
          message: "Student deleted successfully",
          student: deletedStudent,
        });
      } else {
        res.status(404).json({ error: "Student not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

// Update student data
router.put("/:id", (req, res, next) => {
  const id = req.params.id;
  student
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          gender: req.body.gender,
          email: req.body.email,
          phone: req.body.phone,
        },
      },
      { new: true }
    )
    .then((updatedStudent) => {
      if (updatedStudent) {
        res.status(200).json({
          message: "Student updated successfully",
          student: updatedStudent,
        });
      } else {
        console.error("Student not found");
        res.status(404).json({ error: "Student not found" });
      }
    });
});

module.exports = router;
