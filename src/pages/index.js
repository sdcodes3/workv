import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, setDoc, onSnapshot, serverTimestamp, getDocs, getDoc, updateDoc, collection } from "firebase/firestore"; 
import CryptoJS, { AES } from "crypto-js";
import { Accordion } from "react-bootstrap";
import MessageComponent from '../components/MessageComponent'
import { onAuthStateChanged } from "firebase/auth";

const secretKey = "shrut"

export default function Home() {
  const [code,setCode] = useState("");
  const [newCode,setNewCode] = useState("");
  const [chat,setChat] = useState("");
  const [user, setUser] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const classesF = async () => {
    const tempArr = []
    const classes = await getDocs(collection(db, "users"));
    classes.forEach((doc) => {
      if(doc.data().id[0] == "s")
      tempArr.push(doc.data())
    });
    const arr= [...Array(Math.round(tempArr.length/3))].map((_,i) => {
      return ({name:`class ${i+1}`,data:tempArr.slice((i*3),(i+1) *3)})
    })
    setStudentsData(arr)
  }

  useEffect(() => {
    // Listen for changes to the user's authentication state
    const unsubscribe = onAuthStateChanged(auth,async (user) => {
      if (user) {
        // User is signed in
        const users = await getDocs(collection(db, "users"));
        users.forEach((doc) => {
          if(user.email == doc.data().email){
            setUser(doc.data())
          }
        });
      
        // setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Unsubscribe from the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
console.log(user,"uyt")
  },[user])
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
    if(user){

      const unsub = onSnapshot(doc(db, "classes", user?.id), (doc) => {
        setCode(doc.data())
      });
    }
    
    classesF();


  },[user])

  const encryptMessage = (message) =>
    AES.encrypt(message, secretKey).toString();

  const decryptMessage = (message) =>
    AES.decrypt(message, secretKey).toString(CryptoJS.enc.Utf8);
  return (
    <>
    {/* <div className="row align-item-center g-0">
        <div className="col-2 border-end p-2 pt-0">
          <Accordion defaultActiveKey={["0"]} alwaysOpen >
            <Accordion.Item eventKey="0" className="drop">
              <Accordion.Header > className 1</Accordion.Header>
              <Accordion.Body className="studentdata">
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>className 2</Accordion.Header>
              <Accordion.Body className="studentdata">
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>className 3</Accordion.Header>
              <Accordion.Body className="studentdata">
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>className 4</Accordion.Header>
              <Accordion.Body className="studentdata">
                <div type="none" >Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
                <div type="none">Student 1 </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <div className="col-7 textarea " >
          <textarea style={{ borderRadius: 0, border: 0, background: "#e2f2ff" }} value={code} onChange={async (event) => {
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
        <div className="col-3 p-2 pt-0">
          <h4 className="text-center p-0 m-2">
            Chatting Section
          </h4>
          <div className="container p-0 work h-100">
            <div className="d-flex p-2  text-white justify-content-between rounded-top " style={{ background: "#469fed" }}>
              WorkVio Assistant
            </div>
            {arr.map((data, i) => (
              <MessageComponent user={data?.uid} key={i} />
            ))}

            <div className="d-flex  justify-content-between align-items-center p-2">
              <div className="w-auto  form d-flex align-items-center justify-content-center" >
                <input
                  className="form-control"
                  type="text"
                  placeholder="Type your message...."
                  id="txtcomt"
                ></input>{" "}
              </div>
              <button className="btn btn-bg" style={{ background: "#CDFCF6" }}>Send</button>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div>Hello</div>
      
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
 */}


<div className="w-100">
<div className="w-100">Online Colaborator</div>
<div className="row align-item-center g-0 h-100">
        <div className="col-2 border-end p-2 pt-0 h-100">
          <Accordion defaultActiveKey={["0"]} alwaysOpen className="h-100">
            {studentsData?.map((item,index)=>(
              <Accordion.Item eventKey={index} key={index} className="drop">
                <Accordion.Header>{item.name}  </Accordion.Header>
                <Accordion.Body className="studentdata">
                  {
                    item.data.map((dta,i) => (

                      <li type="none" key={i} onClick={async() => {

                        const dd = await getDocs(collection(db,"classes"));
                        dd.forEach((doc) => {
                          console.log(doc.id,"mm",dta.id)
                          if(doc.id == dta.id)
                            setCode(doc.data());
                        })
                      }} >{dta.name}</li>
                    ))
                  }
                
                </Accordion.Body>
              </Accordion.Item>
            ))}
            
          </Accordion>
        </div>
        <div className="col-7 textarea h-100">
          <textarea value={code.code} style={{ borderRadius: 0, border: 0, background: "#e2f2ff" }} onChange={async(event) => {
            setCode({...code,code:event.target.value})
            let collectionName = "classes";
            let docName = "Jenish";
            await setDoc(doc(db, collectionName, code.editorId), {
              code: event.target.value,
              editor: code.editor,
              editorId: code.editorId,
              updatedOn: serverTimestamp()
            });
          }} className="w-100 h-100">

          </textarea>
        </div>
        <div className="col-3 p-2 pt-0 h-100">
          {/* <h4 className="text-center p-0 m-2">
            Chatting Section
          </h4> */}
          <div className="container p-0 work h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex p-2  text-white justify-content-between rounded-top " style={{ background: "#469fed" }}>
                WorkVio Assistant
              </div>
              {arr.map((data, i) => (
                <MessageComponent user={data?.uid} key={i} />
              ))}
              </div>

            <div className="d-flex  justify-content-between align-items-center p-2">
              <div className="w-auto  form d-flex align-items-center justify-content-center" >
                <input
                  className="form-control"
                  type="text"
                  placeholder="Type your message...."
                  id="txtcomt"
                ></input>{" "}
              </div>
              <button className="btn btn-bg" style={{ background: "#CDFCF6" }}>Send</button>
            </div>
          </div>
        </div>
        </div>
        {/* <div className="col-3  border-start bg-white">
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
        </div> */}
      </div>
    </>
  )
}