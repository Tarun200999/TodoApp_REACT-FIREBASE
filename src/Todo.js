import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Modal,
  Input,
} from "@material-ui/core";
import React, { useState } from "react";
import "./Todo.css";
import db from "./firebase";
function Todo(props) {
  const [open, setOpen] = useState(false);
  const [newtodo, setTodo] = useState("");
  return (
    <>
      <Modal open={open} onClose={(e) => setOpen(false)}>
        <div className="edit_modal">
          <Input
            placeholder={props.text.todo}
            value={newtodo}
            onChange={(event) => setTodo(event.target.value)}
          />
          <Button
            onClick={() => {
              db.collection("todos").doc(props.text.id).set(
                {
                  todo: newtodo,
                },
                { merge: true }
              );
            }}
          >
            Edit
          </Button>
        </div>
      </Modal>
      <div className="todos">
        <li
          onClick={() => {
            alert("hello");
          }}
        >
          {props.text.todo}
        </li>
        <div className="todo_op">
          <button
            className="btn btn-outline-danger"
            onClick={(event) => {
              db.collection("todos").doc(props.text.id).delete();
            }}
          >
            Delete
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={(e) => setOpen(true)}
          >
            Edit
          </button>
        </div>
      </div>
    </> //react fragment to put more than one tags in the return statement
  );
}
export default Todo;
