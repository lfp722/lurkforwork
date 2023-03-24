import { BACKEND_PORT } from './config.js';
import { otherUserScreen } from './screen.js';
import { watch, unwatch } from './main.js';
const url = "http://localhost:" + String(BACKEND_PORT);

export function customErrorPopup(error) {
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
            link.style.color = 'blue';
            link.textContent = data.name;
            console.log(data);
            link.addEventListener('click', (event) => {
                event.preventDefault();
                popupWindow.close();
                otherUserScreen(data.id);
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
        //console.log(value);
        const user_name = value.userName;
        const link = popupWindow.document.createElement('a');
        link.style.color = 'blue';
        link.textContent = user_name;
        link.addEventListener('click', (event) => {
            event.preventDefault();
            popupWindow.close();
            otherUserScreen(value.userId);
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

    const form = document.createElement("form");

    const title = document.createElement("input");
    const image = document.createElement("input");
    const description = document.createElement("input");

    image.setAttribute("type", "file");
    image.setAttribute("accept", "image/jpeg");
    image.setAttribute("name", "image");

    const image_label = document.createElement("label");
    image_label.innerHTML = "Image: ";

    title.type = "text";
    title.name = "Title: ";
    title.value = feed.title;

    description.type = "text";
    description.name = "Description: ";
    description.value = feed.description;

    form.appendChild(title);
    form.appendChild(document.createElement("br"));
    form.appendChild(image_label);
    form.appendChild(image);
    form.appendChild(document.createElement("br"));
    form.appendChild(description);
    form.appendChild(document.createElement("br"));

    const submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Update!";

    form.appendChild(submitBtn);
    popupWindow.document.body.appendChild(form);
    popupWindow.document.body.appendChild(closeButton);

    const formPromise = new Promise((resolve) => {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const data = {
                title: title.value,
                image: image.files[0],
                description: description.value,
            };
                popupWindow.close();
                resolve(data);
        });
    });
    return formPromise;
}

export function watchUserByEmailPopup() {
    var popupWidth = 400;
    var popupHeight = 200;
    var screenLeft = (window.screen.width - popupWidth) / 2;
    var screenTop = (window.screen.height - popupWidth) / 2;
    var popupWindow = window.open("", "Update Feed", "width="+popupWidth + ",height="+popupHeight + ",left="+screenLeft+",top="+screenTop);

    const form = document.createElement("form");

    const email = document.createElement("input");
    const email_label = document.createElement("label");
    email_label.innerHTML = "User's Email: ";

    const watchDropdown = document.createElement("select");
    const watchOption = document.createElement("option");
    const unwatchOption = document.createElement("option");
    watchOption.value = "Watch";
    watchOption.text = "Watch";
    unwatchOption.value = "Unwatch";
    unwatchOption.text = "Unwatch";
    watchDropdown.add(watchOption);
    watchDropdown.add(unwatchOption);

    form.appendChild(email_label);
    form.appendChild(email);
    form.appendChild(watchDropdown);

    const submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Done!";

    form.appendChild(submitBtn);

    popupWindow.document.body.appendChild(form);

    form.addEventListener("submit", function(event) {
        if(watchDropdown.value === 'Watch') {
            watch(email.value);
        }
        else {
            unwatch(email.value);
        }
        popupWindow.close();
    })
}

export function createFeedPopup() {
    var popupWidth = 400;
    var popupHeight = 200;
    var screenLeft = (window.screen.width - popupWidth) / 2;
    var screenTop = (window.screen.height - popupWidth) / 2;
    var popupWindow = window.open("", "Create Feed", "width="+popupWidth + ",height="+popupHeight + ",left="+screenLeft+",top="+screenTop);

    const form = document.createElement("form");

    const title = document.createElement("input");
    const title_label = document.createElement("label");
    title_label.innerHTML = "Title: ";
    
    const image = document.createElement("input");
    image.setAttribute("type", "file");
    image.setAttribute("accept", "image/jpeg");
    image.setAttribute("name", "image");
    const image_label = document.createElement("label");
    image_label.innerHTML = "Image: ";

    const startingDate = document.createElement("input");
    const startingDate_label = document.createElement("label");
    startingDate_label.innerHTML = "Starting Date: ";
    
    const description = document.createElement("input");
    const description_label = document.createElement("label");
    description_label.innerHTML = "Description: ";
    
    title.type = "text";
    title.name = "title";

    startingDate.type = "text";
    startingDate.name = "startingDate";
    
    description.type = "text";
    description.name = "description";
    
    form.appendChild(title_label);
    form.appendChild(title);
    form.appendChild(document.createElement("br"));
    form.appendChild(image_label);
    form.appendChild(image);
    form.appendChild(document.createElement("br"));
    form.appendChild(startingDate_label);
    form.appendChild(startingDate);
    form.appendChild(document.createElement("br"));
    form.appendChild(description_label);
    form.appendChild(description);
    form.appendChild(document.createElement("br"));

    const submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Add Feed!";

    form.appendChild(submitBtn);
    popupWindow.document.body.appendChild(form);

    const formPromise = new Promise((resolve) => {
        form.addEventListener("submit", function(event) {
            const start = startingDate.value;
            const DatePattern = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!DatePattern.test(start)) {
                alert("Please enter a valid date in the format dd/mm/yyyy");
                popupWindow.close();
                return false;
            }
            event.preventDefault();

            const data = {
                title: title.value,
                image: image.files[0],
                startingDate: start,
                description: description.value,
            };
                popupWindow.close();
                resolve(data);
        });
    });
    return formPromise;
}
