import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot, serverTimestamp, addDoc, getDoc, updateDoc } from "firebase/firestore"; 
import CryptoJS, { AES } from "crypto-js";
import { Accordion } from "react-bootstrap";
import MessageComponent from '../components/MessageComponent'

const secretKey = "shrut"

export default function Home() {
  const [code,setCode] = useState("");
  const [newCode,setNewCode] = useState("");
  const [chat,setChat] = useState("");
  const arr = [
    {
      uid: 1,
    },
    {
      uid: 2,
    },
    {
      uid: 1,
    },
    {
      uid: 3,
    },
  ];
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "classes", "teacher"), (doc) => {
      setNewCode(decryptMessage(doc.data().code))
    });
    const d = {
      admin:{
        0:{
          code : "Hel"
        },
        1:{
          code : "No"
        }
      }
    }
    for (const key in d) {
      const element = d[key];
      for (const k1 in element) {
        const element1 = element[k1];
        console.log(element1.code)
      }
    }
  },[])

  const encryptMessage = (message) =>
    AES.encrypt(message, secretKey).toString();

  const decryptMessage = (message) =>
    AES.decrypt(message, secretKey).toString(CryptoJS.enc.Utf8);
  return (
    <>
      <div>Hello</div>
      
      <input type="text" value={newCode} onChange={()=>{}} disabled />
      <div>Chat GPT</div>
      <input type="text" value={chat} onChange={(event) => {
        setChat(event.target.value)
      }} />
      <button onClick={async() => {
        let collectionName = "chat";
        let docName = "admin";

        let collectionData = {
          chat: chat,
          creator: "Creator Name",
          time: serverTimestamp()
        }
        const p = await getDoc(doc(db, collectionName, docName));
        const i = Object.keys(p.data()).length;
        // console.log(Object.keys(p.data()).length)
        await updateDoc(doc(db, collectionName, docName), { [i] : collectionData});
      }}>Send</button>




      <div className="row align-item-center g-0 bg-light">
        <div className="col-2 border-end">
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header> className 1</Accordion.Header>
              <Accordion.Body>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>className 2</Accordion.Header>
              <Accordion.Body>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>className 3</Accordion.Header>
              <Accordion.Body>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>className 4</Accordion.Header>
              <Accordion.Body>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
                <li type="none">Student 1 </li>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <div className="col-7">
          <textarea value={code} onChange={async(event) => {
            setCode(event.target.value)
            let collectionName = "classes";
            let docName = "teacher";
            await setDoc(doc(db, collectionName, docName), {
              code: encryptMessage(event.target.value),
              editor: "Editor Name",
              updatedOn: serverTimestamp()
            });
          }} className="w-100 h-100">

          </textarea>
        </div>
        <div className="col-3  border-start bg-white">
          Chatting Section
          <div className="container p-0 border rounded">
            <div className="d-flex p-2 bd-highlight bg-primary text-white justify-content-between rounded-top">
              WorkVio Assistant
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-dash-lg"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>{" "}
              </div>
            </div>
            {arr.map((data, i) => (
              <MessageComponent user={data?.uid} key={i} />
            ))}

            <div className="d-flex bg-light justify-content-between">
              <div className="p-3">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-list"
                  viewBox="0 0 16 16"
                >
                  {" "}
                  <path
                    fillRule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
              </div>
              <div className="w-auto p-1" style={{ backgroundColor: "#eee" }}>
                <input
                  className="form-control rounded-none"
                  type="text"
                  placeholder="Type your message...."
                  id="txtcomt"
                ></input>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}