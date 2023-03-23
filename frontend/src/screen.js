import { loadUserScreen } from './main.js';

export function removeLoginScreen() {
    const Loginform = document.getElementById("LoginForm");
    const RegisterForm = document.getElementById("RegisterForm");
    const LogoutForm = document.getElementById("LogoutForm");
    const addFeedForm = document.getElementById("addFeedForm");
    addFeedForm.style.display = 'block';
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

export function getUserProfileButton() {
    const viewProfileForm = document.getElementById("viewProfileForm");
    viewProfileForm.style.display = "block";
}

export function removeUserProfileButton() {
    const viewProfileForm = document.getElementById("viewProfileForm");
    viewProfileForm.style.display = "block";
}


export function otherUserScreen(userId) {
    removeLoginScreen();
    const parent = document.getElementById("output");
    parent.style.display = 'none';
    const Feeds = parent.querySelectorAll(".feed-container");
    for (let i = 0; i < Feeds.length; i++) {
        Feeds[i].style.display = "none";
    }
    const viewProfileForm = document.getElementById('viewProfileForm');
    viewProfileForm.style.display = 'none';

    loadUserScreen(userId);
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

    const watching_header = document.getElementsByClassName("WatchingUserH");
    for (let i = 0; i < watching_header.length; i++) {
        watching_header[i].style.display = "none";
    }

    const userPageFeeds = document.getElementsByClassName("userPageFeeds");
    for (let i = 0; i < userPageFeeds.length; i++) {
        userPageFeeds[i].style.display = "none";
    }


    const goBackButton = document.getElementsByClassName("goBackBtn")[0];
    goBackButton.style.display = "none";

    const button = document.getElementsByClassName("userPageWatchB")[0];
    button.style.display = "none";

    const userUpdateForm = document.getElementById("UserUpdateProfile");
    userUpdateForm.style.display = 'none';

    const userFeedsDiv = document.getElementById("userProfileFeeds");
    userFeedsDiv.style.display = 'none';

    const currentDiv = document.getElementsByClassName("current_user_screen");
    for (let i = 0; i < currentDiv.length; i++) {
        currentDiv[i].remove();
    }

    getUserProfileButton();
}