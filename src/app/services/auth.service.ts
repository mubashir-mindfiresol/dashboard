import { Injectable } from '@angular/core';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, sendEmailVerification } from "firebase/auth";
import { getFirestore } from 'firebase/firestore/lite';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userLoggedIn: boolean;      // other components can check on this variable for the login status of the user

  constructor(private router: Router, private afAuth = getAuth(), private afs=  getFirestore()) {
      this.userLoggedIn = false;
      this.afs;
      this.afAuth.onAuthStateChanged((user) => {              // set up a subscription to always know the login status of the user
          if (user) {
              this.userLoggedIn = true;
          } else {
              this.userLoggedIn = false;
          }
      });
  }

  loginUser(email: string, password: string): Promise<any> {
      const auth = getAuth();
      return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("Logged In");
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  }

  signupUser(user: any): Promise<any> {
      const auth = getAuth();
      return createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("Signed Up");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
    }

  resetPassword(email: string): Promise<any> {
      const auth = getAuth();
      return sendPasswordResetEmail(auth, email)
          .then(() => {
              console.log('Auth Service: reset password success');
              // this.router.navigate(['/amount']);
          })
          .catch(error => {
              console.log('Auth Service: reset password error...');
              console.log(error.code);
              console.log(error)
              if (error.code)
                  return error;
          });
  }

  logoutUser(): Promise<void> {
      const auth = getAuth();
      return signOut(auth)
          .then(() => {
              this.router.navigate(['/home']);                    // when we log the user out, navigate them to home
          })
          .catch(error => {
              console.log('Auth Service: logout error...');
              console.log('error code', error.code);
              console.log('error', error);
              if (error.code)
                  return error;
          });
  }

  getCurrentUser() {
      return this.afAuth.currentUser;                                 // returns user object for logged-in users, otherwise returns null 
  }

}
