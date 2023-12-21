import React, { useState, useEffect, createRef } from 'react';
import { Bar } from 'react-chartjs-2';

const IncomeToExpenses = ({ users }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const chartRef = createRef(); // Reference for chart instance

  useEffect(() => {
    // Fetch data only when users prop changes
    // fetch(`/api/users/incomes}`)
    //   .then((res) => {
    //     if (!res.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return res.json();
    //   })
    //   .then((data) => {
    //     setIncomes(data);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching incomes:', error);
    //   });

    // fetch(`/api/users/expenses`)
    //   .then((res) => {
    //     if (!res.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return res.json();
    //   })
    //   .then((data) => {
    //     setExpenses(data);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching expenses:', error);
    //   });
    if (users){
        setIncomes(users.incomes)
        setExpenses(users.expenses)
    }

    // Cleanup function to destroy chart on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [users]);

  function calculateMonthlyValues(incomes, expenses) {
    const monthlyIncome = incomes.reduce((total, income) => {
      const multiplier = {
        daily: 30,
        weekly: 4,
        biweekly: 2, // Add "biweekly" with a multiplier of 2
        monthly: 1,
        "one time payment": 1 / 12, // Divide by 12 for monthly equivalent
      }[income.frequency] || 1; // Default to 1 if frequency is unknown
      return total + income.amount * multiplier;
    }, 0);
  
    const monthlyExpenses = expenses.reduce((total, expense) => {
      const multiplier = {
        daily: 30,
        weekly: 4,
        biweekly: 2,
        monthly: 1,
        "one time payment": 1 / 12,
      }[expense.frequency] || 1;
      return total + expense.amount * multiplier;
    }, 0);
  
    return { monthlyIncome, monthlyExpenses };
  }
  console.log(expenses)
  const datasetarr = [
    {
      label: 'Income/Expenses',
      data: [users.income, ...expenses.map((expense) => expense.amount)],
      backgroundColor: ['blue', ...expenses.map(() => 'green')], // Adjust colors as needed
    }]
    console.log(datasetarr)
//   const labelsArr = ['Income', ...expenses.map((expense) => expense.category)]
//   console.log(labelsArr)
  // Prepare chart data only when incomes and expenses are available
  const data = incomes.length > 0 && expenses.length > 0 ? {
    labels: ['Income', ...expenses.map((expense) => expense.category)],
    datasets: [
      {
        label: 'Income/Expenses',
        data: [users.income, ...expenses.map((expense) => expense.amount)],
        backgroundColor: ['blue', ...expenses.map(() => 'green')], // Adjust colors as needed
      },
    ],
  } : null;

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      {data && <Bar data={data} options={options}/>}
      {!data && <p>Loading income and expense data...</p>}
    </div>
  );
};

export default IncomeToExpenses;
