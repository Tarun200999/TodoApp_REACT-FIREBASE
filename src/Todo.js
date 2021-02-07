import React, { useState } from "react";
import "./Todo.css";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import { Modal, Button, Form } from "react-bootstrap";
function Todo(props) {
  const [show, setShow] = useState(false);
  const [newtodo, setTodo] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const handleModal = () => {
    setShow(true);
  };

  const handleEdit = () => {
    if (newtodo.length === 0) {
      alert("Can'nt be Empty");
    } else {
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
      setTodo("");
    }
  };
  return (
    <>
      <div className={props.dark ? "todos_darkmode" : "todos"}>
        <div className={props.dark ? "todo_item_darkmode" : "todo_item"}>
          <h3>{props.text.todo}</h3>
        </div>
        <div className={props.dark ? "todo_op_darkmode" : " todo_op"}>
          <button
            className="btn btn-outline-danger"
            onClick={(event) => {
              db.collection("users")
                .doc(user.uid)
                .collection("todos")
                .doc(props.text.id)
                .delete();
            }}
          >
            Delete
          </button>
          <button onClick={handleModal} className="btn btn-outline-success">
            Edit
          </button>
          <Modal show={show}>
            <Modal.Header>
              <Modal.Title>Edit</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                className="input_edit"
                value={newtodo}
                onChange={(e) => setTodo(e.target.value)}
                placeholder={props.text.todo}
              ></input>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleEdit}>Edit</Button>
              <Button variant="secondary" onClick={() => setShow(false)}>
                Close Modal
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </> //react fragment to put more than one tags in the return statement
  );
}
export default Todo;
