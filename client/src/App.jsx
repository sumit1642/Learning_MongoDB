/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import "./App.css";

function App() {
	const [allUsers, setAllUsers] = useState([]);
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
		try {
			const res = await fetch("/users");
			const data = await res.json();

			if (res.ok) {
				setAllUsers(data.users);
				setError(null);
				toast.success("Fetched all users");
			} else {
				setError(data.msg);
				// If the error is a 404 (no users found), set empty array but don't show error toast
				if (res.status === 404) {
					setAllUsers([]);
				} else {
					setAllUsers([]);
					toast.error(data.msg || "Failed to fetch users");
				}
			}
		} catch (err) {
			setError("Network error");
			setAllUsers([]);
			toast.error("Network error");
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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const createUser = async () => {
		setSubmitting(true);
		try {
			const res = await fetch("/users", {
				method: "POST",
				body: JSON.stringify(formData),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (res.ok) {
				setIsModalOpen(false);
				setFormData({ userName: "", fullName: "", email: "", role: "" });
				setEditUserId(null);
				getAllUsers();
				toast.success("User created");
			} else {
				setError(data.msg);
				toast.error(data.msg || "Failed to create user");
			}
		} catch (err) {
			setError("Network error");
			toast.error("Network error");
		}
		setSubmitting(false);
	};

	const updateUser = async () => {
		setSubmitting(true);
		try {
			const res = await fetch(`/users/${editUserId}`, {
				method: "PATCH",
				body: JSON.stringify(formData),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (res.ok) {
				setIsModalOpen(false);
				setFormData({ userName: "", fullName: "", email: "", role: "" });
				setEditUserId(null);
				getAllUsers();
				toast.success("User updated");
			} else {
				setError(data.msg);
				toast.error(data.msg || "Failed to update user");
			}
		} catch (err) {
			setError("Network error");
			toast.error("Network error");
		}
		setSubmitting(false);
	};

	const deleteUser = async (id) => {
		try {
			const res = await fetch(`/users/${id}`, {
				method: "DELETE",
			});
			const data = await res.json();

			if (res.ok) {
				getAllUsers();
				toast.success("User deleted");
			} else {
				setError(data.msg);
				toast.error(data.msg || "Failed to delete user");
			}
		} catch (err) {
			setError("Network error");
			toast.error("Network error");
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (editUserId) {
			updateUser();
		} else {
			createUser();
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<Toaster position="top-right" />

			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800">
						User Management
					</h1>
					<button
						onClick={handleAdd}
						className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
						<Plus size={18} />
						Add User
					</button>
				</div>

				{error && error !== "No users exist. Try adding one." && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
						{error}
					</div>
				)}

				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
					</div>
				) : allUsers.length === 0 ? (
					<div className="bg-white rounded-lg shadow p-6 text-center">
						<p className="text-gray-500">
							No users found. Add one to get started.
						</p>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow overflow-hidden">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Username
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Full Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Email
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Role
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{allUsers.map((user) => (
									<tr
										key={user._id}
										className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											{user.userName}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{user.fullName || "-"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{user.email}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
												{user.role}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => handleEdit(user)}
													className="p-1 text-blue-600 hover:text-blue-800">
													<Pencil size={18} />
												</button>
												<button
													onClick={() => deleteUser(user._id)}
													className="p-1 text-red-600 hover:text-red-800">
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-lg max-w-md w-full">
						<div className="flex justify-between items-center border-b p-4">
							<h2 className="text-xl font-semibold text-gray-800">
								{editUserId ? "Edit User" : "Add New User"}
							</h2>
							<button
								onClick={() => setIsModalOpen(false)}
								className="text-gray-500 hover:text-gray-700">
								<X size={20} />
							</button>
						</div>
						<form
							onSubmit={handleSubmit}
							className="p-4">
							<div className="mb-4">
								<label
									className="block text-gray-700 text-sm font-medium mb-2"
									htmlFor="userName">
									Username
								</label>
								<input
									type="text"
									id="userName"
									name="userName"
									value={formData.userName}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>
							<div className="mb-4">
								<label
									className="block text-gray-700 text-sm font-medium mb-2"
									htmlFor="fullName">
									Full Name
								</label>
								<input
									type="text"
									id="fullName"
									name="fullName"
									value={formData.fullName}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div className="mb-4">
								<label
									className="block text-gray-700 text-sm font-medium mb-2"
									htmlFor="email">
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>
							<div className="mb-6">
								<label
									className="block text-gray-700 text-sm font-medium mb-2"
									htmlFor="role">
									Role
								</label>
								<select
									id="role"
									name="role"
									value={formData.role}
									onChange={handleInputChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required>
									<option value="">Select a role</option>
									<option value="Admin">Admin</option>
									<option value="User">User</option>
									<option value="Manager">Manager</option>
									<option value="Developer">Developer</option>
								</select>
							</div>
							<div className="flex justify-end gap-2">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
									Cancel
								</button>
								<button
									type="submit"
									disabled={submitting}
									className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50">
									{submitting
										? "Processing..."
										: editUserId
										? "Update"
										: "Create"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
