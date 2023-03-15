import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
import { removeLoginScreen, revertLoginScreen } from './screen.js';
import { loginError, likesPopup } from './popup.js';
import { getUserName } from './user.js';


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

let LogoutForm = document.getElementById("LogoutForm");
LogoutForm.addEventListener("submit", function(event) {
    event.preventDefault();
    user_token = null;
    user_id = null;
    user_logged_in = false;
    revertLoginScreen();
})
const outputElement = document.getElementById("output");
function loadFeeds() {

    const fetchURL = url + "/job/feed?start=" + 0 + "&userId=" + user_id;
    const promise1 = new Promise((resolve, reject) => {
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
            resolve(data);
        })
        .catch(error => {
            reject(error);
        })
    });
    
    const promise2 = promise1.then(feeds => {
        console.log(feeds);
        console.log(typeof(feeds));
        const feedArray = Object.values(feeds); // extract the values of the object into an array
        const promises = feedArray.map(feed => {
            const div = document.createElement("div");
            div.classList.add("feed-container");

            // Create and append image element
            const img = document.createElement("img");
            img.src = feed.image;
            img.alt = feed.description;
            img.classList.add("Feed-Image");
            div.appendChild(img);

            // Create and append description element
            const description = document.createElement("div");
            description.classList.add("feed-description");
            description.textContent = feed.description;
            div.appendChild(description);

            const commentsBtn = document.createElement("button");
            commentsBtn.classList.add("toggle-btn");
            commentsBtn.textContent = feed.comments.length;
            div.appendChild(commentsBtn);

            commentsBtn.addEventListener("click", () => {
                commentsList.classList.toggle("hidden");
                if (commentsBtn.textContent === "Hide Comments") {
                    commentsList.style.display = 'none';
                } else {
                    commentsList.style.display = 'block';
                    commentsBtn.textContent = "Hide Comments";
                }
            });
            commentsBtn.classList.add("Feed-Comment-Button");

            const likesBtn = document.createElement("button");
            likesBtn.classList.add(`${feed.id}likesBtn`);
            likesBtn.textContent = "Show Likes!";
            div.appendChild(likesBtn);

            likesBtn.addEventListener("click", function() {
                likesPopup(feed, user_token);
            });

            const fetchURL = url + "/user?userId="+feed.creatorId;
            return fetch(fetchURL, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user_token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then(data => {
            const creator = document.createElement("div");
            creator.classList.add("creator_id");
            creator.textContent = data.name;
            div.appendChild(creator);

            outputElement.appendChild(div);
            return data.name;
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
        });
        return Promise.all(promises);
    })

    Promise.all([promise1, promise2])
    .then(([feeds, creatorName]) => {
        outputElement.style.display = "block";
    })
    .catch(error => {
        console.log(error);
    });
}

function createFeed() {
    let data = {
        title: "COO for cupcake factory",
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
        start: "2011-10-05T14:48:00.000Z",
        description: "Dedicated technical wizard with a passion and interest in human relationships"
    }
    const fetchURL = url + "/job";
    fetch(fetchURL, {
        method: "POST",
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

function watch() {
    let data = {
        email: "seumoon@email.com",
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
