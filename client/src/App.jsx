/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
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
		setIsLoading(true); // show a loading indicator before fetching
		const res = await fetch("/users");
		if (res.ok) {
			const data = await res.json();
			setAllUsers(data.users);
			setError(null);
		} else {
			setError(await res.json().msg);
			setAllUsers([]); // to prevent keeping the old data,
		}
		setIsLoading(false);
	};

	useEffect(() => {
		getAllUsers();
	}, []);

	const handleAdd = async () => {
		setFormData({
			userName: "",
			fullName: "",
			email: "",
			role: "",
		});
		setEditUserId(null);
		setIsModalOpen(true);
		getAllUsers();
	};

	return <> </>;
}

export default App;
