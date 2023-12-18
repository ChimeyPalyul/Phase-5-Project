import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import bcryptjs from 'bcryptjs';


const Login = ({isLoggedIn,setIsLoggedIn, setUsers}) =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const[data,setData]= useState({})
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        let userInfo = {
                "username": username,
                "password": password
            }
        fetch('/api/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        })
        .then(res => res.json())
        .then(data => {
            if (!('error' in data)){
                console.log(data)
                setData(data)
                setUsers(data)
                localStorage.setItem('user', JSON.stringify(data));
                setUsername('');
                setPassword('');
                setIsLoggedIn(true)
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setIsLoggedIn(false); 
            setData({}); 
            alert(error.message || 'Login failed.');
        });
    

    };

    useEffect(() => {
        console.log(data)
        if (isLoggedIn){
            navigate("/");
        }
    },[data])

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type='text' value={username} onChange={e => setUsername(e.target.value)}/>
            </label>
            <label>
                Password:
                <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
            </label>
            <input type='submit' value='Login'/>
            </form>
        </div>
      );     
}

export default Login