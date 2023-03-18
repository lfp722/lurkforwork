

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
    Loginform.style.display = "blocpk";
    RegisterForm.style.display = "block";
    LogoutForm.style.display = "none";
}

export function otherUserScreen() {
    removeLoginScreen();
    const parent = document.getElementById("output");
    parent.style.display = 'none';
    const Feeds = parent.querySelectorAll(".feed-container");
    for (let i = 0; i < Feeds.length; i++) {
        Feeds[i].style.display = "none";
    }
}

export function goBacktoMainScreen() {
    // Revert Feeds
    const parent = document.getElementById("output");
    parent.style.display = 'block';
    const Feeds = parent.querySelectorAll(".feed-container");
    for (let i = 0; i < Feeds.length; i++) {
        Feeds[i].style.display = "block";
    }

    // User Information Paragraph
    const paragraphs = document.getElementsByClassName("UserInfoP");
    for (let i = 0; i < paragraphs.length; i++) {
        paragraphs[i].style.display = "none";
    }

    const watching_paragraphs = document.getElementsByClassName("WatchingUserP");
    for (let i = 0; i < watching_paragraphs.length; i++) {
        watching_paragraphs[i].style.display = "none";
    }

    const userPageFeeds = document.getElementsByClassName("userPageFeeds");
    for (let i = 0; i < userPageFeeds.length; i++) {
        userPageFeeds[i].style.display = "none";
    }

    const button = document.getElementsByClassName("userPageWatchB")[0];
    button.style.display = "none";
}