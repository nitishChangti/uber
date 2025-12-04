import React from 'react'
import { logo } from '../assets/index'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as capLogin, logout as capLogout } from '../store/captainAuthSlice'
import { captainService } from '../service/captainService'
import { connectSocket, disconnectSocket } from "../store/socketSlice.js";
const CaptainSignIn = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try {
            console.log(data)
            const res = await captainService.login(data.email, data.password)
            console.log(res)

            if (res.status === 200) {
                console.log(res.data.data.captain)
                const captainData = res.data.data.captain
                console.log(captainData)
                dispatch(capLogin(captainData))
                 dispatch(connectSocket('http://localhost:5000'));
                navigate('/captain-home')
            }
            else {
                console.log(res.message)
                setError("root", { type: "manual", message: res.message })
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
                    <Link to='/captain-signup' className="text-blue-600 font-medium hover:underline">
                        Create new Account As Captain
                    </Link>
                </p>
            </div>

            {/* Captain Button */}
            <div className="w-full max-w-sm relative top-50">
                <Link to='/login'>
                    <button className="w-full bg-green-600 text-white py-3 rounded-md font-semibold text-base hover:bg-green-700">
                        Sign in as User
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default CaptainSignIn