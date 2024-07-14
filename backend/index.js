import express, { json } from "express";
import cors from "cors";
import { connectDB } from "./db/index.js";
import { loginSchema, registerSchema } from "./validation.js";
import User from "./schema/user.schema.js";
import Todo from "./schema/todo.schema.js";

const app = express();
app.use(cors());
app.use(json());

const PORT = process.env.PORT || 8000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`App is running on ${PORT}, also database is connected`);
  });
});

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Health check" });
});

app.post("/register", async (req, res) => {
  try {
    const body = req.body;
    console.log("Registration attempt:", body);

    // Validating before saving in the db
    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
      console.error("Validation error:", parseResult.error.errors);
      return res.status(400).json({
        message: "Invalid input",
        errors: parseResult.error.errors,
      });
    }

    const user = await User.findOne({ email: body.email });
    if (user) {
      console.log("User already exists:", body.email);
      return res.status(409).json({ message: "User already exists" });
    }

    const response = await User.create(body);
    console.log("User created successfully:", response);
    return res.status(201).json(response);
  } catch (error) {
    console.error("Unexpected error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    // Validating before saving in the db
    loginSchema.parse(body);
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(411).json({ message: "Invalid Email, User not found" });
    }
    if (user.password !== body.password) {
      return res.status(403).json({ message: "Invalid password" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(403).json(error);
  }
});

app.post("/update-profile", async (req, res) => {
  const { name, contact, email } = req.body;
  console.log(req.body);
  const response = await User.findOneAndUpdate(
    { email },
    {
      contact,
      name,
    }
  );
  return res.status(200).json(response);
});

app.patch("/change-password", async (req, res) => {
  const { password, confirmPassword, email } = req.body;
  if (!password || !confirmPassword || !email) {
    return res.status(411).json({ message: "All fields are mandatory" });
  }
  if (password !== confirmPassword) {
    return res.status(403).json({ message: "Password is not matched" });
  }
  try {
    await User.findOneAndUpdate({ email }, { password });
    return res.status(201).json({ message: "Password updated" });
  } catch (err) {
    return res.status(401).json(err);
  }
});

app.post("/todo", async (req, res) => {
  const { email, todo, date } = req.body;
  console.log(email, todo, date);
  if (!email) {
    return res.status({ message: "Email is required" });
  }
  try {
    const isUserExists = await User.exists({ email });
    if (!isUserExists) {
      return res.status(401).json({ message: "User is not register" });
    }
    const response = await Todo.create({ email, todo, date });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(403).json(error);
  }
});

app.post("/get-todo", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status({ message: "Email is required" });
  }
  try {
    const isUserExists = await User.exists({ email });
    if (!isUserExists) {
      return res.status(401).json({ message: "User is not register" });
    }
    const response = await Todo.find({ email }).sort({ createdAt: -1 });
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(403).json(err);
  }
});

app.post("/get-user", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status({ message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User is not register" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(403).json(err);
  }
});

app.post("/todo-finish", async (req, res) => {
  const { id } = req.body;
  try {
    const todo = await Todo.findByIdAndUpdate(
      id,
      { isFinish: true },
      { new: true }
    );
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(403).json({ message: "Error occured" });
  }
});
