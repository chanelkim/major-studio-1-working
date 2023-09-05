/*
  Exercise 2
  JavaScript quirks and tricks
*/

var schoolName = "Parsons";
var schoolYear = 1936;

// Task
// What is the value of test3?
var test1;
if (1 == true) {
  test1 = true;
} else {
  test1 = false;
}

var test2;
if (1 === true) {
  test2 = true;
} else {
  test2 = false;
}

var test3 = test1 === test2;
console.log(test3, "false");

// Task
// Change this code so test4 is false and test5 is true. Use console.log() to confirm your cod works.

var test4 = 0 === "";
var test5 = 1 == "1";

console.log("test4 is", test4, "and test 5 is", test5);

// Task
// What are the values of p, q, and r? Research what is going on here.
var w = 0.1;
var x = 0.2;
var y = 0.4;
var z = 0.5;

var p = w + x;
console.log("p = ", p);
console.log("fixed p = ", p.toFixed(1));

var q = z - x;
console.log("q = ", q);

var r = y - w;
console.log("r = ", r);
console.log("fixed r = ", r.toFixed(1));
/* chat GPT (accessed Sep 4, 2023): The reason addition or subtraction of decimal values like 0.1 and 0.2 in JavaScript may not produce "round" numbers as you expect is due to the way floating-point arithmetic works in computers.

JavaScript, like many programming languages, uses a binary floating-point representation (based on the IEEE 754 standard) to store and manipulate numbers. In this binary representation, not all decimal numbers can be represented exactly. As a result, you may encounter rounding errors when performing operations on decimal values.

For example, when you add 0.1 and 0.2, the result is not exactly 0.3 due to the binary representation limitations. Instead, you might get a value like 0.30000000000000004, which is very close to 0.3 but not identical. This discrepancy is a common issue in floating-point arithmetic.

To work with decimal numbers and avoid precision issues, you can use functions like toFixed() to round the result to a specific number of decimal places.
*/
