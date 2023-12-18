import React, {useState} from "react";

function ExpenseCard({
    handleDelete,
    expense,
    onUpdate,
    users
}){
    const [expenseStatus, setExpenseStatus] = useState(true)
    const[form, setForm] = useState({
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
        fetch(`/users/expenses`,{ 
            method:"PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(form)
        })
            .then((res) => res.json())
            .then((updatedExpense) => onUpdate(updatedExpense))
    }

    function handleExpenseDelete(expense){
        console.log(expense)
        fetch(`/api/expense/${expense.id}`,{
            method:"DELETE",
        })
        handleDelete(expense)
    }

    return (
        <div className="expense-card">
          {expenseStatus && (
            <>
              <p className="description">{expense.description}</p>
              <p className="amount">{expense.amount}</p>
              <h3 className="frequency">{expense.frequency}</h3>
              <button className="patch-expense" onClick={handleExpenseUpdate}>
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
        </div>
      );
}

export default ExpenseCard;