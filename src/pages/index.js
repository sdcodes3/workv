import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot, Timestamp } from "firebase/firestore"; 

export default function Home() {
  const [code,setCode] = useState("");
  const [newCode,setNewCode] = useState("");
  const unsub = onSnapshot(doc(db, "classes", "teacher"), (doc) => {
    setNewCode(doc.data().code)
  });
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
      <input type="text" value={newCode} onChange={()=>{}} disabled />
    </>
  )
}