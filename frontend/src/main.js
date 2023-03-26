import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
import { removeLoginScreen, revertLoginScreen, goBacktoMainScreen, getUserProfileButton, removeUserProfileButton } from './screen.js';
import { customErrorPopup, commentsPopup, likesPopup, updateFeedPopup, createFeedPopup, watchUserByEmailPopup } from './popup.js';
import { getUserName } from './user.js';


const url = "http://localhost:" + String(BACKEND_PORT);

console.log('Let\'s go!');

/*
TODO: CSS Style
Add feed button in the main page.
*/

var user_logged_in = false;
var user_token = null;
var user_id = null;
var feed_index = 0;
var user_email = null;
var userName = null;

// Milestone 1
// Login
// Once login, the user will be directed to the main page.
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
        if (response.ok) {
            return response.json();
        }
        alert(`Wrong id or password\nPlease try again`);
        throw new Error(`Error: ${response.status}`);
    })
    .then(data => {
        user_token = data.token;
        user_id = data.userId;
        user_logged_in = true;
        user_email = userId;
    
        // Make the GET request after user_id has been set
        return fetch(url + "/user?userId=" + user_id, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user_token}`,
                'Content-Type': 'application/json'
            },
        });
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
        userName = data.name;
        removeLoginScreen();
        loadFeeds();
        getUserProfileButton();
    })
    .catch(error => {
        throw new Error(`Error: ${error}`);
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

    //User Id needs to be more than 6 chars long
    if (userId.trim().length < 6) {
        alert(`User ID needs to be more than 6 characters long!`);
        event.preventDefault();
        return;
    }

    if (userN.trim().length < 4) {
        alert(`User Name needs to be more than 4 characters long!`);
        event.preventDefault();
        return;
    }

    // Password needs to be more than 6 chars long
    if (password.trim().length < 6) {
        alert(`User Name needs to be more than 4 characters long!`);
        event.preventDefault();
        return;
    }

    if (!/\W/.test(password.trim())) {
        alert('Password needs to have more than 1 special character!');
        event.preventDefault();
        return;
    }


    if (password != confirm_password) {
        alert('Passwords do not match!');
        event.preventDefault();
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
            throw new Error(`Error: ${response.status}`);
        }
    })
    .then(data1 => {
        user_token = data1.token;
        user_id = data1.userId;
        user_logged_in = true;
        removeLoginScreen();
        loadFeeds();
        getUserProfileButton();
    })
    .catch(error => {
        customErrorPopup(`Error happened.\nThis might be because you are using existing credentials`);
        throw new Error(`Error: ${error}`);
    });
})

// Logout
let LogoutForm = document.getElementById("LogoutForm");
LogoutForm.addEventListener("submit", function(event) {
    event.preventDefault();
    user_token = null;
    user_id = null;
    user_logged_in = false;
    location.reload();
})

let viewProfileForm = document.getElementById("viewProfileForm");
viewProfileForm.addEventListener("submit", function(event) {
    event.preventDefault();
    loadCurrentUserScreen();
    removeUserProfileButton();
    viewProfileForm.style.display = 'none';
});

let watchUserByEmailFrom = document.getElementById("watchUserByEmailForm");
watchUserByEmailFrom.addEventListener("submit", function(event) {
    event.preventDefault();
    watchUserByEmailPopup();
})

let addFeedForm = document.getElementById("addFeedForm");
addFeedForm.addEventListener("submit", function(event) {
    event.preventDefault();
    createFeedPopup().then((data) => {
        const imagePromise = fileToDataUrl(data.image);
        imagePromise.then(dataURL => {
            addFeed(data.title, dataURL, data.startingDate, data.description);
        })
    });
})

// Feeds
const outputElement = document.getElementById("output");
// Infinite Scroll
outputElement.addEventListener('scroll', function() {
    if (outputElement.scrollTop + outputElement.clientHeight >= outputElement.scrollHeight) {
        loadFeeds();
    }
})

// Time Calculation
function TimeCalc(dateString) {
    const date = new Date(dateString);
    const diff = Math.abs(new Date() - date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        const remainingMinutes = minutes % 60;
        return `${hours} hours and ${remainingMinutes} minutes ago`;
    } else {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

function TimePrettier(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


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
            customErrorPopup(`Error: ${error}`);
            reject(error);
        })
    });
    
    const promise2 = promise1.then(feeds => {
        const feedArray = Object.values(feeds); // extract the values of the object into an array
        const promises = feedArray.map(feed => {
            const div = document.createElement("div");
            div.id = 'feed';
            div.classList.add(`feed-${feed.id}`);

            // Create and append image element
            const img = document.createElement("img");
            img.src = feed.image;
            img.alt = feed.description;
            img.classList.add("Feed-Image");
            div.appendChild(img);

            //Title 
            const title = document.createElement("h3");
            title.textContent = feed.title;
            title.style.fontWeight = "bold";
            div.append(title);

            //Time posted
            const time = document.createElement("p");
            time.textContent = `Posted: ${TimeCalc(feed.createdAt)}`;
            div.append(time);

            // Starting Time
            const startingTime = document.createElement("p");
            startingTime.textContent = `Starting Date: ${TimePrettier(feed.start)}`
            div.append(startingTime);

            // Create and append description element
            const description = document.createElement("p");
            description.classList.add(`${feed.id}description`);
            description.textContent = `Description: ${feed.description}`;
            div.appendChild(description);

            const likesBtn = document.createElement("button");
            likesBtn.classList.add(`${feed.id}likesBtn`);
            likesBtn.textContent =  `❤️: ${feed.likes.length}`;
            div.appendChild(likesBtn);

            likesBtn.addEventListener("click", () => {
                likesPopup(feed);
            });
            likesBtn.classList.add("Feed-Comment-Button");

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
                        const imagePromise = fileToDataUrl(data.image);
                        imagePromise.then(dataURL => {
                            updateFeed(feed, feed.id, data.title, dataURL, data.description);
                            title.textContent = data.title;
                            img.src = dataURL;
                            description.textContent = `Description: ${data.description}`;
                        })
                    }));
                });

            }
            
            const commentsBtn = document.createElement("button");
            commentsBtn.classList.add(`${feed.id}commentsBtn`);
            commentsBtn.textContent = `Show Comments!`;
            div.appendChild(commentsBtn);

            commentsBtn.addEventListener("click", function() {
                commentsPopup(feed, user_token);
            });

            let current_user_likes_feed = false;
            feed.likes.forEach(like => {
                if (like.userId == user_id) {
                    current_user_likes_feed = true;
                }
            })

            const userLikesFeedBtn = document.createElement("button");
            userLikesFeedBtn.classList.add(`${feed.id}userLikesBtn`);
            if (!current_user_likes_feed) {
                userLikesFeedBtn.textContent = `\u{2764}\u{FE0F}`;
            }
            else {
                userLikesFeedBtn.textContent = `\u2661`;
            }
            div.appendChild(userLikesFeedBtn);
            userLikesFeedBtn.addEventListener("click", function() {
                if (userLikesFeedBtn.textContent == `\u{2764}\u{FE0F}`) {
                    likeFeed(feed, true);
                    userLikesFeedBtn.textContent = `\u2661`;
                }
                else {
                    likeFeed(feed, false);
                    userLikesFeedBtn.textContent = `\u{2764}\u{FE0F}`;
                }

                
            });

            const commentInput = document.createElement(`input`);
            commentInput.type = `comment`;

            const commentLabel = document.createElement('label');
            commentLabel.textContent = 'Type Comment!: ';
            div.appendChild(commentLabel);
            div.appendChild(commentInput);

            const commentBtn = document.createElement('button');
            commentBtn.classList.add(`${feed.id}userCommentBtn`);
            commentBtn.textContent = 'Done Writing?';
            div.appendChild(commentBtn);
            commentBtn.addEventListener("click", function() {
                const comment = commentInput.value;
                if(comment.trim() === '') {
                    alert(`Comments cannot be empty`);
                    return;
                }
                writeComment(feed, comment);
                commentInput.value = '';
            })


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
            const creator = document.createElement("p");
            creator.classList.add("creator_id");
            creator.textContent = `Created by ${data.name}`;
            div.appendChild(creator);

            outputElement.appendChild(div);
            return data.name;
        })
        .catch(error => {
            customErrorPopup(`Error: ${error}`);
            throw new Error(`Error: ${error}`);
        })
        });
        return Promise.all(promises);
    })

    Promise.all([promise1, promise2])
    .then(([feeds, creatorName]) => {
        outputElement.style.display = "block";
    })
    .catch(error => {
        customErrorPopup(`Error: ${error}`);
        throw new Error(`Error: ${error}`);
    });
}

// User Profile Update form
const UpdateProfileForm = document.getElementById("UserUpdateProfile");
UpdateProfileForm.addEventListener("submit", function(event){
    event.preventDefault();
    const email = document.getElementById("updateEmail").value;
    const pd = document.getElementById("updatePD").value;
    const name = document.getElementById("updateName").value;
    const image = document.getElementById("updateImage");

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

    if (image.files.length > 0 && image.files[0].type.startsWith("image/")) {
        const imagePromise = fileToDataUrl(image.files[0])
        .then(dataURL => {
            data.image = dataURL;
        });

        const promise = new Promise((resolve, reject) => {
            fetch(url + "/user", {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${user_token}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((response) => {
                console.log(JSON.stringify(data));
                if (!response.ok) {
                    customErrorPopup(`Error: ${response.status}`);
                    throw new Error(`Error: ${response.status}`);
                }
            })
            .catch(error => {
                customErrorPopup(`Error: ${error}`);
                throw new Error(`Error: ${error}`);
            });
        })

        Promise.all([imagePromise, promise])
        .catch(error => {
            customErrorPopup(`Error: ${error}`);
            throw new Error(`Error: ${error}`);
        })
    }
    else {
        fetch(url + "/user", {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user_token}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if (!response.ok) {
                customErrorPopup(`Error: ${response.status}`);
                throw new Error(`Error: ${response.status}`);
            }
        })
        .catch(error => {
            customErrorPopup(`Error: ${error}`);
            throw new Error(`Error: ${error}`);
        });
    }
})

// Load User screen
function loadCurrentUserScreen() {
    loadUserScreen(user_id);
    const UserUpdateForm = document.getElementById("UserUpdateProfile");
    UserUpdateForm.style.display = "flex";

    const div = document.createElement("div");
    div.classList.add(`current_user_screen`);
    document.body.appendChild(div);
}

export function watch(user_email) {
    let data = {
        email: user_email,
        turnon: true
    }
    //const fetchURL = url + "/user/watch" + "?userId=" + user_id;
    const fetchURL = url + "/user/watch";
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
            alert("Watch Successful");
        }
        else{
            alert(`Watch was not successful.\nThis might be because you entered wrong email\nError: ${response.status}`);
        }
        
    })
    .catch(error => {
        customErrorPopup(`Watch was not successful.\nError: ${error}`);
        throw new Error(`Error: ${error}`);
    })
}

export function unwatch(user_email) {
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
            alert("Unwatch Successful");
        }
        else{
            alert(`Unwatch was not successful.\nThis might be because you entered wrong email\nError: ${response.status}`);
        }
    })
    .catch(error => {
        customErrorPopup(`Unwatch was not successful.\nError: ${error}`);
        throw new Error(`Error: ${error}`);
    })
}

export function loadUserScreen(userId) {
    const fetchURL1 = url + "/user?userId="+userId;

    const div = document.createElement("div");
    div.classList.add("Watching-Users");

    const button = document.createElement('button');
    button.className = 'userPageWatchB';
    button.textContent = 'Watch';
    div.appendChild(button);

    button.addEventListener("click", function() {
        const promise1 = new Promise((resolve, reject) => {
            fetch(url + "/user?userId="+userId, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${user_token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const userLikesList = data.watcheeUserIds;
                let resolved = {};
                resolved.email = data.email;
                let user_likes = false;
                userLikesList.forEach(userID => {
                    if(userID == user_id) {
                        user_likes = true;
                    }
                })
                resolved.like = user_likes;
                resolve(resolved);
            })
            .catch(error => {
                customErrorPopup(`Error: ${error}`);
                reject(error);
            })
        });
        const promise2 = promise1.then(data => {
            if (data.like) {
                unwatch(data.email);
            }
            else {
                watch(data.email);
            }
        })
        Promise.all([promise1, promise2])
        .catch(error => {
            customErrorPopup(`Error: ${error}`);
            throw new Error(`Error: ${error}`);
        })
    })

    const goBack = document.createElement('button');
    goBack.className = 'goBackBtn';
    goBack.id = "goBackBtn";
    goBack.textContent = 'Go back to the main page';
    div.appendChild(goBack);

    const feeds = document.createElement("div");
    feeds.id = "userProfileFeeds";
    feeds.style.display = 'block';

    goBack.addEventListener("click", function() {
        goBacktoMainScreen();
        goBack.style.display = 'none';
        button.remove();
        const chileFeed = feeds.querySelectorAll('div');
        chileFeed.forEach(div => div.remove());
        feeds.remove();
        
        const addBtn = document.getElementsByClassName("addFeedButton");
        for (let i = 0; i < addBtn.length; i++) {
            const childBtns = addBtn[i];
            childBtns.remove();
        }

        for (let i = 0; i < div.length; i++) {
            const child = div[i];
            child.remove();
        }

        const userInfo = document.getElementsByClassName("userInfo");
        for (let i = 0; i < userInfo.length; i++) {
            const child = userInfo[i];
            child.remove();
        }

        let watchingUsers = document.getElementsByClassName("Watching-Users")[0];
        watchingUsers.classList.remove("Watching-Users");

        div.remove();


        viewProfileForm.style.display = 'block';
    });
    
    outputElement.style.display = 'none';

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
            const div = document.createElement("div");
            div.classList.add(`userInfo`);
            document.body.appendChild(div);

            const userEmail = data.email;
            const userName = data.name;
            user_email = userEmail;
            const paragraph = document.createElement("p");
            paragraph.className = 'UserInfoP';
            const textNode = document.createTextNode(`User email: ${userEmail}, User name: ${userName}`);
            paragraph.appendChild(textNode);
            div.appendChild(paragraph);

            const feedslist = data.jobs;
            feedslist.forEach(f => {
                const userCreatedFeed = document.createElement("div");
                userCreatedFeed.id = 'userCreatedFeed';

                // Create and append image element
                const img = document.createElement("img");
                img.src = f.image;
                img.alt = f.description;
                img.classList.add("Feed-Image");
                userCreatedFeed.appendChild(img);

                //Title 
                const title = document.createElement("h3");
                title.textContent = f.title;
                userCreatedFeed.append(title);

                //Time posted
                const time = document.createElement("p");
                time.textContent = `Posted: ${TimeCalc(f.createdAt)}`;
                userCreatedFeed.append(time);

                // Starting Time
                const startingTime = document.createElement("p");
                startingTime.textContent = `Starting Date: ${TimePrettier(f.start)}`
                userCreatedFeed.append(startingTime);

                // Create and append description element
                const description = document.createElement("p");
                description.classList.add(`${f.id}description`);
                description.textContent = `Description: ${f.description}`;
                userCreatedFeed.appendChild(description);

                const numLikes = document.createElement("p");
                numLikes.textContent = `❤️: ${f.likes.length}`;
                userCreatedFeed.appendChild(numLikes);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = `Delete`;
                userCreatedFeed.appendChild(deleteBtn);

                deleteBtn.addEventListener('click', function() {
                    feeds.removeChild(userCreatedFeed);
                    deleteFeed(f);
                })

                const updateBtn = document.createElement('button');
                updateBtn.textContent = `Update`;
                userCreatedFeed.appendChild(updateBtn);

                updateBtn.addEventListener('click', function() {
                    updateFeedPopup(f).then((data => {
                        const imagePromise = fileToDataUrl(data.image);
                        imagePromise.then(dataURL => {
                            updateFeed(f, f.id, data.title, dataURL, data.description);
                            title.textContent = data.title;
                            img.src = dataURL;
                            description.textContent = `Description: ${data.description}`;
                        })
                    }));
                })


                const numComments = document.createElement("p");
                numComments.textContent = `Comments: ${f.comments.length}`;
                userCreatedFeed.appendChild(numComments);

                feeds.appendChild(userCreatedFeed);
            })
            document.body.appendChild(div);
            document.body.appendChild(feeds);
            resolve(data);
        })
        .catch(error => {
            customErrorPopup(`Error: ${error}`);
            reject(error);
        })
    });
    const promise2 = promise1.then(data => {
        const watcheeUserIds = data.watcheeUserIds;
        const h2 = document.createElement("h2");
        h2.className = 'WatchingUserH';
        h2.textContent = "This user is watched by: ";
        div.appendChild(h2);

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
                p.className = 'WatchingUserP';
                const textNode1 = document.createTextNode(`${data.name}`);
                p.appendChild(textNode1);
                div.appendChild(p);
            })
            .catch(error => {
                customErrorPopup(`Error: ${error}`);
                throw new Error(`Error: ${error}`);
            })
        });
        document.body.appendChild(div);
        return data;
    });

    Promise.all([promise1, promise2])
    .catch(error => {
        customErrorPopup(`Error: ${error}`);
        throw new Error(`Error: ${error}`);
    });
}

function addFeed(title, image, startingDate, description) {
    const [day, month, year] = startingDate.split('/');
    const isoDateString = `${year}-${month}-${day}T00:00:00.000Z`;
    const date = new Date(Date.parse(isoDateString));

    let data = {
        title: title,
        image: image,
        start: date,
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
        // Remove the current shown feeds and load again.
        if (outputElement.firstChild) {
            while(outputElement.firstChild) {
                outputElement.removeChild(outputElement.firstChild);
            }
        }
        feed_index = 0;
        loadFeeds();
        goBacktoMainScreen();
    })
    .catch(error => {
        customErrorPopup(`Error: ${error}`);
        throw new Error(`Error: ${error}`)
    })
}

function deleteFeed(feed) {
    if (feed.creatorId != user_id) {
        customErrorPopup(`Sorry, You are not a creator!`);
        throw new Error('User is not a creator');
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
        for (let i = 0; i < feed_to_be_deleted.length; i++) {
            feed_to_be_deleted[i].remove();
        }
    })
    .catch(error =>{
        customErrorPopup(`Error: ${error}`);
        throw new Error(`Error: ${error}`);
    })
}

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
        customErrorPopup(`Error: ${error}`);
        throw new Error(`Error: ${error}`);
    })
}

function writeComment(feed, comment){
    const fetchURL = url+'/job/comment';
    let data = {
        id: feed.id,
        comment: comment
    }
    fetch(fetchURL, {
        method: "POST",
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
        let current_comment = {
            userId: user_id,
            userEmail: user_email,
            userName: userName,
            comment: comment
        }
        alert(`Comment was successfully written!`);
        feed.comments.push(current_comment);
    })
    .catch(error => {
        customErrorPopup(`Error: ${error}`);
        throw new Error(`Error: ${error}`);
    })
}

function likeFeed(feed, likes) {
    const fetchURL = url+'/job/like';
    let data = {
        id: feed.id,
        turnon: likes
    }
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
        const likeBtn = document.getElementsByClassName(`${feed.id}likesBtn`);
        let l = {
            userId: user_id,
            userEmail: user_email,
            userName: userName
        }
        if (likes) {
            feed.likes.push(l);
        }
        else {
            const index = feed.likes.findIndex(like => like.userId === user_id);
            if (index !== -1) {
                feed.likes.splice(index, 1);
            }
        }
        likeBtn[0].textContent =  `❤️: ${feed.likes.length}`;
    })
    .catch(error => {
        customErrorPopup(`Error: ${error}`);
        throw new Error(`Error: ${error}`);
    })
}