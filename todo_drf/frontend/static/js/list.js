

import { getCookies } from "./utils.js";
import { getCookie } from "./utils.js";
import { getCSRFToken } from "./utils.js";
import { setCookie } from "./utils.js";


import { checkAccessToken } from "./tokenHandler.js";





var csrftoken = getCookie('csrftoken');
checkUserLogin()
var activeItem = null
var list_snapshot = []



await checkAccessToken()
let accessToken = getCookie('access_token');
console.log(accessToken);







buildList()

function buildList() {


    var wrapper = document.getElementById('list-wrapper')
    //wrapper.innerHTML = ''


    console.log("inside buid list function ")

    // let accessToken = getCookie('access_token');
    console.log(accessToken)
    const headers = {
        "X-CSRF-Token": csrftoken,
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`
    }

    // console.log('Access Token:', accessToken);
    var url = 'http://13.201.89.50:8000/api/task-list/'

    fetch(url, {
        headers: {
            "X-CSRF-Token": csrftoken,
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then((resp) => {
            return resp.json(); // Ensure you return the result of resp.json()
        })
        .then((data) => {
            // handleResponseAlert(data); // Now use the parsed JSON data
            console.log('Data:', data); // Logging the parsed data




            console.log(data)
            var list = data

            for (var i in list) {


                try {
                    document.getElementById(`data-row-${i}`).remove()
                } catch (err) {

                }



                var title = `<span class="title">${list[i].title}</span>`
                if (list[i].completed == true) {
                    title = `<strike class="title">${list[i].title}</strike>`
                }

                var item = `
                <div id="data-row-${i}" class="task-wrapper flex-wrapper">
                    <div style="flex:7">
                        ${title}
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-info edit">Edit </button>
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-dark delete">-</button>
                    </div>
                </div>

            `
                wrapper.innerHTML += item

            }

            if (list_snapshot.length > list.length) {
                for (var i = list.length; i < list_snapshot.length; i++) {
                    document.getElementById(`data-row-${i}`).remove()
                }
            }

            list_snapshot = list

            for (var i in list) {
                var editBtn = document.getElementsByClassName('edit')[i]
                var deleteBtn = document.getElementsByClassName('delete')[i]
                var title = document.getElementsByClassName('title')[i]

                editBtn.addEventListener('click', (() => {

                    let item = list[i]
                    return () => {
                        editItem(item)
                    }
                })())


                deleteBtn.addEventListener('click', (function (item) {
                    return function () {
                        deleteItem(item)
                    }
                })(list[i]))




                title.addEventListener('click', (function (item) {
                    return function () {
                        strikeUnstrike(item)
                    }
                })(list[i]))


            }



        })
}


var form = document.getElementById('form-wrapper')
form.addEventListener('submit', async function (e) {

    e.preventDefault()
    console.log('Form submitted')
    await checkAccessToken()
    accessToken = getCookie('access_token')
    console.log(accessToken);


    var url = 'http://13.201.89.50:8000/api/task-create/'
    let method = 'POST';


    // Check if we are editing an existing task
    if (activeItem != null) {
        url = `http://13.201.89.50:8000/api/task-update/${activeItem.id}/`;
        method = 'PUT';
        console.log('Updating task:', activeItem.id);  // Log the item being edited
    }

    var title = document.getElementById('title').value
    const headers = {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
        'Authorization': `Bearer ${accessToken}`
    };  // Include the access token
    console.log(headers);

    fetch(url, {
        method: method,  // We use POST for both create and update
        headers: headers,
        body: JSON.stringify({ 'title': title })  // Send the title in the body
    })
        .then(function (response) {
            if (response.ok) {
                // If the request was successful, rebuild the task list and reset the form
                buildList();
                document.getElementById('form').reset();
                activeItem = null;  // Reset activeItem after updating or creating
            } else {
                console.error('Failed to save task:', response.status);
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
});


function editItem(item) {
    checkAccessToken()
    console.log('Item clicked:', item)
    activeItem = item
    document.getElementById('title').value = activeItem.title
}

async function deleteItem(item) {
    await checkAccessToken()
    console.log('Delete clicked')
    fetch(`http://13.201.89.50:8000/api/task-delete/${item.id}/`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': `Bearer ${accessToken}`
        }
    }).then((response) => {
        buildList()
    })
}


function strikeUnstrike(item) {
    console.log('Strike clicked')

    item.completed = !item.completed
    fetch(`http://13.201.89.50:8000/api/task-update/${item.id}/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 'title': item.title, 'completed': item.completed })
    }).then((response) => {
        buildList()
    })
}



document.getElementById('logoutBtn').addEventListener('click', function () {
    // Later, you can add logic to handle the logout or redirect to the login page
    document.cookie = `access_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    document.cookie = `refresh_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    window.location.href = '/login/';  // Redirect to login page
});


function checkUserLogin() {
    if (getCookie("refresh_token") === null) {
        window.location.href = '/login/';
    }
}


const userInfo = getCookie('user_info');
console.log(userInfo);
if (userInfo) {
    try {
        const user = JSON.parse(userInfo);
        const username = user.username;

        // Display the username in a specific element
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = `Welcome, ${username}!`;
        }
    } catch (error) {
        console.error('Error parsing user_info cookie:', error);
    }
}
