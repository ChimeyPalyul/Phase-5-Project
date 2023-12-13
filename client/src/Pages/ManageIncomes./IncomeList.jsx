import React, { useState, useEffect } from 'react';

const IncomeList = ({users}) => {
 const [incomes, setIncomes] = useState([]);
 const[newIncome, setNewIncome]=useState({
    frequency: '',
    description: '',
    amount: ''
 });

 const handleNewIncomeChange = (event)=> {
    setNewIncome({
        ...newIncome,
        [event.target.name]: event.target.value
    });
 }

 const handleNewIncomeSubmit =(event) =>{
    event.preventDefault();
    fetch(`/api/incomes`, {
        method: "POST",
        headers: {
            'Content-Type':"application/JSON",
        },
        body: JSON.stringify(newIncome),
    })
    .then(res => res.json())
    .then(data =>{
        setIncomes([...incomes, data]),
        setNewIncome({
            frequency:'',
            description:'',
            amount: ''
        });
    })
    .catch(error => console.error('Error:', error));
 }


//  useEffect(() => {
//    fetch(`/api/users/${users.id}/incomes`)
//      .then(response => response.json())
//      .then(data => setIncomes(data))
//      .catch(error => console.error('Error:', error));
//  }, [incomes]);

 return (
   <>
    {/* <h2>Incomes</h2>
     {incomes.map(income => (
       <div key={income.id}>
         <h2>{income.frequency}</h2>
         <p>{income.description}</p>
         <p>{income.amount}</p>
       </div>
     ))} */}
    <form onSubmit = {handleNewIncomeSubmit}>
        <label>
            Frequency:
            <input type='text' name='frequency' value = {newIncome.frequency} onChange={handleNewIncomeChange}/>
        </label>
        <label>
            Description:
            <input type='text' name='description' value={newIncome.description} onChange={handleNewIncomeChange}/>
        </label>
        <label>
            Amount:
            <input type='number' name='amount' value={newIncome.amount} onChange={handleNewIncomeChange}/>
        </label>
        <input type='submit' value='Add Income'/>
    </form>
   </>
 );
};

export default IncomeList;
