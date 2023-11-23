# COMP 3005 Assignment 4

This is the GitHub repo that hosts the code for the application development portion of the COMP 3005 Assignment 4.

### Setup instructions

- Make sure you have PostgreSQL and Node.js installed
- Clone this repo to your computer
- Change to the directory and install all the dependencies with `npm install`
- Create a new database (make not of the name, user, port and password) and run the below query to set up the `students` table:

```sql
CREATE TABLE IF NOT EXISTS students (
	student_id SERIAL PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	enrollment_date DATE
);
```

- Seed the database using this query:

```sql
INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES
('John', 'Doe', 'john.doe@example.com', '2023-09-01'),
('Jane', 'Smith', 'jane.smith@example.com', '2023-09-01'),
('Jim', 'Beam', 'jim.beam@example.com', '2023-09-02');
```

- Inside the directory, create a `.env` file and populate it with values like this:

```env
DB_USER = <PostgreSQL password>
DATABASE = <name of the database>
PASSWORD = <PostgreSQL passward>
PORT = <port that your PostgreSQL server is running on>
```

This is neccassary so you can connect the your local PostgreSQL instance.

### How to run the application

To run the application, you can simply run `npm start` or `node .` insid the directory.

### Function explanations

- `getAllStudents()` - this function gets all the students using this query:

```sql
SELECT * FROM students;
```

It displays the result in a table and in the case of an error executing the query, the error itself will be printed out along with an error message.

- `addStudent(firstName, lastName, email, enrollmentDate)` - this function inserts a new student into the database using the provided parameters using this query:

```sql
INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES ($1, $2, $3, $4) RETURNING *;
```

It displays the newly inserted student in a table and in the case of an error executing the query, the error itself will be printed out along with an error message.

- `updateStudentEmail(studentId, newEmail)` - this function updates a student's email based on the provided `studentId` with the `newEmail` using this query:

```sql
UPDATE students SET email = $1 WHERE student_id = $2 RETURNING *;
```

It displays the updated student in a table and in the case of an error executing the query, the error itself will be printed out along with an error message.

- `deleteStudent(studentId)` - this function deletes a student based onthe provided `studentid` using this query:

```sql
DELETE from students WHERE student_id = $1;
```

It displays a successfull message if there is no error and in the case of an error executing the query, the error itself will be printed out along with an error message.

### Video demonstration
Here is the link to the video demonstation: 