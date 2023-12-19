import React, {useState} from "react";

function ExpenseCard({
    handleDelete,
    expense,
    onUpdate,
    users
 }){
    const [expenseStatus, setExpenseStatus] = useState(true)
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        frequency: '',
        description: '',
        amount: '',
        user_id: ''
    })
 
    const handleChange = (e)=> {
        setForm({
            [e.target.name] : e.target.value,
        });
    }
 
    function handleExpenseUpdate(){
        fetch(`/api/expense/${expense.id}`,{ 
            method:"PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(form)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((updatedExpense) => onUpdate(updatedExpense))
            .catch((error) => {
                console.error('Error:', error);
            });
            console.log(res)
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
              <p className="description">{expense.description}</p>
              <p className="amount">{expense.amount}</p>
              <h3 className="frequency">{expense.frequency}</h3>
              <button className="patch-expense" onClick={handleEditExpense}>
                Edit Expense
              </button>
              <button
                className="delete-expense"
                onClick={() => handleExpenseDelete(expense)}
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
 


