# Task Maker – A Next.js Application

**Task Maker** is a clean and scalable task management application built with **Next.js** and **PostgreSQL**, designed for simplicity and maintainability.

---

## Features

- Modular and maintainable project architecture  
- PostgreSQL backend for robust data storage  
- Secure, environment-based configuration  
- Optional styling with Tailwind CSS  

---

## Project Structure

The project follows a conventional full-stack structure with a clear separation between frontend and backend logic.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-maker.git
cd task-maker

2. Install Dependencies

npm install

3. Configure Environment Variables

Create a .env.local file in the root directory and add the following configuration:

DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
DB_SSL=false

DATABASE_URL=postgresql://your_db_user:your_db_password@your_db_host:5432/your_db_name

Replace the placeholder values with your actual database credentials.
4. Set Up the Database

Ensure your PostgreSQL database is running and accessible. Apply any required SQL schema manually or through your preferred migration tool.
5. Start the Development Server

npm run dev

Visit http://localhost:3000 in your browser to access the application.
Technology Stack

    Next.js – React framework for building full-stack applications

    PostgreSQL – Open-source relational database system

    Tailwind CSS (optional) – Utility-first CSS framework for rapid UI development
