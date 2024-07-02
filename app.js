document.addEventListener('DOMContentLoaded', () => {
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');
  const searchInput = document.getElementById('search');
  const monthFilter = document.getElementById('month-filter');
  const report = document.getElementById('report');

  let expenses = [];

  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    const expense = { id: Date.now(), description, amount, date };
    expenses.push(expense);
    displayExpenses();
    displayReport();

    expenseForm.reset();
  });

  searchInput.addEventListener('input', displayExpenses);
  monthFilter.addEventListener('change', displayExpenses);

  function displayExpenses() {
    const searchValue = searchInput.value.toLowerCase();
    const monthValue = monthFilter.value;
    
    const filteredExpenses = expenses.filter(expense => 
      expense.description.toLowerCase().includes(searchValue) &&
      (monthValue ? new Date(expense.date).getMonth() + 1 == monthValue : true)
    );

    expenseList.innerHTML = filteredExpenses.slice(0, 10).map(expense => `
      <div class="expense-item">
        <span>${expense.description}</span>
        <span>$${expense.amount.toFixed(2)}</span>
        <span>${expense.date}</span>
        <button onclick="editExpense(${expense.id})">Edit</button>
        <button onclick="removeExpense(${expense.id})">Remove</button>
      </div>
    `).join('');
  }

  function displayReport() {
    const monthValue = monthFilter.value;
    const filteredExpenses = expenses.filter(expense => 
      (monthValue ? new Date(expense.date).getMonth() + 1 == monthValue : true)
    );
    
    const totalAmount = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    report.innerHTML = `
      <p>Total Expenses: $${totalAmount.toFixed(2)}</p>
      <ul>
        ${filteredExpenses.map(expense => `<li>${expense.date} - ${expense.description}: $${expense.amount.toFixed(2)}</li>`).join('')}
      </ul>
    `;
  }

  window.editExpense = function(id) {
    const expense = expenses.find(exp => exp.id === id);
    document.getElementById('description').value = expense.description;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('date').value = expense.date;
    expenses = expenses.filter(exp => exp.id !== id);
  };

  window.removeExpense = function(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    displayExpenses();
    displayReport();
  };
});
