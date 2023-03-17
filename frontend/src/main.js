import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
import { removeLoginScreen, revertLoginScreen } from './screen.js';
import { loginError, likesPopup, updateFeedPopup, createFeedPopup } from './popup.js';
import { getUserName } from './user.js';


const url = "http://localhost:" + String(BACKEND_PORT);

console.log('Let\'s go!');

var user_logged_in = false;
var user_token = null;
var user_id = null;
var feed_index = 0;

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
            loadCurrentUserScreen();
        })
        .catch(error => {
            console.log(error);
            loginError();
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

// Feeds
// TODO: add comments, write comments, and Update, Delete job
const outputElement = document.getElementById("output");

// Infinite Scroll
outputElement.addEventListener('scroll', function() {
    if (outputElement.scrollTop + outputElement.clientHeight >= outputElement.scrollHeight) {
        loadFeeds();
    }
})

function loadFeeds() {
    const fetchURL = url + "/job/feed?start=" + feed_index + "&userId=" + user_id;
    feed_index += 5;
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
        const feedArray = Object.values(feeds); // extract the values of the object into an array
        const promises = feedArray.map(feed => {
            const div = document.createElement("div");
            div.classList.add(`feed-${feed.id}`);

            // Create and append image element
            const img = document.createElement("img");
            img.src = feed.image;
            img.alt = feed.description;
            img.classList.add("Feed-Image");
            div.appendChild(img);

            // Create and append description element
            const description = document.createElement("div");
            description.classList.add(`${feed.id}description`);
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

            /*
            When the creator of the feed is the user himself
            */
            if (feed.creatorId == user_id) {
                // Feed needs to have delete button
                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add(`${feed.id}deleteBtn`);
                deleteBtn.textContent = "Delete Feed";

                div.appendChild(deleteBtn);

                deleteBtn.addEventListener("click", function() {
                    deleteFeed(feed);
                });

                // Add update Feed button
                const updateBtn = document.createElement("button");
                updateBtn.classList.add(`${feed.id}updateBtn`);
                updateBtn.textContent = "Update Feed";

                div.appendChild(updateBtn);

                updateBtn.addEventListener("click", function() {
                    updateFeedPopup(feed).then((data => {
                        updateFeed(feed, feed.id, data.title, data.image, data.description);
                    }));
                });

            }
            
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

// User Profile Update form
const UpdateProfileForm = document.getElementById("UserUpdateProfile");
UpdateProfileForm.addEventListener("submit", function(event){
    event.preventDefault();
    const email = document.getElementById("updateEmail").value;
    const pd = document.getElementById("updatePD").value;
    const name = document.getElementById("updateName").value;
    const image = document.getElementById("updateImage").value;

    let data = {};

    if (email !== '') {
        data.email = email;
    }
    if (pd !== '') {
        data.password = pd;
    }
    if (name !== '') {
        data.name = name;
    }
    if (image !== '') {
        data.image = image;
    }

    fetch(url + "/user", {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${user_token}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response) {
            throw new Error(`Error: ${response.status}`);
        }
    })
    .catch(error => {
        throw new Error(`Error: ${error}`);
    })
})

// Load User screen
function loadCurrentUserScreen() {
    loadUserScreen(user_id);
    const UserUpdateForm = document.getElementById("UserUpdateProfile");
    UserUpdateForm.style.display = "block";

    const div = document.createElement("div");
    div.classList.add(`current`);
    document.body.appendChild(div);

    const addBtn = document.createElement("button");
    addBtn.classList.add(`btns`);
    addBtn.textContent = "Add feed";

    div.appendChild(addBtn);

    addBtn.addEventListener("click", function() {
        createFeedPopup().then((data) => {
            console.log("Hello");
            addFeed(data.title, data.image, data.description);
        });
    });
}

//done
function watch(user_email) {
    let data = {
        email: user_email,
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
            console.log("Watch Successful");
        }
    })
    .catch(error => {
        console.log(error);
    })
}

function unwatch(user_email) {
    let data = {
        email: user_email,
        turnon: false
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
            console.log("Unwatch Successful");
        }
    })
    .catch(error => {
        console.log(error);
    })
}


