import React, {useState} from "react";

function IncomeCard({
    handleDelete,
    incomes,
    onUpdate,
    users,
    setUsers
}){
    const [incomeStatus, setIncomeStatus] = useState(true)
    const [showForm, setShowForm] = useState(false);
    const[form, setForm] = useState({
        frequency: '',
        description: '',
        amount: '',
    })

    const handleChange = (e)=> {
        setForm({
          ...form,
          [e.target.name] : e.target.value,
        });
    }
    console.log(incomes)
    function handleIncomeUpdate(){
        fetch(`api/income/${incomes.id}`,{ 
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
         .then((updatedIncome) => {
         console.log('In patch')
        const updatedIncomes= users.incomes.map((income)=>{
             return income.id === updatedIncome.id ? updatedIncome : income
        })
        const updatedUser = {...users}
        updatedUser.incomes = updatedIncomes
        setUsers(updatedUser)
         })
         
         .catch((error) => {
          console.error('Error:', error);
         });
        }
        
  
    function handleIncomeDelete(income){
        console.log(income)
        fetch(`/api/income/${income.id}`,{
            method:"DELETE",
        })
        handleDelete(income)
    }

    function handleEditIncome() {
      setShowForm(true);
  }

  function handleFormSubmit(event) {
      event.preventDefault();
      handleIncomeUpdate();
      setShowForm(false);
  }


    return (
        <div className="income-card">
          {incomeStatus && (
            <>
              <p className="description">{incomes.description}</p>
              <p className="amount">{incomes.amount}</p>
              <h3 className="frequency">{incomes.frequency}</h3>
              <button className="patch-income" onClick={handleEditIncome}>
                Edit Income
              </button>
              <button
                className="delete-income"
                onClick={() => handleIncomeDelete(incomes)}
              >
                Delete Income
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

export default IncomeCard;