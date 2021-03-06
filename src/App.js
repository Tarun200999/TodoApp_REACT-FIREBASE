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
  const [luser, setUser] = useState();
  const [darkmode, setDarkmode] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const fetchData = (user) => {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((Newuser) => {
        if (Newuser.exists === false) {
          db.collection("users").doc(user.uid).set(
            {
              name: user.displayName,
              darkmode: false,
              todos: {},
            },
            { merge: true }
          );
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
            });
          setDarkmode(false);
        } else {
          db.collection("users")
            .doc(user.uid)
            .collection("todos")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
              setTodos(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  todo: doc.data().todo,
                  checked: doc.data().checked,
                }))
              );
            });
          db.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => setDarkmode(snapshot.data().darkmode));
        }
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchData(user);
        dispatch({
          type: actionTypes.SET_USER,
          user: user,
        });
      } else {
        setUser(null);
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        });
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, [initializing]);
  const handleDarkmode = () => {
    db.collection("users").doc(user.uid).set(
      {
        darkmode: !darkmode,
      },
      { merge: true }
    );
    setDarkmode(!darkmode);
  };
  const addTodo = (event) => {
    event.preventDefault();
    if (input.length === 0) alert("Type Something");
    else {
      db.collection("users").doc(user.uid).collection("todos").add({
        todo: input,
        checked: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // i am taking the server timestamp not the local machine timestamp
      });
    }
    setInput("");
  };
  const signOut = (e) => {
    e.preventDefault();
    auth
      .signOut()
      .then(() => {
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        });
      })
      .catch((er) => console.log(er));
  };
  return (
    <div>
      {!luser ? (
        <Login />
      ) : (
        <div className={darkmode ? "main_dark" : "main"}>
          <div className="container">
            <div className="row">
              <div className="col-md-4 app_name">
                <div className={darkmode ? "user_info_darkmode" : "user_info"}>
                  <img src={luser.photoURL} />
                  <h3>Welcome {luser.displayName}</h3>

                  <button onClick={signOut} className="btn btn-primary">
                    SignOut
                  </button>
                </div>
              </div>
              <div className="col-md-8 form_input">
                <form>
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Type & Hit Enter"
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
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    value={darkmode}
                    className="custom-control-input"
                    id="customSwitch1"
                    onClick={handleDarkmode}
                  ></input>
                  <label className="custom-control-label" for="customSwitch1">
                    <h6
                      className={
                        darkmode ? "darkmode_switch" : "darkmode_switch_black"
                      }
                    >
                      {darkmode ? "Dark" : "Light"} Mode
                    </h6>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="todo_show">
            {todos.length == 0 ? (
              <h3 className="no_todo">NO TODOS</h3>
            ) : (
              <ul>
                {todos.map((todo) => (
                  <Todo key={todo.id} text={todo} dark={darkmode} />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
