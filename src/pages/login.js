import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import { auth } from "./firebase";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(email, password);
      const res = await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      console.log(res);
      router.push("/");
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <>
      {/* <form onSubmit={handleSubmit}>
        <input type="text" ref={emailRef} />
        <input type="password" ref={passwordRef} />
        <button type="submit">Submit</button>
      </form> */}
      <div>
        
        <div className="box shadow-lg mb-5  rounded ">
          <div>
            <h3 className="mb-0">Login In</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="col-sm-2 col-form-label">Email</label>
              <div className="col-sm-10">
                <input
                  type="email"
                  className="form-control fm1"
                  placeholder="Enter your email"
                  ref={emailRef}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="col-sm-2 col-form-label ">Password</label>
              <div className="col-sm-10">
                <input
                  type="password"
                  className="form-control fm1"
                  placeholder="Enter your password"
                  ref={passwordRef}
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="col-sm-10">
                <button className="btn bt1" type="submit">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}