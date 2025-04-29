import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add Axios import

function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    const validateUsername = () => {
        setUsernameError('');
        if (!username) {
            setUsernameError('Username is required');
            return false;
        }

        const isCPF = /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/.test(username) || /^\d{11}$/.test(username);
        const isEmail = username.includes('@');

        if (isCPF) {
            if (!validateCPF(username)) {
                setUsernameError('Invalid CPF');
                return false;
            }
        } else if (isEmail) {
            if (!validateEmail(username)) {
                setUsernameError('Invalid Email');
                return false;
            }
        } else {
            setUsernameError('Please enter a valid CPF or Email');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsernameError('');
        setPasswordError('');
        setLoading(true);

        if (!password) {
            setPasswordError('Password is required');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://nodestart.onrender.com/Token/login', {
                nm_user: username,
                cd_pass: password,
            });

            const data = response.data;

            if (!data.rowCount || data.rowCount < 1) {
                throw new Error('Invalid login credentials');
            }

            if (data.rows[0].cd_pass !== password) {
                throw new Error('Invalid password');
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/sidebar'); // Redirect to sidebar page
        } catch (error) {
            setPasswordError(error.response?.data?.error || error.message || 'Login failed. Please try again.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
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
                    />
                    {usernameError && (
                        <div className="text-[#ff4d4d] text-sm mt-1 text-center">{usernameError}</div>
                    )}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Fixed bug
                        className="w-full p-4 mb-2 rounded-full text-black outline-none"
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
                        <a href="#" className="text-white hover:underline">
                            Forget Password?
                        </a>
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
                        <div className="absolute bottom-2 text-sm">Loading...</div>
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
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default Login;