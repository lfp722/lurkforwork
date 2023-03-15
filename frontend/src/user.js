import { BACKEND_PORT } from './config.js';
const url = "http://localhost:" + String(BACKEND_PORT);

export function getUserName(userId, user_token) {
    const fetchURL = url + "/user?userId="+userId;
    fetch(fetchURL, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${user_token}`,
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        else {
            return response.json();
        }
    })
    .then(data => {
        console.log(data);
        //resolve(data.name);
        return data.namel
    })
    .catch(error => {
        //console.log(error);
        reject(error);
    })
}