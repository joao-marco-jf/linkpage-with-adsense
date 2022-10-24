import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, where } from "firebase/firestore";
import { NextPage } from "next";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { app, db } from "../../firebase/config";

const Manager: NextPage = () => {
    const [pages, setPages] = useState<any>([])
    const [user, setUser] = useState<any>()

    const getData = async () => {
        getAuth(app).onAuthStateChanged(async (user) => {
            if(user) {
                setUser(user)
                
                const email = user?.email

                const q = query(collection(db, "pages"), where("user.email", "==", email));
                const querySnap = await getDocs(q)
                setPages(querySnap.docs)
            }
        })
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <button onClick={() => Router.push("/")}>Voltar</button>
            {pages.map((page: any, index: any) => (
                <div key={index}>
                    <a href={`/manager/${page?.id}`}>{page?.data().pageName}</a>
                </div>
            ))}
            <form onSubmit={async(event : any) => {
                event.preventDefault()

                const q = query(collection(db, "pages"), where("pageName", "==", event.target.input.value))
                const querySnapshot = await getDocs(q)

                const docData = {
                    pageName : event.target.input.value,
                    data : [],
                    user : {
                        email: user?.email
                    }
                }

                if(querySnapshot.docs.length == 0){
                    addDoc(collection(db, "pages"), docData).then((doc) => {
                        Router.push(`/manager/${doc.id}`)
                    })
                }
            }}>
                <input name="input" type={"text"} placeholder="Nome da página"/>
                <input type={"submit"} value={"Criar"}/>
            </form>
        </div>
    )
}

export default Manager