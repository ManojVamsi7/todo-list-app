document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.querySelector('.login-container');
    const todoContainer = document.querySelector('.todo-container');
    const cardInner = document.querySelector('.card-inner');
    const registerBtn = document.getElementById('register-btn');
    const loginBackBtn = document.getElementById('login-back-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    const users = JSON.parse(localStorage.getItem('users')) || {};
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};

    let currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
        loginContainer.classList.remove('active');
        todoContainer.classList.add('active');
        loadTasks();
    } else {
        loginContainer.classList.add('active');
    }

    registerBtn.addEventListener('click', () => {
        cardInner.classList.add('flipped');
    });

    loginBackBtn.addEventListener('click', () => {
        cardInner.classList.remove('flipped');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        if (users[username] && users[username] === password) {
            currentUser = username;
            localStorage.setItem('currentUser', currentUser);
            loginContainer.classList.remove('active');
            todoContainer.classList.add('active');
            loadTasks();
        } else {
            alert('Invalid username or password');
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        if (users[username]) {
            alert('Username already exists');
        } else {
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful');
            cardInner.classList.remove('flipped');
        }
    });

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = todoInput.value;
        const taskTime = new Date().toLocaleString();

        if (!tasks[currentUser]) {
            tasks[currentUser] = [];
        }

        tasks[currentUser].unshift({ text: taskText, time: taskTime });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        todoInput.value = '';
        loadTasks();
    });

    function loadTasks() {
        todoList.innerHTML = '';
        if (tasks[currentUser]) {
            tasks[currentUser].forEach(task => {
                const li = document.createElement('li');
                li.classList.add('todo-item');
                li.innerHTML = `
                    <div>
                        <p>${task.text}</p>
                        <time>${task.time}</time>
                    </div>
                    <button class="delete-btn">Delete</button>
                `;
                todoList.appendChild(li);

                li.querySelector('.delete-btn').addEventListener('click', () => {
                    li.style.animation = 'slideOut 0.5s forwards';
                    li.addEventListener('animationend', () => {
                        tasks[currentUser] = tasks[currentUser].filter(t => t !== task);
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                        loadTasks();
                    });
                });
            });
        }
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        loginContainer.classList.add('active');
        todoContainer.classList.remove('active');
    });
});
