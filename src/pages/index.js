import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore"; 

export default function Home() {
  // const as = async () => {
  //   let collectionName = "classes";
  //   let docName = "teacher";
  //   await setDoc(doc(db, collectionName, docName), {
  //     code: code,
  //     editor: "Editor Name",
  //     updatedOn: new Date()
  //   });
  // }
  // useEffect(()=> {
  //   as();
  // },[])
  const [code,setCode] = useState("");
  return (
    <>
      <div>Hello</div>
      <textarea value={code} onChange={async(event) => {
        setCode(event.target.value)
        let collectionName = "classes";
        let docName = "teacher";
        await setDoc(doc(db, collectionName, docName), {
          code: event.target.value,
          editor: "Editor Name",
          updatedOn: new Date()
        });
      }}></textarea>
      <input type="text" value={code} onChange={()=>{}} />
    </>
  )
}