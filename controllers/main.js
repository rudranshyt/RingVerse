function getUserInput() {
    redirectFunction(document.getElementById("input").value);
}
function redirectFunction(username) {
    window.location.href =
      "templates/ringverse.html?username=" + encodeURI(username);
}