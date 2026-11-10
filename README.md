# Lab 7 — Travel Agency API (coursework practice)

This is the uploaded Lab 7 Express/MySQL application, completed using only module topics: `express`, `mysql2/promise`, `async/await`, REST/CRUD, SQL joins, dotenv, `bcryptjs` and JWT.

## 1. Start MySQL

1. Start MySQL Server (e.g. MySQL Workbench / Services on Windows).
2. In MySQL Workbench, run **database.sql**. This creates the `practice_lab` database and, if needed, its tables.
3. Copy `.env.example` to `.env` and fill in your actual MySQL connection details. Use a **long random** JWT secret. **Do not upload `.env`.**
4. In the VS Code terminal (opened in the project directory), run:

```bash
npm install
npm start
```

Expected: `Database connected and tables are ready` and `Server running at http://localhost:3000`.

### If you created the old USERS table already

Your original uploaded `database.sql` used `name` / `password_hash`, whereas the lecture screenshots use `USERNAME` / `PASSWORD` / `ROLE` / `MANAGER_ID`. `CREATE TABLE IF NOT EXISTS` does not change existing columns. If your current USERS table has **name** and **password_hash**, and you need to keep those rows, execute **upgrade_old_users_table.sql ONCE** in MySQL Workbench. **Do not run it if the table is already using USERNAME and PASSWORD.** If unsure, check with `DESCRIBE USERS;` first. Do not drop tables containing work you need.

## 2. Endpoints (Postman)

| Method | URL | Purpose |
|---|---|---|
| GET | / | Server test |
| GET | /users | Retrieve all users (no passwords) |
| GET | /users/employees-managers | List users and their managers (self-join) |
| GET | /users/1 | Retrieve one user |
| PUT | /users/1 | Update user's username, email and manager_id |
| DELETE | /users/1 | Delete user |
| POST | /auth/register | Register a user |
| POST | /auth/login | Log in and get a JWT |
| GET | /trips | Retrieve all trips |
| GET | /trips/1 | Retrieve trip by ID |
| POST | /trips | Create trip |
| PUT | /trips/1 | Update trip |
| DELETE | /trips/1 | Delete trip |
| GET | /reviews | Retrieve reviews (JOIN) |
| GET | /reviews/1 | Retrieve one review |
| POST | /reviews | Create review |
| PUT | /reviews/1 | Update review |
| DELETE | /reviews/1 | Delete review |

Use base URL `http://localhost:3000`, set Body -> raw -> JSON for POST/PUT.

### Examples (create in this order)

**1. POST /auth/register** (manager):
```json
{"username":"Ahmed","email":"ahmed@example.com","password":"Ahmed12345!","manager_id":null}
```
Save the returned `id` (example: 1).

**2. POST /auth/register** (employee):
```json
{"username":"Sara","email":"sara@example.com","password":"Sara12345!","manager_id":1}
```
Use Ahmed's actual ID, not necessarily 1.

**3. GET /users/employees-managers** — result includes each `employee` and corresponding `manager`. Users with no manager have a `null` manager because this is a LEFT JOIN.

**4. POST /trips**:
```json
{"destination":"Paris","country":"France","cost":500}
```

**5. POST /reviews** (use IDs that actually exist):
```json
{"user_id":1,"trip_id":1,"rating":5,"comment":"Excellent trip"}
```

**6. POST /auth/login**:
```json
{"email":"ahmed@example.com","password":"Ahmed12345!"}
```

## 3. The important SQL

```sql
SELECT e.ID, e.USERNAME AS employee,
       e.MANAGER_ID, m.USERNAME AS manager
FROM USERS AS e
LEFT JOIN USERS AS m ON e.MANAGER_ID = m.ID
ORDER BY e.ID;
```

This is a self-join (USERS used twice with aliases `e` and `m`). The manager foreign key points from `e.MANAGER_ID` to `m.ID`.

## 4. Git and submission

Use the separate `GIT_COMMITS.md` instructions. Commit your source, `.gitignore`, README and generated `package-lock.json`; **never commit `.env` or `node_modules`**.

## 5. Scope and safety

This is an **educational local lab**, not a public website. Passwords are hashed. The JWT is generated at login, but **write routes are not yet protected by JWT middleware**. The lecture covers auth middleware, but leave this project on localhost unless you implement and test authorization. Avoid putting real passwords or private data in test records.
