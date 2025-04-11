/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";

function App() {
	const [AllUsers, setAllUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		userName: "",
		fullName: "",
		email: "",
		role: "",
	});
	const [editUserId, setEditUserId] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	const getAllUsers = async () => {
		setIsLoading(true);
		const res = await fetch("/users");
		if (res.ok) {
			const data = await res.json();
			setAllUsers(data.users);
			setError(null);
			toast.success("Fetched all users");
		} else {
			const data = await res.json();
			setError(data.msg);
			setAllUsers([]);
			toast.error(data.msg || "Failed to fetch users");
		}
		setIsLoading(false);
	};

	useEffect(() => {
		getAllUsers();
	}, []);

	const handleAdd = () => {
		setFormData({
			userName: "",
			fullName: "",
			email: "",
			role: "",
		});
		setEditUserId(null);
		setIsModalOpen(true);
	};

	const handleEdit = (user) => {
		setFormData(user);
		setEditUserId(user._id);
		setIsModalOpen(true);
	};

	const createUser = async () => {
		setSubmitting(true);
		const res = await fetch("/users", {
			method: "POST",
			body: JSON.stringify(formData),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			setIsModalOpen(false);
			setFormData({ userName: "", fullName: "", email: "", role: "" });
			setEditUserId(null);
			getAllUsers();
			toast.success("User created");
		} else {
			const data = await res.json();
			setError(data.msg);
			toast.error(data.msg || "Failed to create user");
		}
		setSubmitting(false);
	};

	const updateUser = async () => {
		setSubmitting(true);
		const res = await fetch(`/users/${editUserId}`, {
			method: "PATCH",
			body: JSON.stringify(formData),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			setIsModalOpen(false);
			setFormData({ userName: "", fullName: "", email: "", role: "" });
			setEditUserId(null);
			getAllUsers();
			toast.success("User updated");
		} else {
			const data = await res.json();
			setError(data.msg);
			toast.error(data.msg || "Failed to update user");
		}
		setSubmitting(false);
	};

	const deleteUser = async (id) => {
		const res = await fetch(`/users/${id}`, {
			method: "DELETE",
		});
		if (res.ok) {
			getAllUsers();
			toast.success("User deleted");
		} else {
			const data = await res.json();
			setError(data.msg);
			toast.error(data.msg || "Failed to delete user");
		}
	};

	return (
		<>
			<Toaster position="top-right" />
			{/* UI goes here */}
		</>
	);
}

export default App;
