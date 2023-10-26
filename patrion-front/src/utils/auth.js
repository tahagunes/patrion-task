import axios from 'axios';
export const loginUser = async (email,password) => {
    const pwd = password
    const {data} = await axios.post('http://localhost:5000/login',{email,pwd});
    //it returns access token if its correct
    console.log(data);
}