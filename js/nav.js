import {login, signup, googleSignIn, logout} from "./authentication.js"
import  * as authorization from "./authorization.js"

const loginModal = document.getElementById('loginModal')
const signupModal = document.getElementById('signupModal')
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

loginModal.addEventListener('hide.bs.modal', () => {
    loginForm.reset();
})

signupModal.addEventListener('hide.bs.modal', () => {
    signupForm.reset();
})

// -------------- Add logout eventlistener --------------
logoutlink.addEventListener("click", (e)=>{
    e.preventDefault();
    logout()
    .then(() => {
        window.location.href = "../";
    })
    
});

// -------------- Add signup eventlistener --------------
signupForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    const email = signupForm['signup-email'].value;
    const username = signupForm['signup-username'].value;
    const password = signupForm['signup-password'].value;
   
    signup(username, email, password)
    .then(()=> {
        bootstrap.Modal.getInstance(signupModal).hide();
        signupForm.reset();
    })
    .catch((error) => {
        signupForm.querySelector('.error').innerHTML = error;
    })
   
});

// -------------- Add login eventlistener --------------
loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value; 
        
    login(email, password)
    .then(()=> {
        bootstrap.Modal.getInstance(loginModal).hide();
        loginForm.reset();
    })
    .catch((error) => {
        loginForm.querySelector('.error').innerHTML = error;
    })
});

// -------------- Add google signin eventlistener --------------
googlesigninlink.addEventListener('click', (e) =>{
    googleSignIn()
        .catch((error) => {
            console.log(error);
        });
})


document.addEventListener('DOMContentLoaded', function() {
    const offlinePopup = document.getElementById('offlinePopup');
  
    // Check if the user is offline
    function checkOfflineStatus() {
      if (!navigator.onLine) {
        showOfflinePopup();
      } else {
        hideOfflinePopup();
      }
    }
  
    // Show the offline popup
    function showOfflinePopup() {
      offlinePopup.style.display = 'block';
    }
  
    // Hide the offline popup
    function hideOfflinePopup() {
      offlinePopup.style.display = 'none';
    }
  
    // Listen for online/offline events
    window.addEventListener('online', checkOfflineStatus);
    window.addEventListener('offline', checkOfflineStatus);
  
    // Initial check when the page loads
    checkOfflineStatus();
  });