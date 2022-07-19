import React from 'react'
import { useState, useEffect } from 'react'
import "../index.css";
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import Dashboard from './dashboard';
import Box from '@mui/material/Box';
import { Button } from 'bootstrap';
import axios from 'axios';


import {
    signInWithGooglePopup,
    signInWithMicrosoftPopup,
    signInWithFacebookPopup,
    createUserDocumentFromAuth,
    firebaseApp, auth
}
    from '../utils/firebase/firebase.utils';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Link,
    Outlet,
    useParams,
    NavLink,
    useNavigate,
    useLocation
} from 'react-router-dom';

import "../index.css";
import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';


if (process.env.NODE_ENV != 'development') {

    axios.defaults.baseURL = process.env.REACT_APP_PROD_URL;
}
else {
    axios.defaults.baseURL = process.env.REACT_APP_PROD_URL;
}

const Home = () => {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const [email, setEmail] = useState('');
    // User Login info


    const errors = {
        uname: "invalid username",
        pass: "invalid password"
    };



    useEffect(() => {

        let isAuth = JSON.parse(localStorage.getItem('tokenMicrosoft'))
        if (isAuth && isAuth !== null) {
            navigate("/")
        }
    }, [])


    const getUserDetails = async (email, Password, IsSso,token) => {
       // const postData = { email, Password, IsSso,token };
        debugger;
        try {
            // set the url
            const url =
                '/validateuser';
            // request data object
            const data = {
                // email: this.state.email,
                // password: this.state.password,
                // returnSecureToken: true,
            };

            // set the headers
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            };

            const res = await axios.get(url, data, config);
            debugger;
            console.log(res.data);
            var db=res.data;
            var userDb=db.data;
            const userData = userDb.find((user) => user.Email === email);
            if (userData) {
                if (userData.Password !== Password && IsSso!=1) {
                    console.log("Password mismatch");
                  // Invalid password
                //  setErrorMessages({ name: "pass", message: errors.pass });
                } else {
                  navigate("/dashboard",{state:userData});
                }
              } else {
                console.log("Username not found");
                // Username not found
              //  setErrorMessages({ name: "uname", message: errors.uname });
              }
            



          //  navigate("/dashboard", { state: res.status });
           // onSuccess(res.data);
        } catch (err) {
            debugger;
            console.error(err);
           // onFailure(err);
        }
    
      

    }

    const authorizeandRedirect = (event) => {
        event.preventDefault();

        var { uname, pass } = document.forms[0];
        let Username = uname.value;
        //let Username = CryptoJS.AES.encrypt(JSON.stringify(Username), "FiTe11OAu20p164").toString();

        let Password = pass.value;
        //let Password = CryptoJS.AES.encrypt(JSON.stringify(Password), "FiTe11OAu20p164").toString();
        let IsSso = '0';
        const data = { Username, Password, IsSso };
       
        axios.post('/login', data)
            .then((response) => {

                console.log(response);
                debugger;
                if (response.statusText === 'OK') {

                    let token = response.data;

                    const postData = { token };
                    navigate("/dashboard", { state: postData });


                    // navigate("/dashboard",{state:1});
                }


            })
            .catch((error) => {
                // debugger;
                console.log("my error is " + error);
            })

    }



    // const handleLogIn = async () => {


    //   const { user } = await signInWithMicrosoftPopup();

    //   const userDocReference = await createUserDocumentFromAuth(user);
    //   //console.log(response);
    //   createUserDocumentFromAuth(user);

    //   if (user.isAnonymous) {
    //     setErrorMessages({ name: "pass", message: errors.pass });

    //   }
    //   else {
    //     debugger;
    //     let token = user.accessToken;
    //     let email = user.email;
    //     const postData = { token, email };
    //     navigate("/dashboard", { state: postData });

    //   }


    // }
    const logGoogleUser = async (event) => {
        debugger;
        event.preventDefault();
        //const response=await signInWithMicrosoftPopup();
        const { user } = await signInWithGooglePopup();
        // .then(function (cred) {
        //     cred.user.linkWithCredential(pendingCred)
        // })
        // console.log(user);
       // const userDocReference = await createUserDocumentFromAuth(user);
        //console.log(response);
        //createUserDocumentFromAuth(user);

        if (user.isAnonymous) {
            setErrorMessages({ name: "pass", message: errors.pass });

        }
        else {
            debugger;
            let tokenG = user.accessToken;
            localStorage.setItem('token', JSON.stringify(tokenG));
            let email = user.email;
            //let Username=CryptoJS.AES.encrypt(JSON.stringify(email), process.env.REACT_APP_SEC_KEY).toString();
            let Password = process.env.REACT_APP_PASS;
            let IsSso = '1';
            //const postData = { email,Password,IsSso };
            getUserDetails(email, Password, IsSso,tokenG);
           
        }
    }

    const logFacebookUser = async (event) => {
        debugger;
        event.preventDefault();
        
        //const response=await signInWithMicrosoftPopup();
        const { user } = await signInWithFacebookPopup()
        .catch(
            async (error) => {
                debugger;
              try {
                if (error.code == "auth/account-exists-with-different-credential") {
                    console.log(FacebookAuthProvider.credentialFromError(error));
                  throw error;
                }
                debugger;
               // let methods = await auth().signInWithCredential(error.customData.email);
              //  let oldCred = await this.getCredential(methods[0]);

                // auth().signInWithCredential(oldCred)
                // .then(user => {
                //   // You can now link the pending credential from the first
                //   // error.
                //   user.linkWithCredential(error.credential)
                // })
              }
              catch (error) {
                throw error;
              }
            })
        
         console.log(user);
        //const userDocReference = await createUserDocumentFromAuth(user);
        //console.log(response);
      //  createUserDocumentFromAuth(user);

        if (user.isAnonymous) {
            setErrorMessages({ name: "pass", message: errors.pass });

        }
        else {
            debugger;
            // let tokenM = user.accessToken;
            // localStorage.setItem('tokenGoogle', JSON.stringify(tokenM));
            // let email = user.email;
            // //let Username=CryptoJS.AES.encrypt(JSON.stringify(email), process.env.REACT_APP_SEC_KEY).toString();
            // let Password = process.env.REACT_APP_PASS;
            // let IsSso = '1';
            // const postData = { email, Password, IsSso };

            let tokenF = user.accessToken;
            localStorage.setItem('token', JSON.stringify(tokenF));
            debugger;
            let email = user.providerData[0].email;
            //let Username=CryptoJS.AES.encrypt(JSON.stringify(email), process.env.REACT_APP_SEC_KEY).toString();
            let Password = process.env.REACT_APP_PASS;
            let IsSso = '1';
            //const postData = { email,Password,IsSso };
            getUserDetails(email, Password, IsSso,tokenF);
        }
    }



    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );

    const styleLogin = {
        float: 'right'

    };


    return (
        <div>



            <div>
                <div className='row'>

                    <div className='col-sm-11 col-md-11' >
                        {/* <a className="text-end" style={styleLogin}  onClick={handleLogIn}>Microsoft LogIn</a> */}
                    </div>
                </div>
            </div>
            <div className="app">
                <div className='h-100'>
                    <div className="login-form">
                        <div className='text-center'>
                            {/* <LogoPage/> */}
                        </div>

                        <div className="title text-center h5 pt-2">Sign In</div>
                        <div className="form">
                            {/* <form onSubmit={authorizeandRedirect}> */}
                            <form >
                                <div className="input-container">
                                    <label>Username </label>
                                    <input type="text" className='heightLogin' name="uname" />
                                    {renderErrorMessage("uname")}
                                </div>
                                <div className="input-container">
                                    <label>Password </label>
                                    <input type="password" className='heightLogin'  name="pass" />
                                    {renderErrorMessage("pass")}
                                </div>
                                <div className="button-container pt-2">


                                    <input type="button" className='btn btn-primary w-75' value="Sign in"></input>


                                </div>
                                <hr></hr>
                                <div className='text-center pt-1 mt-1'>
                                    <p>Or Sign in using</p>

                                    <button className='btn btn-outline-primary' onClick={logGoogleUser} > Google <FaGoogle /></button>&nbsp;
                                    <button className='btn btn-outline-primary' onClick={logFacebookUser} > Facebook <FaFacebook /></button>
                                    {/* <input type="button" className='btn btn-outline-primary' onClick={logMicrosoftUser} value='Microsoft' ></input> */}


                                </div>
                            </form>
                        </div>
                    </div>




                </div>
            </div>

        </div>
    )
}

export default Home
