
import React, { useState,useEffect }  from 'react'
import '../login.css'
import '../../styles.css'
import { useDispatch} from "react-redux";
import logoAuto from '../../assets/img/logoAuto.svg'
import {submit} from "../../actions/user";
import {NavLink} from "react-router-dom"
const  Login =() => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailDirty,setEmailDirty]=useState(false)
    const [passwordDirty,setPasswordDirty]=useState(false)
    const [emailError,setEmailError]=useState('Empty field')
    const [passwordError,setPasswordError]=useState('Empty field')
    const [formValid,setFormValid]=useState(false)

    useEffect (() => {
        if (emailError || passwordError)
        {
            setFormValid(false)
        } else setFormValid(true)
    },[emailError,passwordError])

    const emailHandler=(e)=> {
        setEmail(e.target.value)
   //     const filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   //     if (!filter.test(String(e.target.value).toLowerCase())) {
    //        setEmailError('Error email name')
    //    } else
        if (!e.target.value)
        {
            setEmailError('Empty field')
        }
           setEmailError('')
    }

    const passwordHandler=(e)=> {
        setPassword(e.target.value)
        if (!e.target.value)
        {
            setPasswordError('Empty field')
        } else setPasswordError('')
    }



    const blurHandler=(e) => {
        switch (e.target.name) {
            case 'email':
                setEmailDirty(true)
                break
            case 'password':
                setPasswordDirty(true)
                break

        }
    }
   // <h1 className='labelAuto'>Authorization</h1>
    const dispatch=useDispatch()
    return (
        <div className='login'  >
            <form className='form'>
                <img src={logoAuto} className='logoAuto'/>

                <div>
                    {(emailDirty && emailError) && <div style={{color:'red',position:'absolute',left:'90px',top:'130px'}}>{emailError}</div>}
                    <input name='email'  className='email' value={email} onChange={e => emailHandler(e)} onBlur={ e => blurHandler(e)} type='text' placeholder='Enter your login..'/>
                </div>
                <div>
                    {(passwordDirty && passwordError) && <div style={{color:'red',position:'absolute',left:'90px',top:'210px'}}>{passwordError}</div>}
                    <input name='password'  className='password' value={password} onChange={e => passwordHandler(e)} onBlur={ e => blurHandler(e)}  type='password' placeholder='Enter your password..'/>
                </div>
                <button type='button' className='submit' onClick={() =>dispatch(submit(email,password))} disabled={!formValid}><NavLink to='/main'>Login</NavLink></button>
            </form>
        </div>
    );
}
export default Login;