import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NextPage } from "next";
import Router  from "next/router";
import React from "react";
import { app } from "../firebase/config";

const SignIn: NextPage = () => {

    const HandleSubmit = (event: any) => {
        event.preventDefault()
        const email = event.target.email.value
        const password = event.target.password.value
        signInWithEmailAndPassword(getAuth(app), email, password).then((userCredential) => {
            Router.push("/")
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(errorCode, errorMessage)
        })
    }
    
    return (
        <div>
            <h2>Entrar em uma conta</h2>
            <form onSubmit={HandleSubmit}>
                <label>Email</label>
                <input name="email" type={"email"} placeholder={"user@email.com"} required autoComplete={"email"}/>
                <label>Password</label>
                <input name="password" type={"password"} placeholder={"Senha"} required autoComplete={"current-password"}/>
                <input type={"submit"} value="Sign In"/>
            </form>
        </div>
    )
}

export default SignIn