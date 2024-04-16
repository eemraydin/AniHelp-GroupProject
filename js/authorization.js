import { auth } from './common.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
        
onAuthStateChanged(auth , ( user )  => {  //The callback is passed user parameter from event
    const loggedOut = document.querySelectorAll('.logged-out');
    const loggedIn = document.querySelectorAll('.logged-in');
    if (user) { // if there is a user object it means user is logged in, hide Login and Signup links
        usergreeting.innerHTML = `Hello ${user.auth.currentUser.displayName}`;
        loggedOut.forEach(element => {
            element.style.display = 'none';
        });
        loggedIn.forEach(element => {
            element.style.display = 'inline-block';
        });
        
    } else {  // if user object is null or undefined it means no user is logged in, hide logout link
        usergreeting.innerHTML = "";
        loggedOut.forEach(element => {
            element.style.display = 'inline-block';
        });
        loggedIn.forEach(element => {
            element.style.display = 'none';
        });
    }
});