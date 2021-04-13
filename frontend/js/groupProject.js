const url = "https://us-central1-webfinalgroup.cloudfunctions.net/app/groupProject";

function submitForm() {
    let user = document.getElementById("usernameID").value;
    let pass = document.getElementById("passwordID").value;
    let jsonObj = {"userid":user, "password":pass};
    let jsonStr = JSON.stringify(jsonObj);

    let loginMessage = document.getElementsByClassName("loginMessage")[0];
    loginMessage.innerHTML = "";
    loginMessage.style.opacity = 1;
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let loginMessage = document.getElementsByClassName("loginMessage")[0];
            let data = JSON.parse(this.responseText);

            if (data[0].count == 1) {
                window.location.replace("https://adrian-esau.com/workspace/projects/groupProject/main.html");
            }
            else {
                loginMessage.innerHTML = "Incorrect username or password";
                loginMessage.style.opacity = 1;
                setInterval(function () {
                    if (loginMessage.style.opacity > 0) {
                        loginMessage.style.opacity -= 0.1;
                    }
                }, 200);
            }
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(jsonStr);
}