const charValidation = /^[a-zA-Z\s]+$/;
const isbnValidation = /^\d{10}$/;

const express = require("express");
const db = require("./dbConnectivity.js");

const app = express();
const port = 3000;

app.use(express.json());

// Define routes

// Read
app.get("/getbooks", (req, res) => {
  db.query("SELECT * FROM bookinfo", (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Error fetching data from database");
      return;
    }
    res.json(results);
  });
});



//create
app.post("/insertbook", (req, res) => {
  let body = req.body;
  console.log("body", body);

  // Validation for author name
  if (!charValidation.test(body.author)) {
    res.json({ status: false, message: "Invalid author name" });
    return;
  }

  // Validation for ISBN number
  if (!isbnValidation.test(body.isbn)) {
    res.json({
      status: false,
      message: "Invalid ISBN number. It should be a ten-digit number",
    });
    return;
  }

  // Function to validate date format
  const isValidDate = (dateString) => {
    return !isNaN(Date.parse(dateString));
  };

  // Validation for publication date
  if (body.publication_date && !isValidDate(body.publication_date)) {
    res.json({
      status: false,
      message: "Invalid publication date. It should be a valid date format",
    });
    return;
  }

  // If validations pass, proceeding with inserting data in database
  db.query(
    "INSERT INTO bookinfo (`title`, `author`, `isbn`,`publication_date`) VALUES (?, ?, ?,?)",
    [body.title, body.author, body.isbn, body.publication_date],
    (error, result) => {
      if (error) {
        res.json({ status: false, message: error });
        return;
      }
      res.json({ status: true, message: result });
    }
  );
});


//update
app.post("/updatebook", (req, res) => {
  let body = req.body;
  console.log("body", body);

  // Validation for title
  if (!body.title || body.title.trim() === "") {
    res.json({ status: false, message: "Title is required" });
    return;
  }

  // Validation for author name
  if (!body.author || !charValidation.test(body.author)) {
    res.json({ status: false, message: "Invalid author name" });
    return;
  }

  // Validation for ISBN number
  if (!body.isbn || !isbnValidation.test(body.isbn)) {
    res.json({
      status: false,
      message: "Invalid ISBN number. It should be a ten-digit number",
    });
    return;
  }

  // Function to validate date format
  const isValidDate = (dateString) => {
    return !isNaN(Date.parse(dateString));
  };

  // Validation for publication date
  if (body.publication_date && !isValidDate(body.publication_date)) {
    res.json({
      status: false,
      message: "Invalid publication date. It should be a valid date format",
    });
    return;
  }

  // If validations pass, proceeding with inserting data in database
  db.query(
    "UPDATE bookinfo SET title = ?, author = ?, isbn = ?, publication_date = ? WHERE id = ?",
    [body.title, body.author, body.isbn, body.publication_date, body.id],
    (error, result) => {
      if (error) {
        res.json({ status: false, message: error });
        return;
      }
      res.json({ status: true, message: "Book updated successfully" });
    }
  );
});



//Delete
app.post("/deletebook", (req, res) => {
  let body = req.body;
  console.log("body", body);

  db.query("DELETE FROM bookinfo WHERE id=?  ", [body.id], (error, result) => {
    if (error) {
      res.json({ status: false, message: error });
      return;
    }
    res.json({ status: true, message: result });
  });
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Close database connection
process.on("SIGINT", () => {
  db.end();
  console.log("Connection to database closed");
  process.exit();
});
