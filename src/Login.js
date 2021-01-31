import React from "react";
import { auth, provider } from "./firebase";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
function Login() {
  const [{}, dispatch] = useStateValue(); // we have took the reducer dispatch methos here

  const signIN = () => {
    // this methos is use to get the user info from firebase google authentication
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <div>
      <div className="container">
        <h1 className="display-1">Dear User Please Login to continue</h1>
        <button onClick={signIN} className="btn btn-success">
          SIGN WITH GOOGLE
        </button>
      </div>
    </div>
  );
}

export default Login;
