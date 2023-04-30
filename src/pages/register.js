import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import { useRef, useState } from "react";
  import { auth, db } from "./firebase";
  import { useRouter } from "next/router";
  import { doc, setDoc } from "firebase/firestore";
  
  export default function Register() {
    const router = useRouter();
    const emailRef = useRef();
    const userRef = useRef();
  
    const passwordRef = useRef();
    const [role, setRole] = useState("student");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await createUserWithEmailAndPassword(
          auth,
          emailRef.current.value,
          passwordRef.current.value
        );
        if (response) {
          const uid = `${role[0]}-${response.user.uid}`;
          await setDoc(doc(db, "users", uid), {
            name: userRef.current.value,
            email: emailRef.current.value,
            id: uid,
            role: role,
          });

          await setDoc(doc(db, "classes", uid), {
            code: "",
            editor: userRef.current.value,
            editorId: uid,
            updatedOn: new Date(),
          });

        }
        router.push("/");
      } catch (e) {
        alert(e.message);
      }
    };
    return (
      <>
        {/* <form onSubmit={handleSubmit}>
          <input type="text" ref={userRef} />
          <input type="text" ref={emailRef} />
          <input type="password" ref={passwordRef} />
          <input
            type="radio"
            name="role"
            value="student"
            checked={role == "student"}
            onChange={(e) => setRole(e.target.value)}
          />
          Student
          <input
            type="radio"
            name="role"
            value="teacher"
            checked={role == "teacher"}
            onChange={(e) => setRole(e.target.value)}
          />
          Teaacher
          <button type="submit">Submit</button>
        </form> */}
        <div>
        <div className="box shadow-lg mb-5  rounded">
          <div>
            <h3 className="mb-0">Sign Up</h3>
            <span>to continue to Netflix</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="col-sm-2 col-form-label">UserName</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control fm1"
                  placeholder="Enter your Name"
                  ref={userRef}
                  required
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="col-sm-2 col-form-label">Email</label>
              <div className="col-sm-10">
                <input
                  type="email"
                  className="form-control fm1"
                  placeholder="Enter your email"
                  ref={emailRef}
                  required
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="col-sm-2 col-form-label">Password</label>
              <div className="col-sm-10">
                <input
                  type="password"
                  className="form-control fm1"
                  placeholder="Enter your password"
                  ref={passwordRef}
                  s
                  required
                />
              </div>
            </div>
            <input
              type="radio"
              name="role"
              value="student"
              checked={role == "student"}
              onChange={(e) => setRole(e.target.value)}
            />
            Student
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={role == "teacher"}
              onChange={(e) => setRole(e.target.value)}
              className="ms-3 mt-3"
            />
            Teaacher
            <div className="mt-4">
              <button className="btn bt1" type="submit">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
      </>
    );
  }