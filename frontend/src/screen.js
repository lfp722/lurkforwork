

export function removeLoginScreen() {
    const Loginform = document.getElementById("LoginForm");
    const RegisterForm = document.getElementById("RegisterForm");
    const LogoutForm = document.getElementById("LogoutForm");
    Loginform.style.display = "none";
    RegisterForm.style.display = "none";
    LogoutForm.style.display = "block";
}

export function revertLoginScreen() {
    const Loginform = document.getElementById("LoginForm");
    const RegisterForm = document.getElementById("RegisterForm");
    const LogoutForm = document.getElementById("LogoutForm");
    Loginform.style.display = "block";
    RegisterForm.style.display = "block";
    LogoutForm.style.display = "none";
}

export function otherUserScreen() {
    console.log("otherUserScreen");
    removeLoginScreen();
    const parent = document.getElementById("output");

    const Feeds = parent.querySelectorAll(".feed-container");
    if (!Feeds) {
        console.log("No!");
    }
    else{ 
        for (let i = 0; i < Feeds.length; i++) {
            Feeds[i].style.display = "none";
        }
    }
}