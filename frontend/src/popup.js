import { BACKEND_PORT } from './config.js';
import { otherUserScreen } from './screen.js';
const url = "http://localhost:" + String(BACKEND_PORT);

export function loginError(error) {
    var popupWidth = 400;
    var popupHeight = 200;
    var screenLeft = (window.screen.width - popupWidth) / 2;
    var screenTop = (window.screen.height - popupWidth) / 2;
    var popupWindow = window.open("", "Error", "width="+popupWidth + ",height="+popupHeight + ",left="+screenLeft+",top="+screenTop);
    popupWindow.document.write("<p>" + error + "<p/>");

    var closeButton = popupWindow.document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", function() {
        popupWindow.close();
    });
    popupWindow.document.body.appendChild(closeButton);
}

export function commentsPopup(feed, user_token) {
    let comments = feed.comments;
    let promises = [];

    var popupWidth = 400;
    var popupHeight = 200;
    var screenLeft = (window.screen.width - popupWidth) / 2;
    var screenTop = (window.screen.height - popupWidth) / 2;
    var popupWindow = window.open("", "Error", "width="+popupWidth + ",height="+popupHeight + ",left="+screenLeft+",top="+screenTop);

    const header = document.createElement('h2');
    header.textContent = `Current Comments: ${feed.comments.length}`;
    popupWindow.document.body.appendChild(header);

    const likesList = document.createElement("ul");
    likesList.classList.add("LikesList");

    comments.forEach(c => {
        let fetchURL = url + "/user?userId=" + c.userId;
        let promise = fetch(fetchURL, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user_token}`,
                'Content-Type': 'application/json'
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
        .then(data=>{
            const link = popupWindow.document.createElement('a');
            link.textContent = data.name;
            link.addEventListener('click', (event) => {
                event.preventDefault();
                popupWindow.close();
                otherUserScreen();
            });
            const comment = popupWindow.document.createElement('p');
            comment.appendChild(link);
            comment.appendChild(popupWindow.document.createTextNode(`: ${c.comment}`));
            popupWindow.document.body.appendChild(comment);
        })
        .catch(error => {
            console.log(error);
        })
        promises.push(promise);
    })
    Promise.all(promises)
    .catch(error => {
        console.log('One or more promises rejected');
        console.error(error);
    });

    var closeButton = popupWindow.document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", function() {
        popupWindow.close();
    });
    popupWindow.document.body.appendChild(closeButton);
}

export function likesPopup(feed) {
    let likes = feed.likes;

    var popupWidth = 400;
    var popupHeight = 200;
    var screenLeft = (window.screen.width - popupWidth) / 2;
    var screenTop = (window.screen.height - popupWidth) / 2;
    var popupWindow = window.open("", "Error", "width="+popupWidth + ",height="+popupHeight + ",left="+screenLeft+",top="+screenTop);

    const likesList = document.createElement("ul");
    likesList.classList.add("LikesList");

    Object.entries(likes).forEach((l) => {
        const value = l[1];
        const user_name = value.userName;
        const someUrl = "http://localhost:"+5000;
        const link = popupWindow.document.createElement('a');
        link.href = someUrl;
        link.textContent = user_name;
        link.addEventListener('click', (event) => {
            event.preventDefault();
            popupWindow.close();
            window.location.href = someUrl;
            otherUserScreen();
        });
        const comment = popupWindow.document.createElement('p');
        comment.appendChild(link);
        comment.appendChild(popupWindow.document.createTextNode('\u{2764}\u{FE0F}'));
        popupWindow.document.body.appendChild(comment);
    });

    var closeButton = popupWindow.document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", function() {
        popupWindow.close();
    });
    popupWindow.document.body.appendChild(closeButton);
}

export function updateFeedPopup(feed) {
    var popupWidth = 400;
    var popupHeight = 200;
    var screenLeft = (window.screen.width - popupWidth) / 2;
    var screenTop = (window.screen.height - popupWidth) / 2;
    var popupWindow = window.open("", "Update Feed", "width="+popupWidth + ",height="+popupHeight + ",left="+screenLeft+",top="+screenTop);

    var closeButton = popupWindow.document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", function() {
        popupWindow.close();
    });
    popupWindow.document.body.appendChild(closeButton);

    const form = document.createElement("form");

    const title = document.createElement("input");
    const image = document.createElement("input");
    const description = document.createElement("input");

    title.type = "text";
    title.name = "Title: ";
    title.value = feed.title;

    image.type = "text";
    image.name = "Image: ";
    image.value = feed.image;

    description.type = "text";
    description.name = "Description: ";
    description.value = feed.description;

    form.appendChild(title);
    form.appendChild(image);
    form.appendChild(description);

    const submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Update!";

    form.appendChild(submitBtn);
    popupWindow.document.body.appendChild(form);

    const formPromise = new Promise((resolve) => {
        form.addEventListener("submit", function(event) {
        event.preventDefault();
        const data = {
            title: title.value,
            image: image.value,
            description: description.value,
        };
            popupWindow.close();
            resolve(data);
        });
    });
    return formPromise;
}

export function createFeedPopup() {
    var popupWidth = 400;
    var popupHeight = 200;
    var screenLeft = (window.screen.width - popupWidth) / 2;
    var screenTop = (window.screen.height - popupWidth) / 2;
    var popupWindow = window.open("", "Update Feed", "width="+popupWidth + ",height="+popupHeight + ",left="+screenLeft+",top="+screenTop);

    var closeButton = popupWindow.document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", function() {
        popupWindow.close();
    });
    popupWindow.document.body.appendChild(closeButton);

    const form = document.createElement("form");

    const title = document.createElement("input");
    const image = document.createElement("input");
    const description = document.createElement("input");

    title.type = "text";
    title.name = "Title: ";
    title.value = '';

    image.type = "text";
    image.name = "Image: ";
    image.value = ``;

    description.type = "text";
    description.name = "Description: ";
    description.value = '';

    form.appendChild(title);
    form.appendChild(image);
    form.appendChild(description);

    const submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Add Feed!";

    form.appendChild(submitBtn);
    popupWindow.document.body.appendChild(form);

    const formPromise = new Promise((resolve) => {
        form.addEventListener("submit", function(event) {
        event.preventDefault();
        const data = {
            title: title.value,
            image: image.value,
            description: description.value,
        };
            popupWindow.close();
            resolve(data);
        });
    });
    return formPromise;
}
