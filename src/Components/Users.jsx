import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Spinner from 'react-bootstrap/Spinner';
const Users = () => {
  const [url, setUrl] = useState('http://127.0.0.1:8000/viewsapp/reporter/')
  const [count, setCount] = useState(0)
  const [next , setNext] = useState(null)
  const [prev , setPrev] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateId, setUpdateId] = useState(false);
  const [users, setUsers] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const fetchData = async (url) => {
    try {
      const response = await axios.get(
        url
      );


      setUsers(response.data.results.reverse());
      setCount(response.data.count)
      setNext(response.data.next)
      setPrev(response.data.previous)
      console.log(count,next,prev)
      setIsLoading(false);
      console.log(users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData(url);
  }, []);

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    console.log("Reseting");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newUser = {
        first_name: firstName,
        last_name: lastName,
        email: email,
      };
  
    if (updating){
        try {
            console.log('updating')
            const response = await axios.put(
              `http://127.0.0.1:8000/viewsapp/reporter/${updateId}`,
              newUser
            );
            console.log("User Updated:", response.data);
            fetchData(url);
            // Reset the form after successful submission
            setFirstName("");
            setLastName("");
            setEmail("");
            setUpdating(false)
          } catch (error) {
            console.error("Error adding user:", error);
            alert("BAD REQUEST");
          }
    }
    else {
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/viewsapp/reporter/",
            newUser
          );
          console.log("User added:", response.data);
          fetchData(url);
          // Reset the form after successful submission
          setFirstName("");
          setLastName("");
          setEmail("");
        } catch (error) {
          console.error("Error adding user:", error);
          alert("BAD REQUEST");
        }
    }

  };

  const handleEdit = async (event) => {
    // Fetching data to store in the form
    const userId = event.target.id;

    const first_name = event.target
      .closest(".card-body")
      .querySelector(".first-name").textContent;
    const last_name = event.target
      .closest(".card-body")
      .querySelector(".last-name").textContent;
    const email = event.target
      .closest(".card-body")
      .querySelector(".email").textContent;
    setFirstName(first_name);
    setLastName(last_name);
    setEmail(email);
    setUpdating(true);
    setUpdateId(userId);
   
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email: email,
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/viewsapp/reporter/${updateId}`,
        newUser
      );
      console.log("User Updated:", response.data);
      fetchData(url);
      setUpdating(false);
      setFirstName("");
      setLastName("");
      setEmail("");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("BAD REQUEST");
    }
    return;
  };

  const handleDelete = async (event) => {
    const userId = event.target.id;
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/viewsapp/reporter/${userId}`
      );
      console.log("User deleted");
      fetchData(url);
      // Reset the form after successful submission
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const handleNext = ()=>{

    if(next){
        setUrl(next)
        fetchData(next)
    }
  }
  const handlePrev = ()=>{
    if(prev){
        setUrl(prev)
        fetchData(prev)
    }
  }
  if (isLoading) {
    return (
        <div className="text-center my-5">
            <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
            </Spinner>
    </div>
    )
    

  }

  return (
    <div>
      {" "}
      {/* Form */}
      <Form className="col-lg-8 mx-auto" onSubmit={handleSubmit}>
        <h1 className="text-center">User Form</h1>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Steven"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Smith"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => {
                setEmail(e.target.value)
                console.log(email)
                }}
            required
            placeholder="name@example.com"
          />
        </Form.Group>
        {updating ? (
          <button 
           type="submit"
            className="btn btn-lg btn-primary"
          >
            Update
          </button>
        ) : (
          <button type="submit" className="btn btn-lg btn-success">
            Submit
          </button>
        )}
      </Form>
      <div className="text-center my-3">
        <button
          onClick={handleReset}
          type="button"
          className="btn btn-lg btn-dark mx-auto text-center"
        >
          Reset Vales
        </button>
      </div>
      {/* User Cards */}
      <h1 className="text-center py-2">Reporter List</h1>
      <h4 className="text-center py-2">Total Entries: {count}</h4>
      <h5 className="text-center py-2">On this Page: {users.length}</h5>
      <div className="d-flex text-center col-lg-7 container flex-row-reverse justify-content-between">
          <a className={`btn btn-md ${!next ?  'disabled': "d-block"} btn-primary mx-2`} onClick={handleNext}>Next</a>
          <a className={`btn btn-md ${!prev ?  'disabled': "d-block"} btn-primary mx-2`} onClick={handlePrev}>Previous</a>
      </div>
      <ul className="d-block mx-auto col-lg-8">
        {users.map((user) => (
          <Card key={user.id} className="shadow my-3">
            <Card.Body >
              <Card.Title className="first-name">{user.first_name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted last-name">
                {user.last_name}{" "}
              </Card.Subtitle>
              <Card.Text className="email">{user.email}</Card.Text>
              <Card.Link
                id={user.id}
                className="btn btn-primary"
                onClick={handleEdit}
              >
                Edit
              </Card.Link>
              <Card.Link
                id={user.id}
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </Card.Link>
            </Card.Body>
          </Card>
        ))} 
      </ul>

    </div>
  );
};
export default Users;
