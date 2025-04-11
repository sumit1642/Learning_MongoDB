import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
	.connect("mongodb://127.0.0.1:27017/userDatabase")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log("Error connecting to MongoDB", err));

// Schema and model
const userSchema = new mongoose.Schema({
	userName: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	fullName: { type: String, unique: true },
	role: { type: String, required: true },
});

const UserModel = mongoose.model("UserModel", userSchema);

// Routes

// GET all users
app.get("/users", async (req, res) => {
	const allUsers = await UserModel.find();
	if (allUsers.length === 0) {
		return res.status(400).json({ msg: "No users exist. Try adding one." });
	}
	console.log("Fetched all users");
	res.status(200).json({ users: allUsers });
});

// POST create new user
app.post("/users", async (req, res) => {
	try {
		const { userName, fullName, email, role } = req.body;
		const newUser = await UserModel.create({
			userName,
			fullName,
			email,
			role,
		});
		console.log("Created user", newUser);
		res.status(201).json({ msg: "User created", user: newUser });
	} catch (error) {
		if (error.code === 11000) {
			const field = Object.keys(error.keyPattern)[0];
			const value = error.keyValue[field];
			return res
				.status(409)
				.json({ msg: `${field} \"${value}\" already exists` });
		}
		console.error("Unexpected error:", error);
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

// PATCH update user
app.patch("users/:id", async (req, res) => {
	const { id } = req.params;
	const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
		new: true,
	});

	if (!updatedUser) {
		return res.status(404).json({ msg: "User not found with that ID" });
	}

	res.status(200).json({ msg: "User updated", user: updatedUser });
});

// DELETE user
app.delete("/users/:id", async (req, res) => {
	const { id } = req.params;
	const deletedUser = await UserModel.findByIdAndDelete(id);

	if (!deletedUser) {
		return res.status(400).json({ msg: "No user exists with that ID" });
	}

	res.status(200).json({ msg: "User deleted" });
});

app.listen(8000, () => console.log("Server is running on port 8000"));
