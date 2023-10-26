import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddUser() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const apiUrl = 'http://localhost:5000/add-user'; // Update the API URL accordingly

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Prepare the data to send
        const userData = {
            name,
            email,
            pwd,
        };
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Adjust as needed
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (response.ok) {
                    // Handle success here, e.g., clear the form or show a success message                           
                    router.push('/login');

                } else {
                    // Handle errors here, e.g., show an error message
                    console.error('Error adding user:', response);
                }
            })
            .catch((error) => {
                console.error('Error adding user:', error);
            });

    }

    return (
        <div>
            <p>Add User</p>
            <form onSubmit={handleFormSubmit}>
                <label>Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br />
                <label>Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <br />
                <label>Password:
                    <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
