import React, { useState, useEffect } from "react";
import "./App.css";
import Todo from "./Todo";
import db from "./firebase";
import firebase from "firebase";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";
import { actionTypes } from "./reducer";
function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [{ user }, dispatch] = useStateValue();
  //when app loads we neeed to fetch the data from the cloud firestore and then store it out local state variabe todo
  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((Newuser) => {
          if (Newuser.exists == false) {
            console.log("users not exist");
            db.collection("users").doc(user.uid).set(
              {
                name: user.displayName,
                todos: {},
              },
              { merge: true }
            );
          } else {
            console.log("user exists");
            db.collection("users")
              .doc(user.uid)
              .collection("todos")
              .orderBy("timestamp", "desc")
              .onSnapshot((snapshot) => {
                setTodos(
                  snapshot.docs.map((doc) => ({
                    id: doc.id,
                    todo: doc.data().todo,
                  }))
                );
                // console.log(todos);
              });
          }
        });
    }
  }, [user]);
  const addTodo = (event) => {
    //function will call when u click the button addtodo it will take the (input) variable
    //and then append it to todos array which is render below
    event.preventDefault();
    if (input.length === 0) alert("Type Something");
    else {
      db.collection("users").doc(user.uid).collection("todos").add({
        todo: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // i am taking the server timestamp not the local machine timestamp
      }); // we are adding out new todo to database
      //  setTodos([...todos,input]);
      // NO need to do this because our input is now direactly adding to database and then
      // refeched above and displayed again
    }
    setInput("");
  };
  const signOut = (e) => {
    e.preventDefault();
    dispatch({
      type: actionTypes.SET_USER,
      user: null,
    });
    auth
      .signOut()
      .then(() => console.log("sign out "))
      .catch((er) => console.log(er));
  };
  return (
    <div>
      {!user ? (
        <Login />
      ) : (
        <div className="main">
          <div className="container">
            <div className="row">
              <div className="col-md-4 app_name">
                <img src={user.photoURL} />
                <h1>Welcome {user.displayName}..</h1>
                <h1>To-Do</h1>
                <button onClick={signOut} className="btn btn-primary">
                  Sign Out
                </button>
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
      )}
    </div>
  );
}

export default App;
