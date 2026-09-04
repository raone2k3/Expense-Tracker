const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const themeToggleEl = document.getElementById("theme-toggle");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);
themeToggleEl.addEventListener("click", toggleTheme);

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}
updateThemeToggle();

function toggleTheme() {
  const isDarkTheme = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  updateThemeToggle();
}

function updateThemeToggle() {
  const isDarkTheme = document.body.classList.contains("dark-theme");
  themeToggleEl.setAttribute("aria-pressed", isDarkTheme);
  themeToggleEl.setAttribute(
    "aria-label",
    isDarkTheme ? "Switch to light theme" : "Switch to dark theme",
  );
}

function addTransaction(e) {
  e.preventDefault();

  // get form values
  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  transactions.push({
    id: Date.now(),
    description,
    amount,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();

  if (description === "" || isNaN(amount)) {
    alert("please enter valid description and amount");
    return;
  }

  transactionFormEl.reset();
}

function updateTransactionList() {
  transactionListEl.innerHTML = "";

  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");
  li.innerHTML = `
    <div class="transaction-details">
      <span class="transaction-description">${transaction.description}</span>
      <small class="transaction-date">${formatDateTime(transaction.createdAt || transaction.id)}</small>
    </div>
    <div class="transaction-amount">${formatCurrency(transaction.amount)}
    <button class="delete-btn" onclick = "removeTransaction(${transaction.id})">x</button> 
    </div>
    `;

  return li;
}

function updateSummary() {
  // 100, -50, 100, -100 => 50
  const balance = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0,
  );

  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  // update the balance
  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expenses);
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
  }).format(number);
}

function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function removeTransaction(id) {
  // filter out the one is to delete by the user
  transactions = transactions.filter((transaction) => transaction.id !== id);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();
}

// initial render
updateTransactionList();
updateSummary();
