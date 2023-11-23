import "dotenv/config";
import pg from "pg";
import * as readline from "readline/promises";
import { stdin as input, stdout as output, exit, env } from "process";
const { Pool } = pg;

const prompt = readline.createInterface({ input, output });
let isRunning = true;

const pool = new Pool({
  host: "localhost",
  user: env.DB_USER,
  database: env.DATABASE,
  password: env.PASSWORD,
  port: parseInt(env.PORT),
});

console.log("Welcome to the Student Application!");

while (isRunning) {
  console.log("Here are your options:");
  console.log("1) Get all Students");
  console.log("2) Add new Student");
  console.log("3) Update Student email");
  console.log("4) Delete a Student");
  console.log("5) Exit");
  console.log();

  const option = parseInt(await prompt.question("Select your option: "));

  switch (option) {
    case 1: {
      await getAllStudents();
      break;
    }
    case 2: {
      const firstName = await prompt.question("Enter new student first name: ");
      const lastName = await prompt.question("Enter new student last name: ");
      const email = await prompt.question("Enter new student email: ");
      const enrollmentDate = await prompt.question(
        "Enter new student enrollment date: "
      );
      console.log();
      await addStudent(firstName, lastName, email, enrollmentDate);
      break;
    }
    case 3: {
      const studentId = await prompt.question("Enter student id: ");
      const email = await prompt.question("Enter new student email: ");
      console.log();
      await updateStudentEmail(studentId, email);
      break;
    }

    case 4: {
      const studentId = await prompt.question("Enter student id: ");
      await deleteStudent(studentId);
      console.log();
      break;
    }

    case 5:
      console.log("Bye then!");
      isRunning = false;
      break;
    default:
      console.log("ERROR: Invalid option");
      break;
  }
}

await pool.end();
prompt.close();
exit(); 

// HERE ARE ALL THE FUNCTIONS

async function getAllStudents() {
  const query = "SELECT * FROM students;";
  try {
    const results = await pool.query(query);
    console.log("Here are the results:");
    console.table(results.rows);
  } catch (error) {
    console.log(error);
    console.log("ERROR: There was an error getting all the students.");
  }
}

async function addStudent(firstName, lastName, email, enrollmentDate) {
  const query =
    "INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES ($1, $2, $3, $4) RETURNING *;";
  try {
    const results = await pool.query(query, [
      firstName,
      lastName,
      email,
      enrollmentDate,
    ]);
    console.log(
      "Successfully added a new studnet! Here is what the new student looks like:"
    );
    console.table(results.rows);
  } catch (error) {
    console.log(error);
    console.log("ERROR: There was an error adding the new student.");
  }
}

async function updateStudentEmail(studentId, newEmail) {
  const query =
    "UPDATE students SET email = $1 WHERE student_id = $2 RETURNING *;";
  try {
    const results = await pool.query(query, [newEmail, studentId]);
    console.log(
      "Successfully updated the studnet! Here is what the students looks like:"
    );
    console.table(results.rows);
  } catch (error) {
    console.log(error);
    console.log(
      `There was an error updating the student with id "${studentId}" with "${email}"`
    );
  }
}

async function deleteStudent(studentId) {
  const query = "DELETE from students WHERE student_id = $1;";
  try {
    await pool.query(query, [studentId]);
    console.log("Successfully deleted the student!");
  } catch (error) {
    console.log(error);
    console.log(
      `There was an error deleteing the student with id "${studentId}"`
    );
  }
}
