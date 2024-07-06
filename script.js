document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById("auth-container");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegister = document.getElementById("show-register");
    const showLogin = document.getElementById("show-login");
    const card = document.querySelector(".card");
    const todoContainer = document.getElementById("todo-container");
    const logoutBtn = document.getElementById("logout-btn");
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");

    const saveUsers = (users) => {
        localStorage.setItem("users", JSON.stringify(users));
    };

    const loadUsers = () => {
        const savedUsers = localStorage.getItem("users");
        return savedUsers ? JSON.parse(savedUsers) : [];
    };

    const saveTodos = (username, todos) => {
        localStorage.setItem(`todos-${username}`, JSON.stringify(todos));
    };

    const loadTodos = (username) => {
        const savedTodos = localStorage.getItem(`todos-${username}`);
        return savedTodos ? JSON.parse(savedTodos) : [];
    };

    let currentUser = null;
    let users = loadUsers();
    let todos = [];

    const displayTodos = () => {
        todoList.innerHTML = "";
        todos.forEach((todo, index) => {
            const li = document.createElement("li");
            li.className = "todo-item";
            li.textContent = todo;
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                li.classList.add("deleting");
                setTimeout(() => {
                    todos.splice(index, 1);
                    saveTodos(currentUser, todos);
                    displayTodos();
                }, 300);
            });
            li.appendChild(deleteBtn);
            todoList.insertBefore(li, todoList.firstChild); // Add newest to the top
        });
    };

    const switchToRegister = () => {
        card.classList.add("flipped");
    };

    const switchToLogin = () => {
        card.classList.remove("flipped");
    };

    showRegister.addEventListener("click", switchToRegister);
    showLogin.addEventListener("click", switchToLogin);

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = loginForm.querySelector("#login-username").value;
        const password = loginForm.querySelector("#login-password").value;
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            currentUser = username;
            loginContainer.classList.add("hidden");
            todoContainer.classList.remove("hidden");
            todos = loadTodos(currentUser);
            displayTodos();
        } else {
            alert("Invalid username or password");
        }
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = registerForm.querySelector("#register-username").value;
        const password = registerForm.querySelector("#register-password").value;
        if (users.some(user => user.username === username)) {
            alert("Username already exists");
        } else {
            users.push({ username, password });
            saveUsers(users);
            alert("Registration successful");
            switchToLogin();
        }
    });

    logoutBtn.addEventListener("click", () => {
        loginContainer.classList.remove("hidden");
        todoContainer.classList.add("hidden");
    });

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        todos.unshift(todoInput.value); // Add newest to the beginning
        saveTodos(currentUser, todos);
        displayTodos();
        todoInput.value = "";
    });

    displayTodos();
});
