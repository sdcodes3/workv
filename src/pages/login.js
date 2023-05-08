import { auth, database } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Link from "next/link"
import { get, ref } from "firebase/database"

export default function Home() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const router = useRouter();
    function handleSubmit(event) {
        event.preventDefault();
        login();
    }
    
    async function getUserInfo(uid){
        try{
            const snapshot = await get(ref(database, 'login/'+uid));
            if (snapshot.exists()) {
                return snapshot.val()
            }
            else {
                console.log("No users available");
            }
        }
        catch(error){
            console.error(error);
        }
    }
    const login = () => {
        signInWithEmailAndPassword(auth, email, password).then( async (userCredential) => {
            alert("Login Successful :)");
            localStorage.setItem("uid",userCredential.user.uid);
            const data = await getUserInfo(userCredential.user.uid);
            localStorage.setItem("mid",data.mentor);
            router.replace({
                pathname: '/',
                query: {name: data.name, type: data.type}
            });
        }).catch( (error) => {
            alert(error)
        })
    }
    return (
        <>
        <main className="d-flex align-items-center justify-content-center">
            <form className="d-flex flex-column border-2 border p-4 gap-4 px-5" onSubmit={handleSubmit}>
                <div className="h2 text-center">Login</div>
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
                <div className="text-center">
                    <button className="btn btn-primary rounded-0 px-4" type="submit">Login</button>
                </div>
                <div className="row g-0 align-items-center justify-content-between">
                    <div className="h6 m-0 col-auto pe-4">Not Yet Registered?</div>
                    <Link href={"/register"} className="col-auto text-decoration-none">Register Now</Link>
                </div>
            </form>
        </main>
        </>
    )
}
