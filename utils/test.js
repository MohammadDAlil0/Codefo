/**
 * 1) Compelete the required client's project
 * 2) Add some data to the database and test your APIs inputs
 * 3) Fix the get APIs to handle different fillterings 
 * 4) Work in points problem...
 * 5) Test your APIs
 * 6) change the DataBase to be hosted online
 * 7) Craete your beauty documentations
 */


let x = {}, cou = 1;

const arr = ['aa', 'bb', 'aa', 'cc', 'cc'];

arr.forEach(el => {
    if (!x[el]) {
        x[el] = cou++;
    }
});
console.log(Object.keys(x).length);