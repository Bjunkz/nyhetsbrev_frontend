
//inputs
const userNameInput = document.querySelector("#uName");
const passwordInput = document.querySelector("#password");

let user = userNameInput.value.toLowerCase()
let pass = passwordInput.value.toLowerCase()


//buttons
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const createUserTemplateBtn = document.querySelector("#createUserTemplate");
const createUserBtn = document.querySelector("#createUser");

//logged in/out
const loggedOut = document.querySelector(".loggedOut");
const loggedIn = document.querySelector(".loggedIn");
const mainContent = document.querySelector("#mainContent");
const headerLogin = document.querySelector(".headerLogin")

//messages
const tjenare = document.querySelector("#tjenare");
const mainMessage = document.querySelector(".message");
const loginMessage = document.querySelector("#message");

//hämta localStorage
let storedUsers = JSON.parse(localStorage.getItem("users"))


// create new user template

const newUserTemplate = `<div class="loggedOut">
<input type="text" name="uName" id="createUserName" placeholder="Username"><br>
<input type="text" name="firstName" id="firstName" placeholder="first name"><br>
<input type="text" name="lastName" id="lastName" placeholder="last name"><br>
<input type="email" name="email" id="email" placeholder="Email"><br>
<input type="password" name="password" id="createPassword" placeholder="Password"><br>
<p>Do you want to recieve our newsletter?<input type="checkbox" name="newsletterBox" id="newsletterBox"></p>
<button id="createUser">Create new user</button><br>
<p id="createMessage"></p></div>
`
createUserTemplateBtn.addEventListener('click', () => {
mainContent.innerHTML = newUserTemplate
})

//skapa ny användare
window.addEventListener('click', function(e){
    if(e.target.id == "createUserTemplate"){
        headerLogin.classList.add("displayNone");
    }

    if(e.target.id == "createUser"){
        const createUserNameInput = document.querySelector("#createUserName");
        const createPasswordInput = document.querySelector("#createPassword");
        const createFirstName = document.querySelector("#firstName");
        const createLastName = document.querySelector("#lastName");
        const emailInput = document.querySelector("#email");
        const newsletterBox = document.querySelector("#newsletterBox")

            let newUser = {     firstName: `${createFirstName.value}`,
                                lastName: `${createLastName.value}`,
                                userName: `${createUserNameInput.value}`,
                                password:`${createPasswordInput.value}`,
                                email: `${emailInput.value}`,
                                newsletter: `${newsletterBox.checked== true ? true : false}`
                            }
                        console.log(newUser)
            fetch("https://nyhetsbrev-bjunkz.herokuapp.com/users/post", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newUser)
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        const createMessage = document.querySelector("#createMessage");
                        if (data=="success"){
                            createMessage.innerHTML = "User " + "<strong>" + user + "</strong> successfully created! press here to log in"
                            createMessage.style.color="black";
                            localStorage.setItem("loggedIn", userNameInput.value)
                            createMessage.addEventListener('click', () => {
                                createUserLogin()
                            })

                        } else {
                            createMessage.innerHTML = "User " + "<strong>" + user + "</strong> already exists"
                            createMessage.style.color="red";
                        }
                    })
      }
});


//create user handler

function createUserLogin(){
    mainContent.innerHTML = ""
    loggedIn.classList.toggle("displayNone");
    let user = localStorage.getItem("loggedIn");
    tjenare.innerHTML = "Tjenare " + user;
}
//logga in
loginBtn.addEventListener('click', function(){

    let userLogin = {userName: `${userNameInput.value}`,
                     password: `${passwordInput.value}`
                    }

    console.log(userLogin)


    fetch('https://nyhetsbrev-bjunkz.herokuapp.com/users/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(userLogin)
    })
    .then(res => res.json())
    .then(data =>  {    
        console.log(data)
            if (data.code == "success"){
                localStorage.setItem("loggedIn", userNameInput.value)
                login()
            } else if (data =="fail") {
                loginMessage.innerHTML = "Username and/or password is incorrect"
                loginMessage.style.color="red";
            }
    })

});

// funktion som körs när man loggar in och ut. ändrar DOMen
function login () {
    loggedOut.classList.toggle("displayNone");
    loggedIn.classList.toggle("displayNone");
    // mainMessage.classList.toggle("displayNone");
    let user = localStorage.getItem("loggedIn");
    tjenare.innerHTML = "Tjenare " + user;
    userObject = {userName: user}

// hämta och visa prenumerationsstatus
    fetch('https://nyhetsbrev-bjunkz.herokuapp.com/users/newsletterstatus', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(userObject)
    })
    .then(res => res.json())
    .then(data => {
        let status = data==true ? "du prenumererar på nyhetsbrevet" : "du prenumererar inte på nyhetsbrevet";
        mainContent.innerHTML = `
        <p>${status}</p><br>
        <button id="turnOff">Avsluta prenumeration<button>
        <button id="turnOn">Starta prenumeration<button>
        `;
    })

};

mainContent.addEventListener('click', (e) => {
        let user = localStorage.getItem("loggedIn");
        let  userObject = {userName: user}
        if(e.target.id == "turnOff" || e.target.id == "turnOn"){
            if(e.target.id=="turnOff"){
                userObject = {userName: user,
                                newsletter: false   
                            }
            } else if (e.target.id=="turnOn"){
                userObject = {userName: user,
                    newsletter: true    
                }
            }
    
            fetch('https://nyhetsbrev-bjunkz.herokuapp.com/users/newsletter', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(userObject)
            })
            .then(res => res.json())
            .then(data => {
                let status = data==true ? "du prenumererar på nyhetsbrevet" : "du prenumererar inte på nyhetsbrevet";
                mainContent.innerHTML = `
                <p>${status}</p><br>
                <button id="turnOff">Avsluta prenumeration<button>
                <button id="turnOn">Starta prenumeration<button>
                `;
            })
        }
   
    

})
// kör login om användaren är inloggad från localStorage
if (localStorage.getItem("loggedIn") !== null){
    login()
 };

//logga ut 
logoutBtn.addEventListener('click', function(){
    loggedOut.classList.toggle("displayNone");
    loggedIn.classList.toggle("displayNone");
    loginMessage.innerHTML = "";
    mainContent.innerHTML= "";
    localStorage.removeItem("loggedIn");

});