import { auth, errorMessage } from './common.js'
import { getOrganization } from './class/organization.js'
import { GoogleAuthProvider, 
        signInWithPopup,
        updateProfile,
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        onAuthStateChanged,
        signOut } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

export {login, signup, googleSignIn, logout, getUserDetails}

// onAuthStateChanged(auth , ( user )  => {  //The callback is passed user parameter from event
//     const loggedOut = document.querySelectorAll('.logged-out');
//     const loggedIn = document.querySelectorAll('.logged-in');
//     if (user) { // if there is a user object it means user is logged in, hide Login and Signup links
//         console.log("user signed in");
//         usergreeting.innerHTML = `Hello ${user.auth.currentUser.displayName}`;
//         loggedOut.forEach(element => {
//             element.style.display = 'none';
//         });
//         loggedIn.forEach(element => {
//             element.style.display = 'inline-block';
//         });
        
//     } else {  // if user object is null or undefined it means no user is logged in, hide logout link
//         console.log("user signed out");
//         usergreeting.innerHTML = "";
//         loggedOut.forEach(element => {
//             element.style.display = 'inline-block';
//         });
//         loggedIn.forEach(element => {
//             element.style.display = 'none';
//         });
//     }
// });
const login = async(email, password) =>{
    return new Promise(function (resolve, reject) {
        signInWithEmailAndPassword(auth, email, password)
        .then(()=>{
            resolve();
        })
        .catch(error => {
            reject(errorMessage(error.code))
        });
    })
}

const signup = async(displayName, email, password) =>{
    return new Promise(function (resolve, reject) {
        createUserWithEmailAndPassword(auth, email, password)
        .then( userCred => {
            updateProfile(userCred.user, { displayName })
            .then(()=>{
                resolve();
            });
        })
        .catch((error) => {
            reject(errorMessage(error.code))
        });
    })
}

const googleSignIn = async()=>{
    const provider = new GoogleAuthProvider();

    return new Promise(function (resolve, reject) {
        signInWithPopup(auth, provider)
        .then((userCredential) =>{
            const user = userCredential.user;
            resolve(user);
        })
        .catch((error) => {
            reject(errorMessage(error.code))
        });
    });
}

const logout = async()=>{
    return new Promise(function (resolve, reject) {
        signOut(auth)
        .then(() =>{
            localStorage.removeItem("aniHelpReportId");
            resolve();
        })
        .catch((error) => {
            reject(errorMessage(error.code))
        });
    });
}

const getUserDetails = async()=>{
    return new Promise(function (resolve, reject) {
        initializeAuth.then(() =>{

        //if a user is logged in
        if(auth.currentUser != null){   
            getOrganization(auth.currentUser.uid).then(res =>{
                if(res != null){    //this means user IS an organization
                    resolve({
                        uid: auth.currentUser.uid,
                        email: auth.currentUser.email,
                        displayName: auth.currentUser.displayName,
                        isAdmin: true,
                        orgId: res
                    });
                }else{              //this means user IS NOT an organization
                    resolve({
                            uid: auth.currentUser.uid,
                            email: auth.currentUser.email,
                            displayName: auth.currentUser.displayName,
                            isAdmin: false,
                            orgId: res
                        });
                }
            }).catch((error) => {
                console.log('gere')
                reject(errorMessage(error.code))
            });
        }
        //if no user logged in
        else{       
            resolve(null);
        }
    }).catch(error => {
        console.log(error)
    })
})
        
}


let initializeAuth = new Promise(function(resolve, reject) {
    let observer = function(user) {
      unsubscribe();
      resolve(user);
    };
    let unsubscribe = auth.onAuthStateChanged(observer);
  });