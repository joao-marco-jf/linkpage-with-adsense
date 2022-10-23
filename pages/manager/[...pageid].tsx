import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { NextPage } from "next";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { app, db } from "../../firebase/config";

import style from "../../styles/creator.module.css"

interface Istate {
    idOfBlock: number,
    typeOfBlock: string,
    contentOfBlock?: string,
    url?: string 
}

const PageCreator: NextPage = (id) => {
    const [pageName, setPageName] = useState<any>()
    const [stateBlock, setBlock] = useState<Istate[]>([])
    const [stateMargin, setMargin] = useState(0)
    const [stateUser, setUser] = useState<any>()
    
    const Text = (props : any) => {
        return(
            <div>
                <form name="form" onSubmit={() => setBlock(ChangeToText(event))}>
                    {<props.type onClick={ChangeToInput} hidden={false}>{props.content}</props.type>}
                    <div hidden={true}>
                        <input name="input" id={props.idOfBlock} defaultValue={props.content}/>
                        <input type={"submit"} value="Inserir"/>
                        <button id={props.idOfBlock} onClick={removeBlock} name="button">Excluir</button>
                    </div>
                </form>
            </div>
        )
    }
    
    const Link = (props : any) => {
        return(
            <form onSubmit={() => setBlock(ChangeToLink(event))}>
                <a onClick={ChangeToInput} href={"#"}>{props.content}</a>
                <div hidden={true
                }>
                    <input name="contentInput" id={props.idOfBlock} defaultValue={props.content}/>
                    <input name="urlInput" defaultValue={props.url}/>
                    <input type={"submit"} value="Inserir"/>
                    <button id={props.idOfBlock} onClick={removeBlock} name="button">Excluir</button>
                </div>
            </form>
        )
    }

    const addTextBlock = (event: any) => {
        event.preventDefault()
        setBlock(stateBlock => [...stateBlock, {
            idOfBlock: stateBlock.length,
            typeOfBlock: event?.target.type.value,
            contentOfBlock: "Texto"
        }])
    }

    const addLinkBlock = (event: any) => {
        event.preventDefault()
        setBlock(stateBlock => [...stateBlock, {
            idOfBlock: stateBlock.length,
            typeOfBlock: event?.target.type.value,
            contentOfBlock: "Nome da url",
            url: "https://url.com.br/"
        }])
    }

    const ChangeToText = (event: any) => {
        event.preventDefault()

        const id = Number(event.target.input.id)
        const type = stateBlock[id].typeOfBlock
        const content = event.target.input.value
        let newArr = [...stateBlock]
        
        newArr[id] = {
            idOfBlock: id,
            typeOfBlock: type,
            contentOfBlock: content
        }
        
        event.target.setAttribute("hidden", true)
        event.target.childNodes[0].removeAttribute("hidden")

        return newArr
    }

    const ChangeToLink = (event: any) => {
        event.preventDefault()

        const id = Number(event.target.contentInput.id)
        const type = stateBlock[id].typeOfBlock
        const content = event.target.contentInput.value
        const url = event.target.urlInput.value
        let newArr = [...stateBlock]

        newArr[id] = {
            idOfBlock: id,
            typeOfBlock: type,
            contentOfBlock: content,
            url: url
        }

        event.target.setAttribute("hidden", true)
        event.target.childNodes[0].removeAttribute("hidden")

        return newArr
    }

    const ChangeToInput = (event: any) => {
        event.preventDefault()
        event.target.setAttribute("hidden", true)
        event.target.nextElementSibling.removeAttribute("hidden")
    }

    const removeBlock = (event: any) => {
        event.preventDefault()
        const id = Number(event.target.id)
        
        let state = [...stateBlock]
        let Arr = state.filter((block) => block.idOfBlock !== id)
        let newArr: Istate[] = []

        Arr.forEach((block: any, index: any) => {
            block.idOfBlock = index
            newArr.push(block)
        })

        setBlock(newArr)
    }

    const Save = async () => {
        const q = query(collection(db, "pages"), where("pageName", "==", pageName))
        const querySnapshot = await getDocs(q)

        try{
            const docId = querySnapshot.docs[0].id
            updateDoc(doc(db, "pages", docId), {
                "data": stateBlock
            })
        }
        catch{}
    }

    const setStyle = (event: any) => {
        event.preventDefault()
        setMargin(event.target.margin.value)
    }

    useEffect(() => {
        getAuth(app).onAuthStateChanged(async (user) => {
            if(user) {
                setUser(user)
                let pageData = String(Object(id).id)
                const docRef = doc(db, "pages", pageData)
                const docSnap = await getDoc(docRef)
                const docData: any = docSnap.data()
                if(user.email == docData.user.email){
                    setPageName(docData.pageName)
                    setBlock(docData.data)
                } else {
                    Router.push("/manager")
                }
            }else{
                Router.push(`/${pageName}`)
            }
        })
    }, [])

    return (
        <div style={{margin: stateMargin}}>
            {stateUser 
            ?
            <div>
                <button onClick={() => Router.push("/manager")}>Voltar</button>
                <div className="content">
                    {stateBlock.map((block: any, index: any) => {
                        if (block.typeOfBlock == "a"){
                            return <Link key={index} idOfBlock={index} content={block.contentOfBlock} url={block.url}/>
                        }  
                        else {
                            return <Text key={index} idOfBlock={index} content={block.contentOfBlock} type={block.typeOfBlock}/> 
                        }
                    })}

                </div>
                <div className={style.options}>

                    <form onSubmit={addTextBlock}>
                        <input name="type" type={"text"} defaultValue={"h1"} hidden/>
                        <input type={"submit"} value="TÍTULO"/>
                    </form>
                    <form onSubmit={addTextBlock}>
                        <input name="type" type={"text"} defaultValue={"h2"} hidden/>
                        <input type={"submit"} value="SUBTÍTULO"/>
                    </form>
                    <form onSubmit={addTextBlock}>
                        <input name="type" type={"text"} defaultValue={"h3"} hidden/>
                        <input type={"submit"} value="DESCRIÇÃO"/>
                    </form>
                    <form onSubmit={addTextBlock}>
                        <input name="type" type={"text"} defaultValue={"p"} hidden/>
                        <input type={"submit"} value="PARÁGRAFO"/>
                    </form>

                    <form onSubmit={addLinkBlock}>
                        <input name="type" type={"text"} defaultValue={"a"} hidden/>
                        <input type={"submit"} value="LINK" />
                    </form>

                    <form onSubmit={setStyle}>
                        <label>Margem</label>
                        <input name="margin" type={"text"} placeholder="px"/>
                        <input type={"submit"} value="ALTERAR"/>
                    </form>

                    <button onClick={Save}> SALVAR </button>
                </div>
            </div>
            :<p>Loanding...</p>
            }
        </div>
    )
}

export async function getServerSideProps(ctx: any){
    return {
        props: {id : ctx.query.pageid}
    }
}

export default PageCreator