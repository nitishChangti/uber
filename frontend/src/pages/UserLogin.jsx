import React from 'react'
import { logo } from '../assets/index'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { authService } from '../service/authService'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/authSlice'
import { connectSocket, disconnectSocket } from "../store/socketSlice.js";
const UserLogin = () => {
    const loading = useSelector((state) => state.auth.loading);
    console.log('loading in user login', loading)
    const authStatus = useSelector(state => state.auth.status)
    console.log('auth status in user login', authStatus)
    const { register, handleSubmit, setError, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onSubmit = async (data) => {
        try {
            console.log(data)
            const response = await authService.login(data.email, data.password)
            console.log(response)
            if (response.status === 200) {
                const userData = response.data.data.loggedInUser
                console.log(userData)
                dispatch(login(userData))
                localStorage.setItem('accessToken', JSON.stringify(response.data.data.accessToken));
                localStorage.setItem('userAuth', JSON.stringify(true))
                // ✅ Connect socket immediately after login
                dispatch(connectSocket(`${import.meta.env.VITE_BASE_URL }`));
                navigate('/home')

            }
            else {
                console.log(response.message)
                setError("root", { type: "manual", message: response.message })
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="relative min-h-screen flex flex-col  items-center bg-gradient-to-b from-white to-gray-100 px-5 py-7">
            {/* Uber Logo */}
            <div className="mb-8 w-full max-w-sm h-fit">
                <img className='w-20 mb-5' src={logo} alt="" />

                <form onSubmit={handleSubmit(onSubmit)} >
                    {/* Root-level error from backend */}
                    {errors.root && (
                        <p className="text-red-500 text-xs mb-4">{errors.root.message}</p>
                    )}

                    {/* Email Input */}
                    <label className="block mb-2 text-sm font-medium text-gray-700">What's your email</label>
                    <input
                        {...register('email', {
                            required: true,
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address"
                            }
                        })}
                        type="email"
                        name='email'
                        placeholder="email@example.com"
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-700">Enter Password</label>
                    <input
                        {...register('password', { required: true, minLength: 8 })}
                        type="password"
                        name='password'
                        placeholder="password"
                        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    {/* Login Button */}
                    <button className="w-full bg-black text-white py-3 rounded-md font-semibold text-base hover:opacity-90">
                        Login
                    </button>
                </form>

                {/* Link */}
                <p className="text-sm text-center text-gray-700 mt-4">
                    New here?{' '}
                    <Link to='/signup' className="text-blue-600 font-medium hover:underline">
                        Create new Account
                    </Link>
                </p>
            </div>

            {/* Captain Button */}
            <div className="w-full max-w-sm relative top-50">
                <Link to='/captain-login'>
                    <button className="w-full bg-green-600 text-white py-3 rounded-md font-semibold text-base hover:bg-green-700">
                        Sign in as Captain
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default UserLogin