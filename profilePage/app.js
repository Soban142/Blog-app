import { auth, db, doc, getDoc, onAuthStateChanged, signOut, setDoc, addDoc, collection, query, getDocs, ref, uploadBytesResumable, getDownloadURL, storage, updateDoc, deleteDoc, serverTimestamp, orderBy } from "../firebaseconfig.js";


const profileImage = document.getElementById('profileImage')
const imageFile = document.getElementById('imageFile')
const userName = document.getElementById('userName')
const oldPass = document.getElementById('oldPass')
const NewPass = document.getElementById('NewPass')
const rePass = document.getElementById('rePass')
const updateBtn = document.querySelector('.updateBtn')
const logOutBtn = document.querySelector('#logoutBtn')

let currentUser;

function getUser() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        currentUser = uid;
        console.log(uid)
        getUserData(uid)
      } else {
        alert('user not found!')
        window.location.href = '../brokerPage/index.html'
      }
    });
}
getUser();

async function getUserData(userId) {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const { firstName, surName, email, profileImage: pfp, userName: username } = docSnap.data();

            userProfile.innerText = `${username ? username : firstName + ' ' + surName}`
            profileImage.src = pfp
            userName.value = `${username}`;
        } else {
        console.log("No such document!");
        }
    } catch (error) {
        console.log(error)
    }
}

async function updateHandler() {
    // Create the file metadata
    /** @type {any} */
    const metadata = {
        contentType: 'image/jpeg'
    };
  
    const file = imageFile.files[0];
  // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
  
        // ...
  
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log('File available at', downloadURL);
        const washingtonRef = doc(db, "users", currentUser);
        try {
            await updateDoc(washingtonRef, {
                userName: userName.value,
                authorId : currentUser,
                profileImage : downloadURL
            });
            alert('Profile Updated!');
            userName.value = '';
        } catch (error) {
            console.log(error)
        }
      });
    }
  )
}


logOutBtn.addEventListener('click', logoutHandler)

function logoutHandler() {
    signOut(auth).then(() => {
        console.log(`Sign-out successful`)
        window.location.href = "../index.html"
    }).catch((error) => {
        console.error(error)
    });
}

updateBtn.addEventListener('click', updateHandler)