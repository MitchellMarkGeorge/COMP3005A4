// all neccessary imports for the application
import "dotenv/config"; // responsible for loading the enviroment varibles into the process.env
import pg from "pg";
import * as readline from "readline/promises";
import { stdin as input, stdout as output, exit, env } from "process";
const { Pool } = pg;

// create a prompt interface to receive input from the user
const prompt = readline.createInterface({ input, output });
let isRunning = true;

// create a pool that can automatically create and dispose of clients that access the database
// this was done as this approach is easier to manage than normal clients, espesially with the while loop
// using enviroment variables so TA can test it out easily in thier own Postgres instance
const pool = new Pool({
  host: "localhost",
  user: env.DB_USER,
  database: env.DATABASE,
  password: env.PASSWORD,
  port: parseInt(env.PORT),
});

console.log("Welcome to the Student Application!");

// while loop so the application cotinuously runs unless explicitly closed via the exit option below
while (isRunning) {
  // print out the options
  console.log("Here are your options:");
  console.log("1) Get all Students");
  console.log("2) Add new Student");
  console.log("3) Update Student email");
  console.log("4) Delete a Student");
  console.log("5) Exit");
  console.log();

  // promp the option from the user and convert it into an integer
  const option = parseInt(await prompt.question("Select your option: "));

  // switch case to handle each option
  switch (option) {
    case 1: {
      // call the getAllStudents function
      await getAllStudents();
      break;
    }
    case 2: {
      // prompt the user for the neccessary information for the addStudent function
      const firstName = await prompt.question("Enter new student first name: ");
      const lastName = await prompt.question("Enter new student last name: ");
      const email = await prompt.question("Enter new student email: ");
      // date format: yyyy-mm-dd
      const enrollmentDate = await prompt.question(
        "Enter new student enrollment date: "
      );
      console.log();
      // call the addStudent function with the recieved information
      await addStudent(firstName, lastName, email, enrollmentDate);
      break;
    }
    case 3: {
      // prompt the user for a studentId and email
      const studentId = await prompt.question("Enter student id: ");
      const email = await prompt.question("Enter new student email: ");
      console.log();
      // call the updateStudentEmail function with the received studentId and email
      await updateStudentEmail(studentId, email);
      break;
    }

    case 4: {
      // prompt the user for a studentId
      const studentId = await prompt.question("Enter student id: ");
      // call the deletestudent function with the received studentId
      await deleteStudent(studentId);
      console.log();
      break;
    }

    case 5:
      console.log("Bye then!");
      // break the loop so the application can exit/cleanup
      isRunning = false;
      break;
    default:
      // print out an error message if an invalid option is entered and continue the loop
      console.log("ERROR: Invalid option");
      break;
  }
}

// clean up by ending the database pool and closing the prompt interface
await pool.end();
prompt.close();
// finally exit the program
exit();

// HERE ARE ALL THE FUNCTIONS

async function getAllStudents() {
  // SQL query to get all the students
  const query = "SELECT * FROM students;";
  try {
    // execute the query
    const results = await pool.query(query);
    console.log("Here are the results:");
    // log the results to the console using a table
    console.table(results.rows);
  } catch (error) {
    // if an error happened when executing the query, print out the error along with an error message
    console.log(error);
    console.log("ERROR: There was an error getting all the students.");
  }
}

async function addStudent(firstName, lastName, email, enrollmentDate) {
  // SQL query to insert a new student with some given values and return the newly inserted student
  const query =
    "INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES ($1, $2, $3, $4) RETURNING *;";
  try {
    // execute the query with the given valules
    const results = await pool.query(query, [
      firstName,
      lastName,
      email,
      enrollmentDate,
    ]);
    console.log(
      "Successfully added a new studnet! Here is what the new student looks like:"
    );
    // log the newly inserted student using a table
    console.table(results.rows);
  } catch (error) {
    // if an error happened when executing the query, print out the error along with an error message
    console.log(error);
    console.log("ERROR: There was an error adding the new student.");
  }
}

async function updateStudentEmail(studentId, newEmail) {
  // SQL query to insert a given student's email (based on student_id) and return the updated student
  const query =
    "UPDATE students SET email = $1 WHERE student_id = $2 RETURNING *;";
  try {
    // execute the query with the given valules
    const results = await pool.query(query, [newEmail, studentId]);
    console.log(
      "Successfully updated the studnet! Here is what the students looks like:"
    );
    // log the updated student using a table
    console.table(results.rows);
  } catch (error) {
    // if an error happened when executing the query, print out the error along with an error message
    console.log(error);
    console.log(
      `There was an error updating the student with id "${studentId}" with "${email}"`
    );
  }
}

async function deleteStudent(studentId) {
  // SQL query to delete a student based on student_id
  const query = "DELETE from students WHERE student_id = $1;";
  try {
    // execute the query with the given student_id
    await pool.query(query, [studentId]);
    // if success, print a success message
    console.log("Successfully deleted the student!");
  } catch (error) {
    // if an error happened when executing the query, print out the error along with an error message
    console.log(error);
    console.log(
      `There was an error deleteing the student with id "${studentId}"`
    );
  }
}
