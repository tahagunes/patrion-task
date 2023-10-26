import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '../utils/auth';

const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleChange = (event) => {
        if (event.target.name === 'email') {
            setEmail(event.target.value);
        } else if (event.target.name === 'password') {
            setPassword(event.target.value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Wait for the loginUser promise to resolve
            const token = await loginUser(email, password);
            if (token) {
                // Redirect to /home
                router.push('/home');
            }
            else {
                //if user cant login
                return
            }

        } catch (error) {
            // Handle any errors from loginUser, e.g., display an error message
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default LoginForm;
