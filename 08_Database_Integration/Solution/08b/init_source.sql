CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    position VARCHAR(100),
    salary DECIMAL(10, 2)
);

INSERT INTO employees (name, position, salary) VALUES
('Alice', 'Engineer', 70000),
('Bob', 'Manager', 80000),
('Carol', 'Director', 90000);