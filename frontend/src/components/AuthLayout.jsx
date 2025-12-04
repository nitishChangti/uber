import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Protected({ children, authentication = true }) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    const loading = useSelector((state) => state.auth.loading);

    console.log('authentication prop in auth layout', authentication)
    console.log('auth status from redux in auth layout', authStatus)

    const userAuth = JSON.parse(localStorage.getItem('userAuth'));
    const capAuth = JSON.parse(localStorage.getItem('capAuth'));


    // console.log('auth status in auth layout', authStatus,
    //     ' loading in auth layout', loading,
    //     ' authentication in auth layout', authentication)
    useEffect(() => {
        //TODO: make it more easy to understand

        // if (authStatus ===true){
        //     navigate("/")
        // } else if (authStatus === false) {
        //     navigate("/login")
        // }

        //let authValue = authStatus === true ? true : false

        if (loading) return   // 🚀 Wait until App.jsx finishes check

        if (authentication && authStatus !== authentication) {
            console.log("not authenticated user tried to access protected route ")
            if (userAuth) {
                navigate('/home')
            }
            else if (capAuth) {
                navigate('/captain-home')
            }
            else {
                navigate("/login")
            }
        } else if (!authentication && authStatus !== authentication) {
            console.log("authenticated user tried to access login or signup page")
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication, loading])

    return loader ? <h1>Loading...</h1> : <>{children}</>
    // Otherwise, render children
    // return <>{children}</>
}

export {
    Protected
}