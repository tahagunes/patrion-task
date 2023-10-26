import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddPost() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [intro, setIntro] = useState('');
    const [body, setBody] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Prepare the data to send
        const postData = {
            title,
            intro,
            body,
        };
        import('js-cookie').then((module) => {
            const accessToken = module.default.get('access_token');
            if (accessToken) {
                const apiUrl = 'http://localhost:5000/add-post'; // Update the API URL accordingly

                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json', // Adjust as needed
                    },
                    body: JSON.stringify(postData),
                })
                    .then((response) => {
                        if (response.ok) {
                            // Handle success here, e.g., clear the form or show a success message
                            setTitle('');
                            setIntro('');
                            setBody('');
                router.push('/home');
                            
                        } else {
                            // Handle errors here, e.g., show an error message
                            console.error('Error adding post:', response);
                        }
                    })                    
                    .catch((error) => {
                        console.error('Error fetching posts:', error);
                    });
            }
        });
    }

    return (
        <div>
            <p>Add Post</p>
            <form onSubmit={handleFormSubmit}>
                <label>Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <br />
                <label>Intro:
                    <input type="text" value={intro} onChange={(e) => setIntro(e.target.value)} />
                </label>
                <br />
                <label>Body:
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
