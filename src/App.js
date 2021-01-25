import React, { useState, useEffect } from "react";
//import { Button , FormControl , InputLabel,Input} from '@material-ui/core';
import "./App.css";
import Todo from "./Todo";
import db from "./firebase";
import firebase from "firebase";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  //when app loads we neeed to featch the data from the cloud firestore and then store it out local state variabe todo
  useEffect(() => {
    //this code will run whenever the app loads or whenever the dependencies changes
    db.collection("todos")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //console.log(snapshot.docs.map(doc=>doc.data()));
        setTodos(
          snapshot.docs.map((doc) => ({ id: doc.id, todo: doc.data().todo }))
        );
        // console.log(todos);
      });
  }, []);
  const addTodo = (event) => {
    //function will call when u click the button addtodo it will take the (input) variable
    //and then append it to todos array which is render below
    event.preventDefault();
    if (input.length === 0) alert("Type Something");
    else {
      db.collection("todos").add({
        todo: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // i am taking the server timestamp not the local machine timestamp
      }); // we are adding out new todo to database
      //  setTodos([...todos,input]);
      // NO need to do this because out input is now dieactly adding to database and then
      // refeched above and displayed again
    }
    setInput("");
  };
  return (
    <div className="main">
      <div className="container">
        <div className="row">
          <div className="col-md-4 app_name">
            <h1>To-Do</h1>
          </div>
          <div className="col-md-8 form_input">
            <form>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Press Enter to Add Task"
              />
              <button
                disabled={!input}
                type="submit"
                onClick={addTodo}
                variant="contained"
                color="primary"
                className="btn btn-success"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
      <div>
        <ul>
          {todos.map((todo) => (
            <Todo text={todo} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
