import React, { useState, useEffect } from 'react';
import {
   Chart as ChartJS,
   ArcElement,
   Tooltip,
   Legend
} from 'chart.js'
import { Pie } from 'react-chartjs-2';

ChartJS.register(
   ArcElement,
   Tooltip,
   Legend
)

const IncomeToExpenses = ({ users }) => {
   const [chartData, setChartData] = useState({
       labels: ['One', 'Two', 'Three'],
       datasets: [
         {
           data:[3,6,9],
           backgroundColor: ['aqua', 'bloodorange', 'purple']
         }
       ]
      });

   // Map of frequencies to their corresponding multipliers
   const FREQUENCY_MULTIPLIERS = {
    'one time payment': 1,
    'daily': 30,
    'weekly': 4,
    'bi-weekly': 2,
    'monthly': 1,
   };

   // Function to convert an amount to monthly figures based on frequency
   function convertToMonthlyFigures(amount, frequency) {
    const multiplier = FREQUENCY_MULTIPLIERS[frequency];
    return amount * multiplier;
   }

   useEffect(() => {
       fetch(`/api/users/${users.id}`)
        .then((res) => res.json())
        .then((dataFromFetch) => {
          // Separate incomes and expenses
          const fetchedIncomes = dataFromFetch.incomes;
          const fetchedExpenses = dataFromFetch.expenses;

          // Sum up all incomes
            const totalIncome = fetchedIncomes.reduce((total, item) => total + convertToMonthlyFigures(item.amount, item.frequency), 0);
            const totalExpense = fetchedExpenses.reduce((total, item) => total + convertToMonthlyFigures(item.amount, item.frequency), 0);
            const netIncome = totalIncome - totalExpense;
          // Sum up all expenses of a certain category
          const totalExpensesByCategory = {};
          fetchedExpenses.forEach((item) => {

            if (!totalExpensesByCategory[item.category.name]) {
              totalExpensesByCategory[item.category.name] = 0;
            }
            totalExpensesByCategory[item.category.name] += convertToMonthlyFigures(item.amount, item.frequency);
            // console.log(totalExpensesByCategory)
          });
          console.log(totalExpensesByCategory)
          // Create the data for the pie chart
          const labels = [`Incomes:${totalIncome}`, `Expenses: ${totalExpense}`, `Net Income: ${netIncome}`];
        
            const data = [netIncome].concat(Object.values(totalExpensesByCategory));
            console.log(data)
            const COLORS =['red', 'black', 'blue','yellow', 'orange','purple', 'gray']
            console.log(Object.keys(totalExpensesByCategory))
            const colors = Object.keys(totalExpensesByCategory).map((_, i) => COLORS[i]);
            console.log(colors)

          setChartData({
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor:['green', ...colors],
              },
            ],
          });
        });
      }, [users]);

       
    return(
        <div className='Pie-Chart'>
            <h1>{users.name}'s Income to Expense Ratio</h1>
            <div
                style={
                    {
                    padding: '20px',
                    width:'50%'
                    }
                }/>
                <Pie data={chartData}/>
            </div>
    )
}

export default IncomeToExpenses;