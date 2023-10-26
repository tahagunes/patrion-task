import axios from 'axios';
import Cookies from 'js-cookie';

export const loginUser = async (email, password) => {
    console.log("geldi")
    console.log("bum")
    const pwd = password
    const { data } = await axios.post('http://localhost:5000/login', { email, pwd });
    if (data.access_token) {  
        Cookies.set('access_token', data.access_token);
        Cookies.set('user_email', email);      

    }

    //it returns access token if its correct
    return data.access_token;
}