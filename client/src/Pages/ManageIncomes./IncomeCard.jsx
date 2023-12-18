import React, {useState} from "react";

function IncomeCard({
    handleDelete,
    income,
    onUpdate,
    users
}){
    const [incomeStatus, setIncomeStatus] = useState(true)
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

    function handleIncomeUpdate(){
        fetch(`/users/incomes`,{ 
            method:"PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(form)
        })
            .then((res) => res.json())
            .then((updatedIncome) => onUpdate(updatedIncome))
    }

    function handleIncomeDelete(income){
        console.log(income)
        fetch(`/api/income/${income.id}`,{
            method:"DELETE",
        })
        handleDelete(income)
    }

    return (
        <div className="income-card">
          {incomeStatus && (
            <>
              <p className="description">{income.description}</p>
              <p className="amount">{income.amount}</p>
              <h3 className="frequency">{income.frequency}</h3>
              <button className="patch-income" onClick={handleIncomeUpdate}>
                Edit Income
              </button>
              <button
                className="delete-income"
                onClick={() => handleIncomeDelete(income)}
              >
                Delete Income
              </button>
            </>
          )}
        </div>
      );
}

export default IncomeCard;