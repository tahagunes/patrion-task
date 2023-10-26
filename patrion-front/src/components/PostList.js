import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function PostList() {
    const [posts, setPosts] = useState([]);
    const userEmail = Cookies.get('user_email'); // Get the user's email from the cookie
    const [editablePostId, setEditablePostId] = useState(null); // Track the editable post

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
                        setPosts(data);
                    })
                    .catch((error) => {
                        console.error('Error fetching posts:', error);
                    });
            }
        });
    }, []);


    // Function to handle post editing
    const handleEditPost = (postId) => {
        // Set the post ID being edited
        setEditablePostId(postId);
    }

    // Function to cancel editing
    const handleCancelEdit = () => {
        setEditablePostId(null);
    }
    // Function to handle title changes
    const handleTitleChange = (post, event) => {
        // Make a copy of the current posts array
        const updatedPosts = [...posts];
        // Find the index of the post in the array
        const index = updatedPosts.findIndex((p) => p._id === post._id);
        // Update the title of the post in the copy
        updatedPosts[index].title = event.target.value;
        // Update the state with the modified array
        setPosts(updatedPosts);
    }
    // Function to handle intro changes
    const handleIntroChange = (post, event) => {
        // Make a copy of the current posts array
        const updatedPosts = [...posts];
        // Find the index of the post in the array
        const index = updatedPosts.findIndex((p) => p._id === post._id);
        // Update the intro of the post in the copy
        updatedPosts[index].intro = event.target.value;
        // Update the state with the modified array
        setPosts(updatedPosts);
    }

    // Function to handle body changes
    const handleBodyChange = (post, event) => {
        // Make a copy of the current posts array
        const updatedPosts = [...posts];
        // Find the index of the post in the array
        const index = updatedPosts.findIndex((p) => p._id === post._id);
        // Update the body of the post in the copy
        updatedPosts[index].body = event.target.value;
        // Update the state with the modified array

        setPosts(updatedPosts);
    }
    useEffect(() => {
        // Fetch and set posts as before
        fetchPosts();
    }, []);

    // Function to fetch and set posts
    const fetchPosts = () => {
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
                        setPosts(data);
                    })
                    .catch((error) => {
                        console.error('Error fetching posts:', error);
                    });
            }
        });
    };
    // Function to handle saving the edited post
    const handleSavePost = (post) => {
        const apiUrl = `http://localhost:5000/update-post/${post._id['$oid']}`; // Update the API URL accordingly
        const updatedPost = {
            title: post.title,
            intro: post.intro,
            body: post.body,
        };


        import('js-cookie').then((module) => {
            const accessToken = module.default.get('access_token');
            if (accessToken) {

                console.log(updatedPost)
                fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // You need to define accessToken
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedPost),
                })
                    .then((response) => {
                        if (response.ok) {
                            // If the request is successful, remove the post from editable state
                            handleCancelEdit();
                            fetchPosts();
                            // You can also refresh the post list to get the updated data
                            // Fetch and set posts again
                        } else {
                            console.error('Error updating post:', response);
                        }
                    })
                    .catch((error) => {
                        console.error('Error updating post:', error);
                    });
            }
        });
    }
    return (
        <div>
            {posts.map((post) => (
                <div key={post._id}>
                    <h2>Title: {post.title}</h2>
                    <p>Intro: {post.intro}</p>
                    <p>Body: {post.body}</p>
                    <p>Owner Name: {post.owner_info.name}</p>
                    <p>Owner Email: {post.owner_info.email}</p>
                    <p>Creation Date: {new Date(post.creation_date).toLocaleString()}</p>

                    {post.owner_info.email === userEmail && (
                        <>
                            {editablePostId === post._id ? (
                                <>
                                    <h2>Edit Title: <input type="text" value={post.title} onChange={(e) => handleTitleChange(post, e)} /></h2>
                                    <p>Edit Intro: <input type="text" value={post.intro} onChange={(e) => handleIntroChange(post, e)} /></p>
                                    <p>Edit Body: <textarea value={post.body} onChange={(e) => handleBodyChange(post, e)} /></p>
                                    <button onClick={() => handleSavePost(post)}>Save</button>
                                    <button onClick={handleCancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEditPost(post._id)}>Edit</button>
                                </>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default PostList;