function loadUserScreen(userId) {
    const fetchURL1 = url + "/user?userId="+userId;

    const div = document.createElement("div");
    div.classList.add("Watching-Users");
    let user_email = '';

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'my-button');
    button.textContent = 'Watch';

    div.appendChild(button);

    const promise1 = new Promise((resolve, reject) => {
        fetch(fetchURL1, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user_token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if(!response) {
                reject(response);
            }
            return response.json();
        })
        .then(data => {
            const userEmail = data.email;
            const userName = data.name;
            user_email = userEmail;
            const paragraph = document.createElement("p");
            const textNode = document.createTextNode(`User email: ${userEmail}, User name: ${userName}`);
            paragraph.appendChild(textNode);
            document.body.appendChild(paragraph);

            //resolve(data.watcheeUserIds);
            resolve(data);
        })
        .catch(error => {
            reject(error);
        })
    });
    const promise2 = promise1.then(data => {
        const watcheeUserIds = data.watcheeUserIds;
        watcheeUserIds.forEach(userId => {
            const fetchURL2 = url + "/user?userId="+userId;
            fetch(fetchURL2, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${user_token}`,
                    'Content-Type': 'application/json'
                },
            })
            .then(response => {
                if (!response) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const p = document.createElement("p");
                const textNode1 = document.createTextNode(`Watching User: ${data.name}`);
                p.appendChild(textNode1);
                div.appendChild(p);
            })
            .catch(error => {
                throw new Error(`Error: ${error}`);
            })
        });
        document.body.appendChild(div);
        return data;
    });
    //let the user watch himself
    const promise3 = promise2.then(data => {
        button.addEventListener('click', function() {
            if (button.textContent === 'Watch') {
                button.textContent = 'Unwatch';
                watch(data.email);
            } else {
                button.textContent = 'Watch';
                unwatch(data.email);
            }
        });
        let req = {
            email: data.email,
            turnon: true
        }
        const fetchURL3 = url + "/user/watch" + "?userId=" + userId;
        fetch(fetchURL3, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
        })
        .catch(error => {
            throw new Error(`Error: ${error}`);
        })
    });
    
    const promise4 = new Promise((resolve, reject) => {
        const fetchURL4 = url + "/job/feed?start=" + 0 + "&userId=" + userId;
        fetch(fetchURL4, {
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
            data.forEach(feed => {
                if (feed.creatorId == userId){
                    const p = document.createElement("p");
                    const textNode1 = document.createTextNode(`Creator ID: ${feed.creatorId}, Description: ${feed.description}`);
                    p.appendChild(textNode1);
                    div.appendChild(p);
                }
            });
        })
        .catch(error => {
            reject(error);
        })
        document.body.appendChild(div);
    });

    Promise.all([promise1, promise2, promise3, promise4])
    .catch(error => {
        console.error(error);
    });
}

function addFeed(title, image, description) {
    const start = new Date();
    const start_toString = start.toISOString();

    let data = {
        title: title,
        image: image,
        start: start_toString,
        description: description
    }
    const fetchURL = url+"/job";
    fetch(fetchURL, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${user_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        while(outputElement.firstChild) {
            outputElement.removeChild(outputElement.firstChild);
        }
        feed_index = 0;
        loadFeeds();
    })
    .catch(error => {
        throw new Error(`Error: ${error}`)
    })
}

//Working!
function deleteFeed(feed) {
    if (feed.creatorId != user_id) {
        throw new Error("You are not a creator!!!!");
    }
    let data = {
        id: feed.id
    }
    const fetchURL = url + "/job";
    fetch(fetchURL, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${user_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const feed_to_be_deleted = document.getElementsByClassName(`feed-${feed.id}`);
        console.log(feed_to_be_deleted);
        for (let i = 0; i < feed_to_be_deleted.length; i++) {
            feed_to_be_deleted[i].remove();
        }
    })
    .catch(error =>{
        throw new Error(`Error: ${error}`);
    })
}

// Done
function updateFeed(feed, id, title, image, description) {
    const start = new Date();
    const start_toString = start.toISOString();

    let data = {
        id: id,
        title: title,
        image: image,
        start: start_toString,
        description: description
    }

    const fetchURL = url+"/job";
    fetch(fetchURL, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${user_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const feed_to_be_updated = document.getElementsByClassName(`${feed.id}description`)[0];
        feed_to_be_updated.textContent = description;
    })
    .catch(error => {
        console.log(error);
    })
}