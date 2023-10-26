import PostList from '../components/PostList';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Home() {
    const router = useRouter();

    const handleLogout = () => {
        // Remove the access_token cookie
        Cookies.remove('access_token');

        // Redirect to the login page
        router.push('/login'); // Replace '/login' with the actual URL of your login page
    };

    const handleAddPost = () => {
        router.push('/add-post');
    }

    return (
        <div>
            <p>Posts</p>
            <button onClick={handleLogout}>Log out</button>
            <button onClick={handleAddPost}>Add post</button>
            <PostList />
        </div>
    );
}
