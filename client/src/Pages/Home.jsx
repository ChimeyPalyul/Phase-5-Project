import React, {useState} from 'react';

const Home = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password:'',
        name:''
    });
    const [formKey, setFormKey] = useState(Date.now());

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }
    const toggleForm = () => {
        setShowForm(!showForm);
    }
    console.log(formData)
    const handleSubmit = (event) => {
        event.preventDefault();
        let newUser = {
            "username": formData.username,
            "password": formData.password,
            "name": formData.name
        }
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(res=> res.json())
        .then(data => {
            setFormKey(Date.now());
            return data;
        })
        .then(data => toggleForm())
        .catch(error => {
            console.error('Error:', error);
        });
     }
     

    return (
    <>
    <h1 className = 'home-header'>Budget Buddy</h1>
    <button className = 'toggle-button' onClick={toggleForm}>Create an Account</button>
    <div className='home'>
        {showForm && (
            <form className='toggle-create-user' key = {formKey} onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type='text' name='username' onChange={handleChange}/>
                </label>
            <label>
                Password:
                <input type='text' name='password' onChange={handleChange}/>
            </label>
            <label>
                Name:
                <input type='text' name='name' onChange={handleChange}/>
            </label>
            <input type='submit' value='Submit'/>
            </form>
        )}
        <div className='homepage'>
            <p className='bold'>
                What is BudgetBuddy??
            </p>
            <p>
                Hi, Bonesaw here! I am just a regular American, just like you! I enjoy the taste of beer, apple pie, and freedom
            </p>
            <p>
                But do you know what I hate? Doing math, like a nerd! Thankfully I no longer have to! Thanks Budget Buddy!
            </p>
        </div>
    </div>
    </>
    )
}

export default Home

