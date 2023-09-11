import { auth, app, db, getFirestore, collection, addDoc, setDoc, doc, getDoc, getAuth, createUserWithEmailAndPassword} from '../firebaseconfig.js'

var firstName = document.querySelector('#fname');
var surName = document.querySelector('#lname');
var signupEmail = document.querySelector('#email');
var phnNum = document.querySelector('#phoneNum');
var signUpPass = document.querySelector('#password');
var signUpBtn = document.querySelector('.signupBtn');
var repeatPassword = document.querySelector('#repeatPassword')
var hidden = document.querySelector('.hidden');


signUpBtn.addEventListener('click', signUpHandler);
async function signUpHandler (e) {
    e.preventDefault();
    let fname = firstName.value;
    let lname = surName.value;
    let password = signUpPass.value;
    let cPassword = repeatPassword.value;

    if(email.value || firstName.value || surName.value || signUpPass.value || repeatPassword.value){
        if(fname.length > 3 && fname.length < 20){
            if(lname.length > 1 && lname.length < 20) {
                if(password.length > 8 && password.length < 20){
                    if(password === cPassword){
                        try {
                            const userCredential = await createUserWithEmailAndPassword(auth, signupEmail.value, signUpPass.value);
                            const user = await userCredential.user;
                            console.log(user);
                    
                            if(userCredential.user){
                            addUserData(user.uid);
                            }
                        }
                         catch (error) {
                            const errorCode = error.code;
                            console.log(errorCode);
                        }
                    } else {
                        alert('Password and repeatPassword mismatched!')
                        console.log('Password and repeatPassword mismatched!')
                    }
                } else{
                    alert('Password must be at least 8 characters in length')
                    console.log('Password must be at least 8 characters in length')
                }
            } else {
                alert('First Name should be of at least 3 characters in length and should not exceed 20 characters')
                console.log('First Name should be of at least 3 characters in length and should not exceed 20 characters')
            }
        } else {
            alert('First Name should be of at least 3 characters in length and should not exceed 20 characters')
            console.log('First Name should be of at least 3 characters in length and should not exceed 20 characters')
        }
    } else {
        alert('All fields are required!')
        console.log('All fields are required!')
        
    }
}

async function addUserData(uid) {

  try {
      const response = await setDoc(doc(db, "users", uid), {
        userName: `${firstName.value} ${surName.value}`,
        firstName: firstName.value,
        surName: surName.value,
        email: signupEmail.value,
        password: signUpPass.value
    });

    alert('User signed up successfully!')
    window.location.href = '../loginPage/index.html';

  } catch (error) {
    console.log(error)
    alert(`${error}`)
  }
    
}


       
  