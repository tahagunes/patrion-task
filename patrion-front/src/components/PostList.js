import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function PostList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Dynamic import to ensure that this code only runs on the client
        import('js-cookie').then((module) => {
            const accessToken = module.default.get('access_token');
            if (accessToken) {
                const apiUrl = 'http://localhost:5000/posts'; // Update the API URL accordingly

                fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json', // Adjust as needed
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error('Network response was not ok');
                        }
                    })
                    .then((data) => {
                        console.log("data", data)
                        setPosts(data);
                    })
                    .catch((error) => {
                        console.error('Error fetching posts:', error);
                    });
            }
        });
    }, []);

    return (
        <div>
            {posts.map((post) => (
                <div key={post.id}>
                    <h2>Title: {post.title}</h2>
                    <p>Intro: {post.intro}</p>
                    <p>Body: {post.body}</p>
                </div>
            ))}
        </div>
    );
}

export default PostList;
