import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

const url = "http://localhost:" + String(BACKEND_PORT);

console.log('Let\'s go!');

var user_logged_in = false;

// Milestone 1
// Login
const LoginForm = document.getElementById("LoginForm");
LoginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const userId = document.getElementById("userID").value;
    const password = document.getElementById("userPD").value;

    let data = {
        email: userId,
        password: password
    }
    fetch(url + "/auth/login", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log(BACKEND_PORT);
        if (!response.ok) {
            console.log("Error here");
            //throw new Error(`Error: ${response.status}`);
            window.alert("Wrong Credential");
        }
    })
    .then(data => {
        //token = data["token"];
        //user_id = data["userId"];
        //login_email = "";
        //login_password = "";
        console.log(data);
        user_logged_in = true;
        LoginForm.style.display = 'none';
    })
    .catch(error => {
        console.log(error);
        const errorMessage = document.getElementById('login-error');
        errorMessage.innerText = 'Login Credential is not correct';
        errorMessage.innerText = '';
    });
})

// Register
let RegisterForm = document.getElementById("RegisterForm");
RegisterForm.addEventListener ("submit", function(event) {
    event.preventDefault();
    const userId = document.getElementById("registerID").value;
    const userN = document.getElementById("registerN").value;
    const password = document.getElementById("registerPD").value;
    const confirm_password = document.getElementById("registerPC").value;
    if (password != confirm_password){
        window.alert("Password not match");
        return;
    }

    let data = {
        email: userId,
        password: password,
        name: userN
    }

    fetch(url + "/auth/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                // console.log("res is ok I guess");
                return res.json();
            } else {
                // console.log("res is not ok i guess")
                throw new Error(`Error: ${res.status}`);
            }
        })
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            //display_error_popup("Invalid Input");
            console.log("Error: ", err);
        });
})