import { useEffect, useState } from "react";
import { app, auth, database } from "../firebase"
import { onValue, ref, set, get, update } from "firebase/database";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import Link from "next/link";

export default function Home() {
  const [code,setCode] = useState();
  const [updates,setUpdate] = useState();
  const [users,setUsers] = useState();
  const [editId,setEditId] = useState();
  const [readName,setReadName] = useState();
  const [editName,setEditName] = useState();
  
  
  // new
  const [userId, setUserId] = useState();
  const [userType,setUserType] = useState();
  const [mentorId, setMentorId] = useState();
  const [name, setName] = useState();
  const [studentNameWithId, setStudentNameWithId] = useState();
  const [readId,setReadId] = useState("n");
  
  const router = useRouter();
  const que = router?.query;
  
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
      router.replace('/login')
    }).catch((error) => {
      console.log("Error signing out : ",error)
    });
  }
  
  const readUser = async (readId1) => {
    // Get data when user's name is clicked and user type is other then admin
    if(readId != "n"){
      const xx = await onValue(ref(database, mentorId+"/"+userId+"/"+readId+"/code" ),(snapshot) => {
        if (snapshot.exists()) { 
          if(localStorage.getItem('rid') == readId){
            setUpdate(snapshot.val())
          }
        } else {
          console.log("No data available");
        }
      });
    }
    else{
      console.log("Select a student");
    }
  }

  async function getInitalData(url){
    const data = await get(ref(database,"77c0YfdSuAfh8WhltMhszeLA9qa2/"+url))
    setCode(data?.val()?.code);
  }
  
  async function getStudents(url){
    get(ref(database, "77c0YfdSuAfh8WhltMhszeLA9qa2/"+url)).then( async (snapshot) => {
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
      }
      else if(que?.type == 'Admin'){
        getStudents("");
      }
      else{
        getInitalData(mid+"/"+uid);
      }
    }
    else{
      alert("Please Login First!");
      router.replace('/login');
    }
  },[])
  return (
    <>
    <main className="row g-0 d-flex">
      {
        (que.type != 'User') &&
        <div className="col col-md-2">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {
              users && studentNameWithId &&
              Object.keys(users)?.map((i,ui) => (
              <li className="nav-item" key={ui}>
                <Link className="nav-link active" href={""} id={i} onClick={(event) => {
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
      <div className="col">
        {
        (que.type == 'User') ?
        <div className="d-flex h-100">
          <textarea value={code} onChange={(event) => {
            setCode(event.target.value)
            updateCode(mentorId+"/"+userId+"/code",event.target.value);
          }} className="w-100 h-100 border-0"></textarea>
        </div>
        :
        <div className="d-flex h-100">
          <textarea value={updates} onChange={() => {}} className="w-100 h-100 border-0" disabled></textarea>
        </div>
        }
      </div>
      <div className="col-2">
        <div className="h4 text-center py-2">Chat Area</div>
        <div className="h5">Current User : { que.name }, {que.type}</div>
        <div className="">
          <button onClick={signout} className="btn btn-danger rounded-0">Sign Out</button>
        </div>
      </div>
    </main>
    </>
  )
}
