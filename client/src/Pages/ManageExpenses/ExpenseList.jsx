import React, { useState, useEffect } from 'react';

const ExpenseList = ({users}) => {
 const [expenses, setExpenses] = useState([]);
 const[newExpense, setNewExpense]=useState({
    frequency: '',
    description: '',
    amount: ''
 });

 const handleNewExpenseChange = (event)=> {
    setNewExpense({
        ...newExpense,
        [event.target.name]: event.target.value
    });
 }

 const handleNewExpenseSubmit =(event) =>{
    event.preventDefault();
    fetch(`/api/expenses`, {
        method: "POST",
        headers: {
            'Content-Type':"application/JSON",
        },
        body: JSON.stringify(newExpense),
    })
    .then(res => res.json())
    .then(data =>{
        setExpenses([...expenses, data]),
        setNewExpense({
            frequency:'',
            description:'',
            amount: ''
        });
    })
    .catch(error => console.error('Error:', error));
 }


//  useEffect(() => {
//    fetch(`/api/users/${users.id}/expenses`)
//      .then(response => response.json())
//      .then(data => setExpenses(data))
//      .catch(error => console.error('Error:', error));
//  }, [expenses]);

 return (
   <>
    {/* <h2>Expenses</h2>
     {expenses.map(expense => (
       <div key={expense.id}>
         <h2>{expense.frequency}</h2>
         <p>{expense.description}</p>
         <p>{expense.amount}</p>
       </div>
     ))} */}
    <form onSubmit = {handleNewExpenseSubmit}>
        <label>
            Frequency:
            <input type='text' name='frequency' value = {newExpense.frequency} onChange={handleNewExpenseChange}/>
        </label>
        <label>
            Description:
            <input type='text' name='description' value={newExpense.description} onChange={handleNewExpenseChange}/>
        </label>
        <label>
            Amount:
            <input type='number' name='amount' value={newExpense.amount} onChange={handleNewExpenseChange}/>
        </label>
        <input type='submit' value='Add Expense'/>
    </form>
   </>
 );
};

export default ExpenseList;
