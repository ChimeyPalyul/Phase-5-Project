import React, { useState, useEffect } from 'react';
import IncomeCard from './IncomeCard';

const IncomeList = ({users, setUsers}) => {
 const [incomes, setIncomes] = useState([]);
 const[formStatus, setFormStatus] = useState(false)

 const[newIncome, setNewIncome]=useState({
    frequency: '',
    description: '',
    amount: '',
    user_id: users.id
 });
console.log(users)
console.log(incomes)

useEffect(() => {
    // Fetch the updated list of incomes
    fetch(`/incomes/${users.id}`)
      .then((res) => res.json())
      .then((data) => setIncomes(data));
    }, [incomes]);
 function handleUpdate(updatedIncome) {
    const updatedIncomeFilter = incomes.map((income) => {
      if (income.id === updatedIncome.id) {
        return updatedIncome;
      } else {
        return incomes;
      }
    });
    setIncomes(updatedIncomeFilter);
  }

 const handleNewIncomeChange = (event)=> {
    setNewIncome({
        ...newIncome,
        [event.target.name]: event.target.value
    });
 }

 const handleNewIncomeSubmit =(event) =>{
    event.preventDefault();
    fetch(`/api/users/incomes`, {
        method: "POST",
        headers: {
            'Content-Type':"application/json",
        },
        body: JSON.stringify(newIncome),
    })
    .then(res => res.json())
    .then(data =>{
        console.log(data)
        const updatedUser = {...users}
        updatedUser.incomes.push(data)
        setIncomes([...incomes, data]),
        setUsers(updatedUser)
        setNewIncome({
            frequency:'',
            description:'',
            amount: '',
            user_id: ''
        });
    })
    .catch(error => console.error('Error:', error));
 }


 function handleFormStatus(){
    setFormStatus(!formStatus)
 }



function handleDelete(deletedIncome){
  console.log(deletedIncome)
  console.log(incomes)
  
    // const updatedIncome = incomes.filter(
    //     (event) => event.id !== deletedIncome.id
    // );
    // setIncomes(updatedIncome)
    const updateUser = {...users}
    updateUser.incomes = updateUser.incomes.filter(income => income.id != deletedIncome.id)
    setUsers(updateUser)

}

const incomeFormButton = formStatus ? 'Cancel' : 'Add New Income Source'

return (
    <>
      <h1 className="manage_incomes">Manage Incomes</h1>
      <div className="income-cards-container">
        <button
          onClick={handleFormStatus}
          className="add-income-button"
        >
          {incomeFormButton}
        </button>
        <div className="incomes-container">
          {formStatus && (
            <form onSubmit={handleNewIncomeSubmit}>
              <label>
                Frequency:
                <input
                  type="text"
                  name="frequency"
                  value={newIncome.frequency}
                  onChange={handleNewIncomeChange}
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={newIncome.description}
                  onChange={handleNewIncomeChange}
                />
              </label>
              <label>
                Amount:
                <input
                  type="number"
                  name="amount"
                  value={newIncome.amount}
                  onChange={handleNewIncomeChange}
                />
              </label>
              <input type="submit" value="Add Income" />
            </form>
          )}
          {users.incomes && (
            <>
              {Object.keys(users.incomes).map((key) => (
                <IncomeCard
                  key={users.incomes[key].id}
                  handleDelete={handleDelete}
                  income={users.incomes[key]}
                  onUpdate={handleUpdate}
                  users={users}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
  
};

export default IncomeList;
