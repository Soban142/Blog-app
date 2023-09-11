import { auth, db, doc, getDoc, onAuthStateChanged, signOut, setDoc, addDoc, collection, query, getDocs, ref, uploadBytesResumable, getDownloadURL, storage, updateDoc, deleteDoc, serverTimestamp, orderBy, where } from "../firebaseconfig.js";


const userProfile = document.querySelector('#userProfile');
const blogTitle = document.querySelector('#blogTitleValue');
const blogContent = document.querySelector('#blogContentValue');
const blogContainer = document.querySelector('.blog-container');
console.log(blogContainer)
const publishBtn = document.getElementById('publishBtn');
const logOutBtn = document.querySelector('#logoutBtn')
console.log(publishBtn)

let currentUser;
let blogIdUniversal;


function getUser() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        currentUser = uid;
        getUserData(uid)
        addBlogData(uid)
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
            const { firstName, surName, email, userName } = docSnap.data();
            console.log(userName)

            userProfile.innerText = `${userName ? userName : firstName + ' ' + surName}`;
        } else {
        console.log("No such document!");
        }
    } catch (error) {
        console.log(error)
    }
}

async function blogHandler () {
    console.log(blogTitle.value)
    console.log(blogContent.value)

    const docRef = await addDoc(collection(db, "blogs"), {
        authorId: currentUser,
        blogTitle: blogTitle.value,
        blogContent: blogContent.value,
        time: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
    addBlogData()
}

async function editProcess() {
    const washingtonRef = doc(db, "blogs", blogIdUniversal);

    await updateDoc(washingtonRef, {
        blogTitle: blogTitle.value,
        blogContent: blogContent.value
    });
    alert('Blog edited!')
    addBlogData();

    publishBtn.removeEventListener('click', editProcess)
    publishBtn.addEventListener('click', blogHandler)
}


async function editFoo(blogId) {
    const docRef = doc(db, "blogs", blogId);
    const docSnap = await getDoc(docRef);

    blogIdUniversal = blogId;
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());

        const { blogTitle: titleFromFB, blogContent: contentFromFB } = docSnap.data()

        blogTitle.value = titleFromFB;
        blogContent.value = contentFromFB;

    } else {
        console.log("No such document!");
    }

    publishBtn.removeEventListener('click', blogHandler)
    publishBtn.addEventListener('click', editProcess)
}

async function deleteFoo(blogId){
    try {
        await deleteDoc(doc(db, "blogs", blogId));
        alert('Blog deleted successfully!');
        addBlogData();
    } catch (error) {
        console.log(error)
    }
}

async function addBlogData(loggedInUserId) {
  blogTitle.value = '';
  blogContent.value = '';
  blogContainer.innerHTML = '';
    console.log(currentUser)
    const q = query(collection(db, "blogs"), where("authorId", "==", currentUser), orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
        console.log(doc.id, " => ", doc.data());
        const { authorId, blogTitle, blogContent, time } = doc.data();

        console.log(authorId)
        const authorData = await getBlogAuthorData(authorId);
        const { email, firstName, surName, profileImage, userName } = authorData 

        console.log(time)

        const blog = `<div class="blogs-div mt-4">
        <div class="blog-header-div">
          <div class="img-div">
            <img src="${profileImage ? profileImage : '../assests/dummy.webp'}" alt="" class="userImage img-fluid">
          </div>
          <div class="titleDiv col-md-5 ml-3">
            <h4 class="blogTitle">${blogTitle}</h4>
            <p class="text-secondary">${userName ? userName : firstName + ' ' + surName} - ${new Date(time.seconds * 1000)}</p>
          </div>
        </div>
        <div class="blog-content-div mt-3">
          <p class="blog-content">${blogContent}</p>
        </div>
        <div class="UDbtns-div mt-3">
          <button class="btn btn-primary" onClick='editFoo("${doc.id}")'>Edit</button>
          <button class="btn btn-primary" onClick='deleteFoo("${doc.id}")'>Delete</button>
        </div>
      </div>`

      const div = document.createElement('div');
      div.innerHTML = blog;
      blogContainer.appendChild(div)
    });

}

async function getBlogAuthorData(authorId) {
    const docRef = doc(db, "users", authorId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
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

publishBtn.addEventListener('click', blogHandler);

window.editFoo = editFoo;
window.deleteFoo = deleteFoo;