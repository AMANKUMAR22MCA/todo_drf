import { getCookies } from "./utils.js";
import { getCookie } from "./utils.js";
import { getCSRFToken } from "./utils.js";
import { setCookie } from "./utils.js";





let accessToken = getCookie('access_token');


const loginSection = document.getElementById('loginSection');
goToLogin.addEventListener('click', function () {
    window.location.href = 'http://13.201.89.50:8000/login/';
});




// Handle form submission
document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Prepare the data to be sent
    const data = {
        username: username,
        email: email,
        password: password
    };

    // Send the form data via fetch
    fetch('http://13.201.89.50:8000/api/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
            // Include the CSRF token in the request header
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                alert('Registered successfully!');
                window.location.href = 'http://13.201.89.50:8000/login/';
            } else {
                return response.json().then(data => {
                    clearPreviousErrorMessages(); // Clear any existing error messages
                    for (const key in data) {
                        if (Array.isArray(data[key])) {
                            // If the value is an array, iterate through it
                            data[key].forEach(message => displayErrorMessages(`${key}: ${message}`));

                        } else {
                            // If the value is not an array, directly display it
                            displayErrorMessages(`${key}: ${data[key]}`);

                        }
                    }
                });
            }
        })


});



function clearPreviousErrorMessages() {
    let registerErrorWrapper = document.getElementById("register-error-wrapper");
    registerErrorWrapper.innerHTML = "";
}


function displayErrorMessages(errors) {
    console.log("Displaying errors:", errors);

    // Clear any previous error messages
    clearPreviousErrorMessages();

    let registerErrorWrapper = document.getElementById("register-error-wrapper");

    registerErrorWrapper.style.display = "block";
    if (typeof errors === "string") {
        // Set the error message

        // Handle a single error string
        registerErrorWrapper.innerHTML += `<div class="alert alert-danger" role="alert">${errors}</div>`;
    } else if (typeof errors === "object") {
        // Handle object with multiple error fields
        Object.keys(errors).forEach(key => {
            let errorMessages = errors[key];
            errorMessages.forEach(message => {
                registerErrorWrapper.innerHTML += `<div class="alert alert-danger" role="alert">${key}: ${message}</div>`;
            });
        });
    }
}
