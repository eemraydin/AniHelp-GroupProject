import {login} from "./authentication.js"


loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = loginForm['login-username'].value;
    const password = loginForm['login-password'].value; 
    login(email, password)
    .then(()=> {
        loginForm.reset();
        window.location = "../pages/adminhome.html"
    })
    .catch((error) => {
        loginForm.querySelector('.error').innerHTML = error;
    })
});