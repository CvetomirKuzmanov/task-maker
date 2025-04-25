# 📝 Task Maker – A Next.js App

A simple and organized task management tool built with **Next.js** and **PostgreSQL**.

## 🚀 Features

- Organized project structure for scalability
- Backend using PostgreSQL with Prisma ORM
- Environment-based configuration for secure setup

---

## 📁 Project Structure

Uses a normal ORM structure

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-maker.git
cd task-maker

2. Install dependencies

npm install

3. Configure Environment

Create a .env.local file in the root with your PostgreSQL connection string:

DATABASE_URL=postgresql://user:password@localhost:5432/taskmaker

    Replace user, password, and taskmaker with your actual credentials and database name.

4. Set up the database

npx prisma migrate dev --name init

This will initialize the database and apply the schema.
5. Start the development server

npm run dev

🧠 Tech Stack

    Next.js – React framework

    PostgreSQL – Relational database

    Prisma – Type-safe ORM for database access

    Tailwind CSS (optional) – For styling (if included)