import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { collection, doc, getDoc, getDocs, query, where, } from "firebase/firestore";
import {db} from "../firebase/config";
import Router from "next/router";

const Page: NextPage = (data) => {
    const [blocks, setBlocks] = useState<any>([])

    useEffect(() => {
        if(Object(data).data){
            setBlocks(Object(data).data)
        } else {
            Router.push("/")
        }
    }, [])
    
    return (
        <div>
            {blocks.map((block: any, index: any) => {
                return (
                    // eslint-disable-next-line react/jsx-key
                    <div>
                        {<block.typeOfBlock key={index} href={block.url}>{block.contentOfBlock}</block.typeOfBlock>}
                    </div>
                )
            })}
        </div>
    )
}

export async function getServerSideProps(ctx: any) {
    try{
        const q = query(collection(db, "pages"), where("pageName", "==", String(ctx.query.page)))
        const querySnapshot = await getDocs(q)

        const docId = querySnapshot.docs[0].id
        const docRef = await getDoc(doc(db, "pages", docId))
        const d: any = docRef.data()
        const data = d.data

        return {
            props: {data}
        }
    } catch {
        return {
            props: {message : null}
        }
    }
}

export default Page