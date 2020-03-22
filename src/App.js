import React, { useState } from 'react';
import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);
function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    photo: '',
    email: '',
    name: ''
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const btnStyle = {
    background: 'orange',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const signInHandler = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        // console.log(res);
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        };

        setUser(signedInUser);
        // console.log(displayName, photoURL, email);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      });
  };
  return (
    <div className='App'>
      <h2>Welcome To Firebase Auth and React JS</h2>
      <button style={btnStyle} onClick={signInHandler}>
        Sign In
      </button>
      {user.isSignedIn && (
        <React.Fragment>
          <p>
            <strong>Name</strong> {user.name}
          </p>
          <p>
            <strong>email</strong> {user.email}
          </p>
          <p>
            Photo
            <img src={user.photo} alt='' />
          </p>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
