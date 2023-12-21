import React, { useState, useEffect } from 'react';
import ExpenseCard from './ExpenseCard';

const ExpenseList = ({users, setUsers}) => {
 const [expenses, setExpenses] = useState([]);
 const[formStatus, setFormStatus] = useState(false)
 console.log(typeof(expenses))
 console.log(setUsers)

 const[newExpense, setNewExpense]=useState({
    frequency: '',
    description: '',
    amount: '',
    user_id: users.id,
    category_id:''
 });
console.log(users)
console.log(expenses)

useEffect(() => {
    fetch(`/users/${users.id}`)
      .then((res) => res.json())
      .then((data) => setExpenses(data));
    }, [expenses]);
 function handleUpdate(updatedExpense) {
    const updatedExpenseFilter = expenses.map((expense) => {
      if (expense.id === updatedExpense.id) {
        return updatedExpense;
      } else {
        return expenses;
      }
    });
    setExpenses(updatedExpenseFilter);
  }

 const handleNewExpenseChange = (event)=> {
    setNewExpense({
        ...newExpense,
        [event.target.name]: event.target.value
    });
 }

 const handleNewExpenseSubmit =(event) =>{
    event.preventDefault();
    fetch(`/api/users/expenses`, {
        method: "POST",
        headers: {
            'Content-Type':"application/json",
        },
        body: JSON.stringify(newExpense),
    })
    .then(res => res.json())
    .then(data =>{
        console.log(data)
        const updatedUser ={...users}
        updatedUser.expenses = [...updatedUser.expenses,data]
        setExpenses([...expenses, data]),
        setUsers(updatedUser)
        setNewExpense({
            frequency:'',
            description:'',
            amount: '',
            user_id: '',
            category_id: ''
        });
    })
    .catch(error => console.error('Error:', error));
 }


 function handleFormStatus(){
    setFormStatus(!formStatus)
 }



function handleDelete(deletedExpense){
    console.log(deletedExpense)
    console.log(expenses)
    const updateUser={...users}
    updateUser.expenses = updateUser.expenses.filter(expense => expense.id != deletedExpense.id)
    setUsers(updateUser)
    console.log(updateUser)
    updatedExpenses = expenses.filter(expense => expense.id != deletedExpense.id);
    console.log(updatedExpenses)
    setExpenses(updatedExpenses)
}

const expenseFormButton = formStatus ? 'Cancel' : 'Add New Expense'

return (
    <>
      <h1 className="manage-expenses">Manage Expenses</h1>
      <div className="expense-cards-container">
        <button
          onClick={handleFormStatus}
          className="add-expense-button"
        >
          {expenseFormButton}
        </button>
        <div className="expenses-container">
          {formStatus && (
            <form onSubmit={handleNewExpenseSubmit}>
              <label>
                Frequency:
                <input
                  type="text"
                  name="frequency"
                  value={newExpense.frequency}
                  onChange={handleNewExpenseChange}
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={newExpense.description}
                  onChange={handleNewExpenseChange}
                />
              </label>
              <label>
                Amount:
                <input
                  type="number"
                  name="amount"
                  value={newExpense.amount}
                  onChange={handleNewExpenseChange}
                />
              </label>
              <label for="expense-category">Category:</label>
              <select id="expense-category" name="expense_category">
                <option value="">Please select a category</option>
                <option value="Living Expense">Living Expense</option>
                <option value="Transportation">Transportation</option>
                <option value="Investment">Investment</option>
                <option value="Recreation">Recreation</option>
                <option value="Other">Other</option>
              </select>
              <input type="submit" value="Add Expense" />
            </form>
          )}
          {users.expenses && (
            <>
              {Object.keys(users.expenses).map((key) => (
                <ExpenseCard
                  key={users.expenses[key].id}
                  handleDelete={handleDelete}
                  expenses={users.expenses[key]}
                  setExpenses={setExpenses}
                  onUpdate={handleUpdate}
                  users={users}
                  setUsers={setUsers}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
  
};

export default ExpenseList;
