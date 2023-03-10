
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