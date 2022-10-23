import { getAuth, signOut } from 'firebase/auth';
import type { NextPage } from 'next';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { app } from '../firebase/config';

const Home: NextPage = () => {
  const [user, setUser] = useState<any>()
  
  useEffect(() => {
    getAuth(app).onAuthStateChanged((user) => {
      if(user) {
        setUser(user)
      }
    })
  }, [])

  return (
    <div>
      {user 
      ? 
      <div>
        <button onClick={() => Router.push("/manager")}>Manager</button>
        <p>{user.uid}</p>
        <p>{user.email}</p>
        <button onClick={() => {signOut(getAuth(app)); Router.push("/signIn")}}> Sair </button>
      </div>
      :
      <div>
        <button onClick={() => Router.push("/signIn")}> Entrar </button>
        <button onClick={() => Router.push("/signUp")}> Criar conta </button>
      </div>
      }
    </div>
  )
}

export default Home
