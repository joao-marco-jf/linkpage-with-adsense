import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { NextPage } from "next";
import Router from "next/router";
import React from "react";
import { app } from "../firebase/config";

const SignUp: NextPage = () => {

    const HandleSubmit = (event: any) => {
        event.preventDefault()
        const email = event.target.email.value
        const password = event.target.password.value
        createUserWithEmailAndPassword(getAuth(app), email, password).then((userCredential) => {
            Router.push("/")
        })
        .catch((error) => {
            signInWithEmailAndPassword(getAuth(app), email, password).then((userCredential) => {
                Router.push("/")
            })
        })
    }

    return(
        <div>
            <h2>Criar uma conta</h2>
            <form onSubmit={HandleSubmit}>
                <label>Email</label>
                <input name="email" type={"email"} placeholder={"user@email.com"} required autoComplete={"email"}/>
                <label>Password</label>
                <input name="password" type={"password"} placeholder={"Senha"} required autoComplete={"current-password"}/>
                <input type={"submit"} value="Create account"/>
            </form>
        </div>
    )
}

export default SignUp