import React, { useState, useEffect } from 'react';

const IncomeList = ({userId}) => {
 const [incomes, setIncomes] = useState([]);


 useEffect(() => {
   fetch(`/api/users/${userId}/incomes`)
     .then(response => response.json())
     .then(data => setIncomes(data))
     .catch(error => console.error('Error:', error));
 }, []);

 return (
   <div>
    <h2>Incomes</h2>
     {incomes.map(income => (
       <div key={income.id}>
         <h2>{income.name}</h2>
         <p>{income.description}</p>
         <p>{income.amount}</p>
       </div>
     ))}
   </div>
 );
};

export default IncomeList;
