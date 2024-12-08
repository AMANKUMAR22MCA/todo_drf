
import { getCookies } from "./utils.js";
import { getCookie } from "./utils.js";
import { getCSRFToken } from "./utils.js";
import { setCookie } from "./utils.js";


// Check if the token is expired and refresh it if needed
export async function checkAccessToken() {

    let accessToken = getCookie('access_token');
    // const refreshToken = getCookie('refresh_token');
    console.log(accessToken)
    if (accessToken === null) {
        const refreshToken = getCookie('refresh_token');
        if (!refreshToken) {
            console.log(accessToken)
            alert('Session expired. Please log in again.');
            window.location.href = '/login';

            return null;
        }

        try {
            const response = await fetch('http://13.201.89.50:8000/api/auth/token/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setCookie('access_token', data.access, 1 / 1440); // Short-lived token
                console.log(accessToken)
                return data.access;
            } else {
                console.log(accessToken)
                alert('Failed to refresh session. Please log in again.');
                window.location.href = '/login';
                return null;
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
            alert('Failed to refresh session. Please log in again.');
            window.location.href = '/login';
            return null;
        }
    }

    return accessToken;
}

// module.exports = checkAccessToken