// import { response } from "express";
import { getCookies } from "./utils.js";
import { getCookie } from "./utils.js";
import { getCSRFToken } from "./utils.js";
import { setCookie } from "./utils.js";


goToLogin.addEventListener('click', function () {
    window.location.href = 'http://127.0.0.1:8000/register/';
});

// Login form submit handler

// Login form submit handler
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login request via fetch
    fetch('http://127.0.0.1:8000/api/auth/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse response if successful
            } else {
                return response.json().then(data => {
                    clearPreviousErrorMessages(); // Clear previous errors
                    displayErrorMessages(data); // Show errors
                    throw new Error('Invalid credentials'); // Stop further execution
                });   
            }
        })
        .then(data => {
            // Store tokens in cookies
            setCookie('access_token', data.access, 1 / 1440); // 1-day expiration for access token
            setCookie('refresh_token', data.refresh, 7); // 7-day expiration for refresh token
            const userInfo = {
                user_id: data.user_id,
                username: data.username,
                email: data.email
            };
            setCookie('user_info', JSON.stringify(userInfo), 7); // 7-day expiration for user info
            // print(userInfo)
            // Redirect on success
            window.location.href = 'http://127.0.0.1:8000/';
        })
        .catch(error => {
            console.error('Error during login:', error); // Log the error for debugging
        });
});

// Function to clear previous error messages
function clearPreviousErrorMessages() {
    let registerErrorWrapper = document.getElementById("register-error-wrapper");
    registerErrorWrapper.innerHTML = "";
    registerErrorWrapper.style.display = "none";
}

// Function to display error messages
function displayErrorMessages(errors) {
    let registerErrorWrapper = document.getElementById("register-error-wrapper");
    registerErrorWrapper.style.display = "block";

    if (typeof errors === "string") {
        // Handle single error string
        registerErrorWrapper.innerHTML += `<div class="alert alert-danger" role="alert">${errors}</div>`;
    } else if (typeof errors === "object") {
        // Handle object with multiple error fields
        Object.keys(errors).forEach(key => {
            let errorMessages = errors[key];
            if (Array.isArray(errorMessages)) {
                errorMessages.forEach(message => {
                    registerErrorWrapper.innerHTML += `<div class="alert alert-danger" role="alert">${key}: ${message}</div>`;
                });
            } else {
                registerErrorWrapper.innerHTML += `<div class="alert alert-danger" role="alert">${key}: ${errorMessages}</div>`;
            }
        });
    }
}




window.addEventListener('load', () => {
    console.log('Page in login section fully loaded');
    const userInfo = getCookie('user_info');
    console.log(userInfo);  // Log the cookie value to see if it's correct
    
    // if (userInfo) {
    //     try {
    //         const user = JSON.parse(userInfo);
    //         const username = user.username;

    //         // Display the username in a specific element
    //         const usernameDisplay = document.getElementById('username-display');
    //         if (usernameDisplay) {
    //             usernameDisplay.textContent = `Welcome, ${username}!`;
    //         }
    //     } catch (error) {
    //         console.error('Error parsing user_info cookie:', error);
    //     }
    // }
});

// document.getElementById('login-form').addEventListener('submit', function (e) {
//     e.preventDefault(); // Prevent default form submission

//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     // Send login request via fetch
//     fetch('http://127.0.0.1:8000/api/auth/token/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password })
//     })
//         .then(response=>{
//             if(response.ok){
//                 return response.json();
//             }
//             else{
//                 return response.json().then(data=>{
//                     clearPreviousErrorMessages()
//                     displayErrorMessages(data)
//                     throw new Error('Invalid credentials');
//                 })
//             }
//         })
//         // .then(response => response.json())
//         .then(data => {
//             if (data.access) {
//                 // Store tokens in cookies
//                 setCookie('access_token', data.access, 1 / 1440); // 1-day expiration for access token
//                 setCookie('refresh_token', data.refresh, 7); // 7-day expiration for refresh token
//                 const userInfo = {
//                     user_id: data.user_id,
//                     username: data.username,
//                     email: data.email
//                 };
//                 setCookie('user_info', JSON.stringify(userInfo), 7); // 7-day expiration for user info

//                 window.location.href = 'http://127.0.0.1:8000/'; // Redirect on success
//             } else {
//                 // alert('Invalid credentials. Please try again.');
//                 return response.json().then(data => {
//                     clearPreviousErrorMessages(); // Clear any existing error messages
//                     for (const key in data) {
//                         if (Array.isArray(data[key])) {
//                             // If the value is an array, iterate through it
//                             data[key].forEach(message => displayErrorMessages(`${key}: ${message}`));
                            
//                         } else {
//                             // If the value is not an array, directly display it
//                             displayErrorMessages(`${key}: ${data[key]}`);
                            
//                         }
//                     }
//                 });
//             }
//         })
//         .catch(error => {
//             alert('Error during login: ' + error);
//         });
// });




// function clearPreviousErrorMessages() {
//     let registerErrorWrapper = document.getElementById("register-error-wrapper");
//     registerErrorWrapper.innerHTML = "";
// }


// function displayErrorMessages(errors) {
//     console.log("Displaying errors:", errors);

//     // Clear any previous error messages
//     clearPreviousErrorMessages();

//     let registerErrorWrapper = document.getElementById("register-error-wrapper");

//     registerErrorWrapper.style.display = "block";
//     if (typeof errors === "string") {
//          // Set the error message
          
//         // Handle a single error string
//         registerErrorWrapper.innerHTML += `<div class="alert alert-danger" role="alert">${errors}</div>`;
//     } else if (typeof errors === "object") {
//         // Handle object with multiple error fields
//         Object.keys(errors).forEach(key => {
//             let errorMessages = errors[key];
//             errorMessages.forEach(message => {
//                 registerErrorWrapper.innerHTML += `<div class="alert alert-danger" role="alert">${key}: ${message}</div>`;
//             });
//         });
//     }
// }
