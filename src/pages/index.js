import { useEffect, useState } from "react";
import { database } from "./firebase"
import { onValue, ref, set } from "firebase/database";

export default function Home() {
  const [code,setCode] = useState();
  const [updates,setUpdate] = useState();
  const [userType,setUserType] = useState("admi");
  const [users,setUsers] = useState();
  const [uId,setUId] = useState();
  const [uName,setUName] = useState();

  function writeUserData(userId, name, code) {
    set(ref(database, 'users/' + userId), {
      name : name,
      code : code
    });
  }

  const cc = (uiid) => {
    const something = onValue(ref(database, 'users/' + uiid), (snapshot) => {
      // Called when database is updated of selected user from uiid
      const data = snapshot.val();
      // updation in admin panel (updates)
      setUpdate(data?.code)
      // updates for user -> editable (code)
      setCode(data?.code)
    });
  }

  useEffect(() => {
    const something1 = onValue(ref(database, 'users'), (snapshot) => {
      // Left Panel Updation (users)
      setUsers(snapshot.val())
    });
  },[])

  return (
    <>
    <main className="row g-0 d-flex">
      <div className="col col-md-2">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {
            users?.map((i,ui) => (
            <li className="nav-item" key={i.name}>
              <a className="nav-link active" href="#" id={ui} onClick={(event, ui) => {
                setUId(event.target.id)
                setUName(i.name)
                cc(event.target.id)
              }}>{i.name}
              </a>
            </li>)
            )
          }
        </ul>
      </div>
      <div className="col">
        {
        (userType != 'admin') ?
        <div className="d-flex h-100">
          <textarea value={code} onChange={(event) => {
            setCode(event.target.value)
            writeUserData(uId,uName,event.target.value)
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
        <input type="text" value={userType} onChange={(event) => {
          setUserType(event.target.value);
        }} />
        <div className="h5">Current User : {uName}</div>
      </div>
    </main>
    </>
  )
}
