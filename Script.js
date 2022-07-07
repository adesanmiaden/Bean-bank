"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: "Jonas Schmedtmann",
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? acc.movements.slice().sort((a,b) => a-b ) : acc.movements

  for (const [i, mov] of movs.entries()) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i])
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}</div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  }
};


// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);


const createUsernames = function(accs){
  accs.forEach(function (acc){
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};
createUsernames(accounts);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposit = movements.filter(mov => mov > 0)
// const withdrawal = movements.filter(mov => mov < 0);

const calcPrintBalance = function (acc){
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.innerHTML = `${acc.balance.toFixed(2)} EUR`;
}

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  const outcome = Math.abs(acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0))
  labelSumOut.textContent = `${outcome.toFixed(2)}€`;
  const interest = acc.movements.filter(mov => mov > 0).map(mov => mov * 0.012).filter(mov => mov >= 1).reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

const updateUI = function(acc){
  displayMovements(acc);
  calcPrintBalance(acc);
  calcDisplaySummary(acc);
}

const startLogOutTimer = function() {
  const tick = function(){
    const min = String(Math.trunc(time/60)).padStart(2, 0); 
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0){
      clearInterval (timer);
       labelWelcome.textContent = `Log in to get started`;
       containerApp.style.opacity = 0;
    }

    time--;
  }
  let time = 100;
  tick();
  const timer = setInterval (tick, 1000);

  return timer;
}
 
let currentAccount, timer
btnLogin.addEventListener('click', function(e){
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  
  if(currentAccount?.pin === +inputLoginPin.value){
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;

    //Date
    const date = new Date();
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const hour = `${date.getHours()}`.padStart(2, 0);
    const min = `${date.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
  }
  
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
  updateUI (currentAccount);
})

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = ''

  if (amount > 0 && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username && receiverAcc) {
    currentAccount.movements.push(-amount) 
    receiverAcc.movements.push(amount)

    //Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
})

btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value)
  //const anyDeposit = accounts.some(acc => acc.movements >= 0.10*loanAmount)
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    setTimeout(function() {
      currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date());

    updateUI(currentAccount)

    clearInterval(timer);
    timer = startLogOutTimer();
  }, 2500)
  }
  inputLoanAmount.value = '';   
})

btnClose.addEventListener('click', function(e){
  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === inputClosePin.value) {
    const index = accounts.findIndex(acc => acc.username === inputCloseUsername.value)
    accounts.splice(index, 1)

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
})

let sorted = false
.btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted; 
})

const z = Array.from({length: 7}, (_, i) => i+1);