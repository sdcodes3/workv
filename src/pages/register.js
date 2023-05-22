import { auth, database } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useEffect, useState } from "react"
import { ref, set } from "firebase/database";
import { useRouter } from 'next/router'
import Link from "next/link";

export default function Home() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [type, setType] = useState("")

    const router = useRouter();
    
    function handleSubmit(event) {
        event.preventDefault();
        register();
    }
    
    async function writeUserData(userId, name, email, utype, mId) {
        await set(ref(database, 'login/'+userId), {
            name: name,
            email: email,
            type: utype,
            mentor: mId
        });

        if(utype == "User"){
            await set(ref(database, '77c0YfdSuAfh8WhltMhszeLA9qa2/'+mId+"/"+userId), {
                code: ""
            });
        }
    }

    const register = async () => {
        createUserWithEmailAndPassword(auth, email, password).then( (userCredential) => {
            console.log("User Credential : ", userCredential.user);
            if(type == "Faculty"){
                var mentorId = "77c0YfdSuAfh8WhltMhszeLA9qa2";
            }
            else{
                var mentorId = "A1L6uRvLBNeBlSiuOpx3XxX8f4y2";
            }
            writeUserData(userCredential.user.uid, name, email, type, mentorId);
            localStorage.setItem("uid",userCredential.user.uid);
            localStorage.setItem("mid",mentorId);
            alert(type+" registered successfully!!");
            router.replace({
                pathname: '/',
                query: {name: name, type: type}
            });
        }).catch( (error) => {
            console.log(error)
            alert(error.message)
        })
    }
    
    return (
        <>
        <main className="row g-0 d-flex align-items-center justify-content-center p-1">
            <form className="d-flex flex-column w-auto border-2 border p-4 gap-4 px-3 px-md-5" onSubmit={handleSubmit}>
                <div className="h2 text-center">Register</div>
                <div className="d-flex flex-column gap-2">
                    <div className="">Name</div>
                    <input type="text" className="form-control rounded-0" value={name} onChange={(event) => {
                        setName(event.target.value);
                    }} />
                </div>
                <div className="d-flex flex-column gap-2">
                    <div className="">Email</div>
                    <input type="text" className="form-control rounded-0" value={email} onChange={(event) => {
                        setEmail(event.target.value);
                    }} />
                </div>
                <div className="d-flex flex-column gap-2">
                    <div className="">Password</div>
                    <input type="password" className="form-control rounded-0" value={password} onChange={(event) => {
                        setPassword(event.target.value);
                    }} />
                </div>
                <div className="row g-0">
                    <div className="col">
                        <label htmlFor="user" className="d-flex align-items-center gap-2">
                            <span>User</span>
                            <input type="radio" value="User" id="user" name="type" className="form-check-input" onChange={(event) => {
                                setType(event.target.value)
                            }} />
                        </label>
                    </div>
                    <div className="col">
                        <label htmlFor="faculty" className="d-flex align-items-center gap-2">
                            <span>Faculty</span>
                            <input type="radio" value="Faculty" id="Faculty" name="type" className="form-check-input" onChange={(event) => {
                                setType(event.target.value)
                            }} />
                        </label>
                    </div>
                </div>
                <div className="text-center">
                    <button className="btn btn-primary rounded-0 px-4" type="submit">Register</button>
                </div>
                <div className="row g-0 align-items-center justify-content-between">
                    <div className="h6 m-0 col-auto pe-4">Already have an Account?</div>
                    <Link href={"/login"} className="col-auto text-decoration-none">Login Now</Link>
                </div>
            </form>
        </main>
        </>
    )
}
