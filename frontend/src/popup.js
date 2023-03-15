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

export function likesPopup(feed, user_token) {
    let comments = feed.comments;
    let promises = [];

    var popupWidth = 400;
    var popupHeight = 200;
    var screenLeft = (window.screen.width - popupWidth) / 2;
    var screenTop = (window.screen.height - popupWidth) / 2;
    var popupWindow = window.open("", "Error", "width="+popupWidth + ",height="+popupHeight + ",left="+screenLeft+",top="+screenTop);

    var closeButton = popupWindow.document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", function() {
        popupWindow.close();
    });
    popupWindow.document.body.appendChild(closeButton);

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
            const someUrl = "http://localhost:"+5000; // replace with your URL
            const link = popupWindow.document.createElement('a');
            link.href = someUrl;
            link.textContent = data.name;
            link.addEventListener('click', (event) => {
                event.preventDefault();
                popupWindow.close();
                window.location.href = someUrl;
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
}