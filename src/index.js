'use strict';
import './styles.css';

let form = document.getElementById('form');
let priorityInput = document.getElementById('priorityInput');
let textInput = document.getElementById('textInput');
let dateInput = document.getElementById('dateInput');
let textarea = document.getElementById('textarea');
let msg = document.getElementById('msg');
let tasks = document.getElementById('tasks');
let add = document.getElementById('add');
const tasksTemplate = document.getElementById('tasks-template');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  if (textInput.value === '') {
    console.log('failure');
    msg.innerHTML = 'Task cannot be blank';
  } else {
    console.log('success');
    msg.innerHTML = '';
    acceptData();
    add.setAttribute('data-bs-dismiss', 'modal');
    add.click();

    (() => {
      add.setAttribute('data-bs-dismiss', '');
    })();
  }
};

let data = [];

let acceptData = () => {
  data.push({
    id: Date.now().toString(),
    priority: priorityInput.value,
    text: textInput.value,
    date: dateInput.value,
    description: textarea.value,
  });

  localStorage.setItem('data', JSON.stringify(data));

  console.log(data);

  createTasks();
};

let createTasks = () => {
  tasks.innerHTML = '';
  data.forEach((task) => {
    const tasksElement = document.importNode(tasksTemplate.content, true);
    const tasksDiv = tasksElement.querySelector('[data-tasks-div]');
    tasksDiv.id = task.id;
    console.log(task.id);
    const priority = document.querySelector('data-priority');
    tasksDiv.dataset.priority = task.priority;
    console.log(task.priority);
    let nameSpan = tasksElement.querySelector('[data-task-name]');
    nameSpan.innerHTML = task.text;
    console.log(task.text);
    let dateSpan = tasksElement.querySelector('[data-task-date]');
    dateSpan.innerHTML = task.date;
    console.log(task.date);
    let descriptionP = tasksElement.querySelector('[data-task-description]');
    descriptionP.innerHTML = task.description;
    console.log(task.description);
    tasks.appendChild(tasksElement);
  });

  form.reset();
};

let deleteTask = (e) => {
  e.target.parentElement.parentElement.remove();

  data = data.filter(
    (task) => task.id !== e.target.parentElement.parentElement.id
  );

  localStorage.setItem('data', JSON.stringify(data));

  console.log(data);
};

let editTask = (e) => {
  let selectedTask = e.target.parentElement.parentElement;

  textInput.value = selectedTask.children[0].innerHTML;
  dateInput.value = selectedTask.children[1].innerHTML;
  textarea.value = selectedTask.children[2].innerHTML;

  deleteTask(e);
};

tasks.addEventListener('click', (e) => {
  if (e.target.classList.contains('fa-trash-alt')) {
    deleteTask(e);
    createTasks();
  } else if (e.target.classList.contains('fa-edit')) {
    editTask(e);
  } else {
    return;
  }
});

(() => {
  data = JSON.parse(localStorage.getItem('data')) || [];
  console.log(data);
  createTasks();
})();
