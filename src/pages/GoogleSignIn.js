import React, { useEffect, useState } from 'react';
import { auth, provider } from '../firebase-config.js';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

function GoogleSignIn() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .catch(error => console.error("Error signing in: ", error));
  };

  const handleSignOut = () => {
    signOut(auth)
      .catch(error => console.error("Error signing out: ", error));
  };

  return (
    <div>
      {user ? (
        <div>
          <img src={user.photoURL} alt={user.displayName} />
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
}

export default GoogleSignIn;
