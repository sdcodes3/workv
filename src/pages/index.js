import { useEffect, useState } from "react";
import { auth, database } from "../firebase"
import { onValue, ref, set, get, update } from "firebase/database";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { Accordion } from "react-bootstrap";

export default function Home() {
  const [code,setCode] = useState();
  const [updates,setUpdate] = useState();
  const [users,setUsers] = useState();
  
  
  // new
  const [userId, setUserId] = useState();
  const [userType,setUserType] = useState();
  const [mentorId, setMentorId] = useState();
  const [name, setName] = useState();
  const [studentNameWithId, setStudentNameWithId] = useState();
  const [chat,setChat] = useState("");
  const [chatMsg,setChatMsg] = useState([]);
  const [allUserData,setAllUserData] = useState();
  const [sendTo, setSendTo] = useState();

  const router = useRouter();
  const que = router?.query;
  
  const sendChat = async () => {
    getChat();
    const snapshot = await get(ref(database, "chat/"));
    if(snapshot.exists()){
      var arr = snapshot.val();
    }
    else{
      var arr = [];
    }
    var date = new Date();
	  var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
    arr.push({
      from: userId,
      name: name,
      type: userType,
      to: sendTo,
      time: current_time,
      msg: chat
    })
    await set(ref(database, 'chat/'), arr);
    setChat("");
  }

  const getChat = async () => {
    await onValue(ref(database, "chat/" ),(snapshot) => {
      if (snapshot.exists()) { 
        setChatMsg(snapshot.val());
      } else {
        console.log("No chats available");
      }
    });
  }
  // Called every time when user write code in textarea
  async function updateCode(url, code){
    const updates = {};
    updates["77c0YfdSuAfh8WhltMhszeLA9qa2/"+url] = code;
    await update(ref(database), updates)
  }

  // Called when user click on sign out
  const signout = async () => {
    signOut(auth).then(() => {
      alert("You are signed out successfully !")
      localStorage.removeItem("uid");
      localStorage.removeItem("mid");
      localStorage.removeItem("rid");
      router.replace('/login')
    }).catch((error) => {
      console.log("Error signing out : ",error)
    });
  }
  
  const readUser = async (readId1) => {
    // Get data when user's name is clicked and user type is other then admin
    await onValue(ref(database, mentorId+"/"+userId+"/"+readId1+"/code" ),(snapshot) => {
      if (snapshot.exists()) { 
        if(localStorage.getItem('rid') == readId1){
          setUpdate(snapshot.val())
        }
      } else {
        console.log("No data available");
      }
    });
  }

  async function getInitalData(url){
    const data = await get(ref(database,"77c0YfdSuAfh8WhltMhszeLA9qa2/"+url))
    setCode(data?.val()?.code);
  }
  
  async function getStudents(url){
    await get(ref(database, "77c0YfdSuAfh8WhltMhszeLA9qa2/"+url)).then( async (snapshot) => {
      if (snapshot.exists()) {
        let ll = {};
        for (const uid in snapshot.val()) {
          const d = await get(ref(database, "login/"+uid));
          const element = d.val().name;
          ll[uid] = element;
        }
        setStudentNameWithId(ll);
        setUsers(snapshot.val())
      } else {
        setUsers({})
        console.log("No users available");
      }
    }).catch((error) => {
      console.error(error);
    });

    const snapshot1 = await get(ref(database, "login/"));
    if(snapshot1.exists())
      setAllUserData(snapshot1?.val());
    else
      setAllUserData({})
  }
  
  function clearLocal(){
    window.onbeforeunload = function() {
      localStorage.clear();
    }
  }

  useEffect(() => {
    if(localStorage.getItem("uid")){
      // From Local Storage
      const uid = localStorage.getItem("uid");
      const mid = localStorage.getItem("mid");
      // Setting to States in React
      setUserId(uid);
      setMentorId(mid);
      // From URL (router) and setting to States in React
      setUserType(que?.type);
      setName(que?.name);
      if(que?.type == 'Faculty'){
        getStudents(uid);
        setSendTo("77c0YfdSuAfh8WhltMhszeLA9qa2");
      }
      else if(que?.type == 'Admin'){
        getStudents("");
      }
      else{
        getInitalData(mid+"/"+uid);
        setSendTo("77c0YfdSuAfh8WhltMhszeLA9qa2")
      }
      getChat();
    }
    else{
      alert("Please Login First!");
      router.replace('/login');
    }
  },[que])
  return (
    <>
    <main className="row g-0 d-flex">
      {
        (que.type != 'User') &&
        <div className="col col-md-2 border-end">
          <div className="text-center h4 m-0 py-3 bg-light">Students</div>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {
              (userType == "Admin") ?
              <Accordion defaultActiveKey={['0']} alwaysOpen>
                {
                users && studentNameWithId && allUserData &&
                Object.keys(users)?.map((i,ui) => (
                  <Accordion.Item eventKey={ui} key={ui}>
                    <Accordion.Header>{studentNameWithId[i]}</Accordion.Header>
                    <Accordion.Body className="p-0">
                      {
                        Object.keys(users[i])?.map((element,index) => (
                          <li className="nav-item px-3" key={index}>
                        <Link className="nav-link active" href={"?name="+name+"&type="+userType} id={element} onClick={(event) => {
                          localStorage.setItem("rid",i+"/"+event.target.id);
                          readUser(i+"/"+event.target.id)
                        }}> - {allUserData[element].name}
                        </Link>
                      </li>
                      ))
                      }
                    </Accordion.Body>
                  </Accordion.Item>
                ))
                }
              </Accordion>
              :

              users && studentNameWithId &&
              Object.keys(users)?.map((i,ui) => (
              <li className="nav-item border-top" key={ui}>
                <Link className="nav-link active text-end px-3" href={"?name="+name+"&type="+userType} id={i} onClick={(event) => {
                  localStorage.setItem("rid",event.target.id);
                  setReadId(event.target.id)
                  readUser(event.target.id)
                }}>{studentNameWithId[i]}
                </Link>
              </li>)
              )
            }
          </ul>
        </div>
      }
      <div className="col" style={{maxHeight:"100vh"}}>
        {
        (que.type == 'User') ?
        <div className="d-flex flex-column h-100 bg-light">
          <div className="d-flex justify-content-between align-items-center px-2">
            <div></div>
            <div className="h4 text-center py-3">
              Welcome {que.name}
            </div>
            <div>
              <button onClick={signout} className="btn btn-danger rounded-0">Sign Out</button>
            </div>
          </div>
          <div className="d-flex px-2 pb-2" style={{flex:1}}>
            <textarea value={code} onChange={(event) => {
              setCode(event.target.value)
              updateCode(mentorId+"/"+userId+"/code",event.target.value);
            }} className="w-100 h-100 border-0"></textarea>
          </div>
        </div>
        :
        <div className="d-flex flex-column h-100 bg-light">
          <div className="d-flex justify-content-between align-items-center px-2">
            <div></div>
            <div className="h4 text-center py-3 m-0">
              Welcome {que.name}
            </div>
            <div>
              <button onClick={signout} className="btn btn-danger rounded-0">Sign Out</button>
            </div>
          </div>
          <div className="d-flex pb-2" style={{flex:1}}>
            {
              updates ? 
              <textarea value={updates} onChange={() => {}} className="w-100 h-100 border-0 p-2" disabled></textarea>
              :
              <div className="text-center w-100 pt-5 h2 text-danger">
                Select a student to display its code!!
              </div>
            }
          </div>
        </div>
        }
      </div>
      <div className="col-3 d-flex flex-column pb-2 border-start" style={{maxHeight:"100vh"}}>
        <div className="h4 m-0 text-center py-3 chat-header border-bottom bg-light">CHAT AREA</div>
        <div className="chat-body p-2 d-flex flex-column gap-2" style={{flex:"1", maxHeight:"100%", overflowY:"auto"}}>
          {
            chatMsg.length > 0 && chatMsg.map((element,index) => (
              (element.from == userId) ? <div key={index} className="bg-warning bg-gradient p-2 pb-1 ms-auto d-flex flex-column justify-content-center gap-0" style={{ maxWidth: "75%", minWidth:"20%", width:"max-content", borderRadius:"10px 10px 0px 10px"}}>
                <div className="p-0 m-0 text-break">
                  {element.msg}
                </div>
                <div className="text-end" style={{fontSize:"0.65rem", marginTop:"-3px", letterSpacing:"0.5px"}}>
                  {element.time}
                </div>
              </div>
              :
              
              (
                (userType == "Admin") ?
                (allUserData) &&
                <div>
                  <div className="" style={{fontSize:"0.85rem"}}>{element.name} ({element.type}) - {(element.to == userId) ? "You" : ( <span>{allUserData[(element.to)].name} ({allUserData[element.to].type}) </span>)} </div>
                  <div className="bg-info bg-gradient p-2 pb-1" style={{ maxWidth: "75%", minWidth:"20%", width:"max-content", borderRadius:"10px 10px 10px 0px"}}>
                    <div className="p-0 m-0 text-break">
                      {element.msg}
                    </div>
                    <div className="" style={{fontSize:"0.65rem", marginTop:"-3px", letterSpacing:"0.5px"}}>
                      {element.time}
                    </div>
                  </div>
                </div>
                :
                (element.to == userId || element.to == "all") &&
                <div>
                  <div className="" style={{fontSize:"0.85rem"}}>{element.name} ({element.type})</div>
                  <div className="bg-info bg-gradient p-2 pb-1" style={{ maxWidth: "75%", minWidth:"20%", width:"max-content", borderRadius:"10px 10px 10px 0px"}}>
                    <div className="p-0 m-0 text-break">
                      {element.msg}
                    </div>
                    <div className="" style={{fontSize:"0.65rem", marginTop:"-3px", letterSpacing:"0.5px"}}>
                      {element.time}
                    </div>
                  </div>
                </div>
              )
            ))
          }
        </div>
        <div className="chat-footer d-flex align-items-center gap-3 p-2 border-top pt-3">
          <div className="w-100 h-100">
            <textarea type="text" className="form-control shadow-none h-100" value={chat} onChange={(event) => {
              setChat(event.target.value);
            }}></textarea>
          </div>
          <div className="col-3 d-flex flex-column gap-2">
            {
              (userType == "Admin") &&
              <div className="d-flex align-items-center gap-2" style={{fontSize:"0.75rem"}} >
                <div className="text-nowrap">To : </div>
                <select className="form-control shadow-none p-1 m-0 text-truncate" style={{fontSize:"0.75rem"}} onChange={(event) => {
                  setSendTo(event.target.value);
                }}>
                  {
                    allUserData &&
                    Object.keys(allUserData)?.map((element,index) => (
                      (element != userId) &&
                      <option value={element}>{allUserData[element].name}</option>
                      ))
                  }
                  <option value={"all"}>All</option>
                </select>
              </div>
            }
            <button className="btn btn-primary rounded-0 py-1" onClick={sendChat} disabled={(chat == "")? true : false}>Send</button>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}
