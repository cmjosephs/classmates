import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { auth } from '../api/firebase.config.js';

const AuthContext = createContext();


// need to implement state machine for idle,loading, success, and error states
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
        })
      } else {
        setUser(null);
      }
      setLoading(false);
    })
    return () => unsubscribe();
  }, [])

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // need set redirect to login
      })
      .catch((err) => {
        // needs to set an error state
        console.warn('Problem with sign up: ', err.message);
      })
  }

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // need to set redirect to /[username]/dashboard
      // need to set success state
    })
      .catch((err) => {
        // needs to set an error state
        console.warn('Problem with log in: ', err.message);
      })
  }

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  }

  // OAuth Google + FB
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.warn(error)
      })
  }
  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.warn(error)
      })
  }

  return (
    <AuthContext.Provider
      value={{
        user, signup, login, logout,
        signInWithGoogle, signInWithFacebook
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext);
}