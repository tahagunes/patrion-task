import LoginForm from "@/components/LoginForm"
import { useRouter } from 'next/router';

export default function Login() {
    const router = useRouter();
    const handleRegister = () => {
        // Navigate to the "/add-user" route when the button is clicked
        router.push('/add-user');

    }
    return (
        <div>
            <LoginForm />
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}