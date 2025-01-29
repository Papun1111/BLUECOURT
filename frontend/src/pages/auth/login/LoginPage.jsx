import { useState } from 'react';
import { Link } from 'react-router-dom';

import XSvg from '../../../components/svgs/X';

import { MdOutlineMail, MdPassword } from 'react-icons/md';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isError = false;

    return (
        <div className='w-full h-screen flex animate-fadeIn'>
            <div className='flex-1 hidden lg:flex items-center justify-center bg-blue-900'>
                <XSvg className='lg:w-2/3 fill-current text-white' />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center bg-blue-800'>
                <form className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border border-blue-200' onSubmit={handleSubmit}>
                    <XSvg className='w-24 lg:hidden fill-current text-blue-500' />
                    <h1 className='text-4xl font-extrabold text-blue-900'>{"Let's"} go.</h1>
                    <div className='space-y-4'>
                        <label className='flex items-center gap-2 border p-3 rounded-lg border-blue-500 hover:border-blue-700 transition duration-300'>
                            <MdOutlineMail className='text-xl text-blue-500' />
                            <input
                                type='text'
                                className='flex-1 outline-none bg-transparent'
                                placeholder='Username'
                                name='username'
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                        <label className='flex items-center gap-2 border p-3 rounded-lg border-blue-500 hover:border-blue-700 transition duration-300'>
                            <MdPassword className='text-xl text-blue-500' />
                            <input
                                type='password'
                                className='flex-1 outline-none bg-transparent'
                                placeholder='Password'
                                name='password'
                                onChange={handleInputChange}
                                value={formData.password}
                            />
                        </label>
                    </div>
                    <button className='w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300'>Login</button>
                    {isError && <p className='text-red-500 text-center'>Something went wrong</p>}
                </form>
                <div className='mt-4 text-white'>
                    <p>{"Don't"} have an account?</p>
                    <Link to='/signup'>
                        <button className='w-full py-3 mt-2 text-blue-600 bg-transparent border border-blue-600 rounded-lg hover:bg-blue-700 hover:text-white transition duration-300'>Sign up</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
