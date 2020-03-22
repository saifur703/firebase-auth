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
  const signOutHandler = () => {
    // alert('Sign Out');

    firebase
      .auth()
      .signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          email: '',
          name: '',
          photo: '',
          password: '',
          error: ''
        };
        setUser(signedOutUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      });
  };

  const is_valid_email = email =>
    /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(email);

  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    newUserInfo[e.target.name] = e.target.value;
    setUser(newUserInfo);
    // console.log(newUserInfo);
    // console.log(e.target.name, e.target.email, e.target.password);

    if (e.target.name === 'email') {
      console.log(is_valid_email(e.target.value));
    }
  };
  const createAccount = e => {
    e.preventDefault();

    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = { ...user };
        createdUser.isSignedIn = true;
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
        const createdUser = { ...user };
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      });

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  };
  return (
    <div className='App'>
      <h2>Welcome To Firebase Auth and React JS</h2>

      {user.isSignedIn ? (
        <button style={btnStyle} onClick={signOutHandler}>
          Sign Out
        </button>
      ) : (
        <button style={btnStyle} onClick={signInHandler}>
          Sign In
        </button>
      )}
      {user.error && <p style={{ color: 'red' }}>{user.error}</p>}
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
      <div className='custom-form'>
        <h2>Our Custom Authentication</h2>
        <form onSubmit={createAccount}>
          <input
            onBlur={handleChange}
            type='text'
            name='name'
            id='name'
            placeholder='Your Name'
            required
          />
          <input
            onBlur={handleChange}
            type='email'
            name='email'
            id='email'
            placeholder='Your Email'
            required
          />
          <input
            onBlur={handleChange}
            type='password'
            name='password'
            id='password'
            placeholder='Your Password'
            required
          />
          <button onClick={createAccount}>Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default App;
