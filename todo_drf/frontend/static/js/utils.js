
export function getCSRFToken() {
    const tokenField = document.querySelector('[name=csrfmiddlewaretoken]');
    if (tokenField) {
        return tokenField.value;
    }
    return getCookies('csrftoken');
}

// Function to get cookie value
export function getCookies(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Function to create, get, and erase cookies
export function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}

export function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) return decodeURIComponent(cookie.substring(nameEQ.length));
    }
    return null;
}
