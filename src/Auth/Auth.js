import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../api/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const [loaded, setLoaded] = useState(false);

  const value = {
    user,
    userData,
    login,
    logout,
    resetPassword,
    updatePasswordUser,
  };

  function login(correo, password) {
    return signInWithEmailAndPassword(auth, correo, password);
  }

  async function logout() {
    return signOut(auth).then(() => setUserData(null));
  }

  function resetPassword(correo) {
    return sendPasswordResetEmail(auth, correo);
  }

  async function updatePasswordUser(newPassword) {
    return updatePassword(auth.currentUser, newPassword)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        onSnapshot(doc(db, "usuarios", user.uid), (doc) =>
          setUserData(doc.data())
        );
      }
    });
    setLoaded(true);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {loaded && children}
    </AuthContext.Provider>
  );
}

export default useAuth;
