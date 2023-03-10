import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
import { removeLoginScreen } from './screen.js';
import { loginError } from './popup.js';


const url = "http://localhost:" + String(BACKEND_PORT);

console.log('Let\'s go!');

var user_logged_in = false;
var user_token = null;
var user_id = null;


// Milestone 1
// Login
const LoginForm = document.getElementById("LoginForm");
LoginForm.addEventListener("submit", function (event) {
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
                loginError("You typed wrong id or password. Please try agian!");
                throw new Error("Response not okay");
            }
            return response.json();
        })
        .then(data => {
            user_token = data.token;
            user_id = data.userId;
            user_logged_in = true;
            removeLoginScreen();
            loadFeeds();
        })
        .catch(error => {
            console.log(error);
            openPopup_Login();
        });
})

// Register
let RegisterForm = document.getElementById("RegisterForm");
RegisterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const userId = document.getElementById("registerID").value;
    const userN = document.getElementById("registerN").value;
    const password = document.getElementById("registerPD").value;
    const confirm_password = document.getElementById("registerPC").value;
    if (password != confirm_password) {
        openPopup_Register();
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
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Error: ${res.status}`);
        }
    })
    .then(data => {
        user_token = data.token;
        user_id = data.userId;
        user_logged_in = true;
        removeLoginScreen();
    })
    .catch(err => {
        console.log("Error: ", err);
    });
})

function createFeed() {
    let data = {
        title: "COO for cupcake factory",
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
        start: "2011-10-05T14:48:00.000Z",
        description: "Dedicated technical wizard with a passion and interest in human relationships"
    }
    console.log(user_id);
    fetch(url + "/job/", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${user_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Error: ${response.status}`);
        }
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log("Error: ", err);
    });
}

function loadFeeds() {
    const fetchURL = url + "/job/feed?start=" + 0 + "&userId=" + user_id;
    fetch(fetchURL, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${user_token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        else {
            throw new Error(`Error: ${response.status}`);
        }
    })
    .then(data => {
        const feedList = data;
        console.log(feedList);
        showFeeds(feedList);
    })
    .catch(error => {
        console.log(error);
    })
}

const outputElement = document.getElementById("output");

function showFeeds(feeds) {
    feeds.forEach(feed => {
        // Add the main div to the output element
        outputElement.appendChild(createFeedElement(feed));
    });

      // Set the output element's display property to "block"
    outputElement.style.display = "block";
}

function createFeedElement(feed) {
    const div = document.createElement("div");
    div.classList.add("feed-container");
  
    // Create and append image element
    const img = document.createElement("img");
    img.src = feed.image;
    img.alt = feed.description;
    div.appendChild(img);
  
    // Create and append ID element
    const id = document.createElement("div");
    id.classList.add("feed-id");
    id.textContent = `ID: ${feed.id}`;
    div.appendChild(id);
  
    // Create and append description element
    const description = document.createElement("div");
    description.classList.add("feed-description");
    description.textContent = feed.description;
    div.appendChild(description);
  
    // Create and append buttons to show/hide likes and comments
    const likesBtn = document.createElement("button");
    likesBtn.classList.add("toggle-btn");
    likesBtn.textContent = "Show likes";
    div.appendChild(likesBtn);
  
    const likesList = document.createElement("ul");
    likesList.classList.add("feed-likes-list");
    feed.likes.forEach((like) => {
        const likeItem = document.createElement("li");
        likeItem.textContent = like;
        likesList.appendChild(likeItem);
    });
    //div.appendChild(likesList);
  
    const commentsBtn = document.createElement("button");
    commentsBtn.classList.add("toggle-btn");
    commentsBtn.textContent = "Show comments";
    div.appendChild(commentsBtn);
  
    const commentsList = document.createElement("ul");
    commentsList.classList.add("feed-comments-list");
    feed.comments.forEach((comment) => {
        const commentItem = document.createElement("li");
        commentItem.textContent = comment;
        commentsList.appendChild(commentItem);
    });
    commentsList.style.display = 'none';
    div.appendChild(commentsList);
  
    // Add event listeners to the buttons to toggle visibility of the lists
    likesBtn.addEventListener("click", () => {
        likesList.classList.toggle("hidden");
        if (likesBtn.textContent === "Show likes") {
            likesBtn.textContent = "Hide likes";
        } else {
            likesBtn.textContent = "Show likes";
        }
    });
  
    commentsBtn.addEventListener("click", () => {
        commentsList.classList.toggle("hidden");
        if (commentsBtn.textContent === "Show comments") {
            commentsList.style.display = 'block';
            commentsBtn.textContent = "Hide comments";
        } else {
            commentsList.style.display = 'none';
            commentsBtn.textContent = "Show comments";
        }
    });
  
    return div;
  }
  

function watch() {
    let data = {
        email: "james@email.com",
        turnon: true
    }
    const fetchURL = url + "/user/watch" + "?userId=" + user_id;
    fetch(fetchURL, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${user_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log("Good");
        }
    })
    .catch(error => {
        console.log(error);
    })
}