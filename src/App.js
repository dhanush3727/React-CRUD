import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });
  const getAllData = async () => {
    await axios.get("http://localhost:8000/data").then((result) => {
      setData(result.data);
      setFilterData(result.data);
    });
  };
  useEffect(() => {
    getAllData();
  }, []);

  // Search data
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredData = data.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterData(filteredData);
  };

  // Delete data
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want delete this data"
    );
    if (isConfirmed) {
      await axios.delete(`http://localhost:8000/data/${id}`).then((result) => {
        setData(result.data);
        setFilterData(result.data);
      });
    }
  };

  // Add data
  const handleAddData = () => {
    setUserData({ name: "", age: "", city: "" });
    setModalOpen(true);
  };
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    if (userData.id) {
      await axios
        .patch(`http://localhost:8000/data/${userData.id}`, userData)
        .then((res) => {
          console.log(res);
        });
    } else {
      await axios
        .post("http://localhost:8000/data", userData)
        .then((res) => console.log(res));
    }
    getAllData();
    setModalOpen(false);
    setUserData({ name: "", age: "", city: "" });
  };

  // Edit data
  const handleEdit = (user) => {
    setUserData(user);
    setModalOpen(true);
  };

  return (
    <div className="container">
      <h3>CRUD Application</h3>
      <div className="input-search">
        <input
          type="search"
          placeholder="Search text here"
          onChange={handleSearch}
        />
        <button className="btn green" onClick={handleAddData}>
          Add Record
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>S. No</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filterData &&
            filterData.map((user, index) => {
              return (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td>
                    <button
                      className="btn green"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn red"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>
              &times;
            </span>
            <h2>{userData.id ? "Update Record" : "Add Record"}</h2>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={userData.name}
                onChange={handleData}
              />
            </div>
            <div className="input-group">
              <label htmlFor="number">Age</label>
              <input
                type="number"
                name="age"
                id="age"
                value={userData.age}
                onChange={handleData}
              />
            </div>
            <div className="input-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                id="city"
                value={userData.city}
                onChange={handleData}
              />
            </div>
            <button className="btn green" onClick={handleSubmit}>
              {userData.id ? "Update User" : "Add User"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
