const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();
app.use(express.json());

// Data storage file path
const dataFilePath = "./data.json";

// Function to read data from the data storage file
function readData() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
}

// Function to write data to the data storage file
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing data:", error);
  }
}

// GET request to retrieve all users
app.get("/users", (req, res) => {
  const data = readData();
  res.json({
    message: "Users retrieved",
    success: true,
    users: data,
  });
});

// PUT request to update user details
app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const { email, firstName } = req.body;

  const data = readData();

  // Find the index of the user in the array
  const userIndex = data.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    res.status(404).json({ success: false, message: "User not found" });
  } else {
    // Update user details
    data[userIndex].email = email || data[userIndex].email;
    data[userIndex].firstName = firstName || data[userIndex].firstName;

    // Save the updated data
    writeData(data);

    res.json({ success: true, message: "User updated" });
  }
});
// POST request to add a new user
app.post("/add", (req, res) => {
  const { email, firstName } = req.body;

  const data = readData();

  // Generate a new ID
  const id = uuidv4();

  // Create a new user object
  const newUser = {
    email: email,
    firstName: firstName,
    id: id,
  };

  // Add the new user to the data array
  data.push(newUser);

  writeData(data);

  res.json({ success: true, message: "User added" });
});

// GET request to retrieve a single user by ID
app.get("/user/:id", (req, res) => {
  const id = req.params.id;

  const data = readData();

  // Find the user by ID
  const user = data.find((user) => user.id === id);

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
  } else {
    res.json({ success: true, user: user });
  }
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
