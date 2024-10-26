# Rule Engine Application with Abstract Syntax Tree (AST)

## Overview
The **Rule Engine Application** is a 3-tier architecture-based application that allows users to define, combine, evaluate, and modify eligibility rules. It uses an Abstract Syntax Tree (AST) to represent conditions, enabling dynamic and complex rule management.

## Features
- **Rule Creation**: Define eligibility rules based on criteria like age, department, income, etc.
- **Rule Combination**: Combine multiple rules using logical operators (AND/OR) to form a new rule.
- **Rule Evaluation**: Test if user data meets the specified conditions of a rule.
- **Rule Modification**: Modify existing rules by adjusting their logic.
- **Data Validation**: Handle invalid rule formats and ensure error-free rule execution.

---

## Project Structure
- **Frontend**: React-based UI for managing rules, including creation, evaluation, and modification.
- **Backend**: Node.js and Express.js API with MongoDB for rule storage.
- **Data**: MongoDB stores rule data and AST representations.

---

## Installation and Setup

### Prerequisites
1. **Node.js** (>= v14.0) and **npm**: Install from [Node.js Official Website](https://nodejs.org/).
2. **MongoDB**: Ensure a running MongoDB instance. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB server.
3. **Environment Variables**:
   - Create a `.env` file in the backend folder.
   - Define `MONGO_URI` in `.env` with your MongoDB connection string.

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/rule-engine-ast.git
   cd rule-engine-ast
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start MongoDB** (Skip if using MongoDB Atlas)

5. **Run the Backend Server**
   - Navigate to the backend folder and start the server:
     ```bash
     cd ../backend
     npm start
     ```
   - Backend will run on `http://localhost:5000`.

6. **Run the Frontend Server**
   - Navigate to the frontend folder and start the frontend server:
     ```bash
     cd ../frontend
     npm start
     ```
   - Frontend will run on `http://localhost:3000`.

---

## API Endpoints

### 1. Create a Rule
   - **Endpoint**: `POST /api/rules/create`
   - **Body**: `{ "rule": "age > 30 && department === 'Sales'" }`
   - **Response**: Returns the created rule with its AST representation.

### 2. Evaluate a Rule
   - **Endpoint**: `POST /api/rules/evaluate`
   - **Body**: `{ "ast": {...}, "data": { "age": 35, "department": "Sales" } }`
   - **Response**: `{ "result": true | false }` based on evaluation.

### 3. Combine Rules
   - **Endpoint**: `POST /api/rules/combine`
   - **Body**: `{ "ruleIds": ["id1", "id2"], "operator": "&&" | "||" }`
   - **Response**: Returns a new combined rule and its AST.

### 4. Modify a Rule
   - **Endpoint**: `PUT /api/rules/modify/:id`
   - **Body**: `{ "modifications": { "operator": ">", "value": 50000 } }`
   - **Response**: Updated rule with modified AST.

---

## Design Choices

### 1. **AST Representation**
   - Using AST allows for efficient and flexible rule management by breaking down each rule into nodes.
   - Each node can represent operators (AND/OR) or conditions (age > 30), which supports complex nested rules.

### 2. **MongoDB for Storage**
   - MongoDB is used to store rules and their ASTs, leveraging JSON-like storage for flexibility.
   - Schema design includes fields for rule strings, AST structures, and timestamps for audit purposes.

### 3. **React-based UI**
   - Modularized React components (e.g., CreateRuleForm, RuleEvaluator) manage rule creation, evaluation, and display.
   - Components dynamically fetch and display rules, combined with interactive elements for seamless user experience.

---

## Dependencies

### Backend
- `express`: Web server framework for Node.js.
- `mongoose`: MongoDB object modeling for schema definition and interaction.
- `dotenv`: Loads environment variables from `.env`.
- `jsep`: Parses rule strings into AST format.

### Frontend
- `react`: JavaScript library for building the UI.
- `axios`: Promise-based HTTP client for making API requests.

---

## Testing and Usage
1. **Create Rule**: Use the “Create Rule” UI to input rule criteria, which generates and displays its AST.
2. **Combine Rules**: Select multiple rules and combine them using logical operators.
3. **Evaluate Rule**: Enter user data in the evaluator to test rule compliance.
4. **Modify Rule**: Select a rule to adjust its conditions or operators dynamically.

