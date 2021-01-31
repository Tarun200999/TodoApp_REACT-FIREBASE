import React, { useState } from "react";
import "./Todo.css";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
//import $ from "jquery";
function Todo(props) {
  const [open, setOpen] = useState(false);
  const [newtodo, setTodo] = useState("");
  const [{ user }, dispatch] = useStateValue();
  return (
    <>
      <div className="todos">
        <div className="todo_item">
          <h1>{props.text.todo}</h1>
          <button
            className="btn btn-outline-success"
            onClick={() => {
              db.collection("users")
                .doc(user.uid)
                .collection("todos")
                .doc(props.text.id)
                .set(
                  {
                    todo: newtodo,
                  },
                  { merge: true }
                );
            }}
          >
            Edit
          </button>
        </div>
        <div className="todo_op">
          <button
            className="btn btn-outline-danger"
            onClick={(event) => {
              db.collection("todos").doc(props.text.id).delete();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </> //react fragment to put more than one tags in the return statement
  );
}
export default Todo;
