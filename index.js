#! /user/bin.env node
import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";
//customer class
class Customer {
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
//bank  class
class Bank {
    constructor() {
        this.customer = [];
        this.account = [];
    }
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transection(accObj) {
        let NewAccounts = this.account.filter((acc) => acc.accNumber !== accObj.accNumber);
        this.account = [...NewAccounts, accObj];
    }
}
let myBank = new Bank();
//customer creation
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName('male');
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number());
    const cus = new Customer(fName, lName, 25 + i * 2, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({
        accNumber: cus.accNumber, balance: 1000 * i * 100
    });
}
//Bank functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Plz select the service",
            choices: ["balance inquiry", "cash withraw", "cash deposit", "statment", "Exit"],
        });
        //balance inquiry
        if (service.select == "balance inquiry") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Your Account Number",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("invalid account number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green.bold(name?.firstName)}  ${chalk.green.bold(name?.lastName)} your account balance is ${chalk.bold.italic.blue(`$${account.balance}`)}`);
            }
        }
        //cash withraw
        if (service.select == "cash withraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Your Account Number",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("invalid account number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter The Amount You Want To withraw...",
                    name: "rupee",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("You Balance is insufficiant"));
                }
                let newBalance = account.balance - ans.rupee;
                //transection method call
                bank.transection({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        //cash deposit
        if (service.select == "cash deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Your Account Number",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("invalid account number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter The Amount You Want To Deposit...",
                    name: "rupee",
                });
                let newBalance = account.balance + ans.rupee;
                //transection method call
                bank.transection({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        //statment
        if (service.select == "statment") {
            console.log("statment");
        }
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
bankService(myBank);
// let cust1 = new Customer("razykhan", "sherbaz",42,"male",03120306090,28810);
// console.log(cust1)
