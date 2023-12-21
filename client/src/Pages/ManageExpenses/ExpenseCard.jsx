import React, {useState} from "react";

function ExpenseCard({
    handleDelete,
    expenses,
    setExpenses,
    onUpdate,
    users,
    setUsers
}){
    const [expenseStatus, setExpenseStatus] = useState(true)
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        frequency: '',
        description: '',
        amount: ''
    })
    console.log(setUsers)
    console.log(form)
    const handleChange = (e)=> {
        setForm({
            ...form, 
            [e.target.name] : e.target.value,
        });
    }
    console.log(expenses)
    function handleExpenseUpdate() {
        console.log(expenses)
        fetch(`/api/expense/${expenses.id}`, { 
         method: "PATCH",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify(form)
        })
        .then((res) => {
         if (!res.ok) {
             throw new Error('Network response was not ok');
         }
         return res.json();
        })
        .then((updatedExpense) => {
        console.log('In patch')
       const updatedExpenses = users.expenses.map((expense)=>{
            return expense.id === updatedExpense.id ? updatedExpense : expense
       })
       const updatedUser = {...users}
       updatedUser.expenses = updatedExpenses
       setUsers(updatedUser)
        })
        
        .catch((error) => {
         console.error('Error:', error);
        });
       }
       
 
    function handleExpenseDelete(expense){
        fetch(`/api/expense/${expense.id}`,{
            method:"DELETE",
        })
        handleDelete(expense)
    }
 
    function handleEditExpense() {
        setShowForm(true);
    }
 
    function handleFormSubmit(event) {
        event.preventDefault();
        handleExpenseUpdate();
        setShowForm(false);
    }
 
    return (
        <div className="expense-card">
          {expenseStatus && (
            <>
              <p className="description">{expenses.description}</p>
              <p className="amount">{expenses.amount}</p>
              <h3 className="frequency">{expenses.frequency}</h3>
              <button className="patch-expense" onClick={handleEditExpense}>
                Edit Expense
              </button>
              <button
                className="delete-expense"
                onClick={() => handleExpenseDelete(expenses)}
              >
                Delete Expense
              </button>
            </>
          )}
          {showForm && (
            <form onSubmit={handleFormSubmit}>
                <label>
                   Frequency:
                   <input
                       type="text"
                       name="frequency"
                       value={form.frequency}
                       onChange={handleChange}
                   />
                </label>
                <label>
                   Description:
                   <input
                       type="text"
                       name="description"
                       value={form.description}
                       onChange={handleChange}
                   />
                </label>
                <label>
                   Amount:
                   <input
                       type="number"
                       name="amount"
                       value={form.amount}
                       onChange={handleChange}
                   />
                </label>
                <input type="submit" value="Update Expense" />
            </form>
          )}
        </div>
      );
 }
 
 export default ExpenseCard;
 


