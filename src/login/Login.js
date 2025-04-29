import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Note: To resolve the babel-preset-react-app dependency warning, run:
// npm install --save-dev @babel/plugin-proposal-private-property-in-object
// or
// yarn add --dev @babel/plugin-proposal-private-property-in-object

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsernameError('');
        setPasswordError('');
        setLoading(true);

        // Validate username
        if (!username) {
            setUsernameError('Username is required');
            setLoading(false);
            return;
        }

        // Validate password
        if (!password) {
            setPasswordError('Password is required');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://nodestart.onrender.com/Token/login', {
                nm_user: username,
                cd_pass: password,
            });

            const data = response.data;

            if (!data.rowCount || data.rowCount < 1) {
                throw new Error('Invalid login credentials');
            }

            // WARNING: Comparing plaintext passwords is insecure.
            // The backend should hash passwords (e.g., using bcrypt) and compare hashes.
            if (data.rows[0].cd_pass !== password) {
                throw new Error('Invalid password');
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/sidebar'); // Redirect to sidebar page
        } catch (error) {
            setPasswordError(
                error.response?.data?.error || error.message || 'Login failed. Please try again.'
            );
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder for password reset logic
    const handleForgotPassword = () => {
        // Implement your password reset logic here (e.g., open a modal, navigate to a reset page, etc.)
        console.log('Forgot password clicked');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4a90e2] to-[#2a5db0]">
            <div className="flex w-[800px] h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Login Section */}
                <div className="w-1/2 p-10 bg-[#4a90e2] text-white flex flex-col justify-center items-center relative">
                    <h1 className="text-3xl font-bold mb-8">WELCOME</h1>
                    <input
                        type="text"
                        placeholder="Digite seu Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-4 mb-2 rounded-full text-black outline-none"
                        aria-label="Username"
                    />
                    {usernameError && (
                        <div className="text-[#ff4d4d] text-sm mt-1 text-center">{usernameError}</div>
                    )}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 mb-2 rounded-full text-black outline-none"
                        aria-label="Password"
                    />
                    {passwordError && (
                        <div className="text-[#ff4d4d] text-sm mt-1 text-center">{passwordError}</div>
                    )}
                    <div className="flex justify-between w-full mb-2 text-sm">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="mr-2"
                            />
                            Remember
                        </label>
                        <button
                            onClick={handleForgotPassword}
                            className="text-white hover:underline bg-transparent border-none cursor-pointer"
                        >
                            Forget Password?
                        </button>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full p-4 rounded-full text-white font-semibold ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#34c759] hover:bg-[#2eb54d]'
                        }`}
                    >
                        SUBMIT
                    </button>
                    {loading && (
                        <div className="absolute bottom-2 text-sm flex items-center">
                            <svg
                                className="animate-spin h-5 w-5 mr-2"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="white"
                                    strokeWidth="4"
                                    fill="none"
                                />
                            </svg>
                            Loading...
                        </div>
                    )}
                </div>
                {/* Illustration Section */}
                <div className="w-1/2 bg-[#f5f7fa] flex items-center justify-center">
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url('https://static.vecteezy.com/ti/vetor-gratis/p1/29898995-placa-dentro-para-conta-do-utilizador-autorizacao-conecte-se-autenticacao-pagina-conceito-smartphone-com-conecte-se-e-senha-formato-pagina-em-tela-estoque-ilustracao-vetor.jpg')",
                        }}
                        aria-hidden="true"
                    ></div>
                </div>
            </div>
        </div>
    );
}


export default Login;