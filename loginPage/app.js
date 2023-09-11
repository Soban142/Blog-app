var loginEmail = document.getElementById('emailField')
var loginPassword = document.getElementById('passwordField')
var loginBtn = document.querySelector('#loginBtn')

import { auth, app, getAuth, signInWithEmailAndPassword} from '../firebaseconfig.js'


loginBtn.addEventListener('click', loginHandler)


async function loginHandler (e) {
  e.preventDefault()
    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user)
      if(user){
        window.location.href = '../landingPage/index.html'
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}