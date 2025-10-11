
-----

# School Management System

**Group ID:** 46
**Project title:** EduAxis
**SPOC:** balaji sai surya, balaji.s23@iiits.in, S20230010211

This **School Management System** is a comprehensive platform designed to streamline and manage school operations efficiently. The system includes features for administrators, teachers, students, and parents, providing a unified solution for school management.

-----

## Team Members & Roles

  * **Member 1**
      * Design user interfaces: Login/Sign-Up, Dashboards, About, Contact Us.
      * Ensure responsiveness and smooth navigation.
  * **Member 2**
      * Handle server-side logic: authentication, APIs for attendance, grades, and payments.
      * Integrate PayPal and other APIs securely.
  * **Member 3**
      * Design and maintain the database for users, attendance, grades, and reports.
      * Optimize queries and implement backups.
  * **Member 4**
      * Create dynamic graphs and reports using Chart.js/D3.js.
      * Build analytics dashboards for admin and parents.
  * **Member 5**
      * Coordinate tasks, track progress, and ensure deadlines.
      * Conduct testing, fix bugs, and prepare documentation.

-----

## Features

### 🏫 Administrator Dashboard

  - Manage student, teacher, and parent profiles.
  - Oversee class schedules and assignments.
  - Generate reports and analytics for school performance.

**Test Credentials:**

  - **Username:** `admin`
  - **Password:** `adminpassword`

### 📚 Teacher Portal

  - Manage class rosters and attendance.
  - Assign and grade homework and exams.
  - View detailed performance reports for each student.

**Test Credentials:**

  - **Username:** `teacher`
  - **Password:** `teacherpassword`

### 🎓 Student Portal

  - View class schedules and upcoming events.
  - Submit assignments and track grades.
  - Communicate with teachers.

**Test Credentials:**

  - **Username:** `student`
  - **Password:** `studentpassword`

### 📊 Reports & Analytics

  - Student performance insights.
  - Attendance tracking.
  - Teacher efficiency reports.

-----

## Technologies Used

  - **Backend:** Node.js, Javascript, Mongoose
  - **Frontend:** Ejs, Javascript, Css
  - **Database:** MongoDB

-----

## Setup Instructions

1.  Clone the repository:
    ```bash
    https://github.com/yashwanth04112005/new_eduAxis
    ```
2.  Navigate to the project directory:
    ```bash
    cd new_eduAxis
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Configure the environment variables in the `.env` file.
5.  Start the development server:
    ```bash
    npm start
    ```