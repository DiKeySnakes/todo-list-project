'use strict';
import './styles.css';

const projectsContainer = document.querySelector('[data-projects-list]');
const newProjectForm = document.querySelector('[data-new-project-form]');
// const newProjectNameInput = document.querySelector('[data-new-project-input]');
const tasksContainer = document.querySelector('[data-tasks-container]');
const projectTitle = document.querySelector('[data-project-title]');
const taskCount = document.querySelector('[data-task-count]');
const tasks = document.querySelector('[data-tasks]');
const clearCompleteTasksButton = document.querySelector(
  '[data-clear-complete-tasks-button]'
);
const deleteProjectButton = document.querySelector(
  '[data-delete-project-button]'
);

const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskPriorityInput = document.getElementById('newTaskPriorityInput');
const newTaskNameInput = document.getElementById('newTaskNameInput');
const newProjectNameInput = document.getElementById('newProjectNameInput');
const newTaskDueDateInput = document.getElementById('newTaskDueDateInput');
const newTaskDescriptionInput = document.getElementById(
  'newTaskDescriptionInput'
);
const newTaskMessage = document.getElementById('newTaskMessage');
const newProjectMessage = document.getElementById('newProjectMessage');
const addTask = document.getElementById('addTask');
const addProject = document.getElementById('addProject');
const tasksTemplate = document.getElementById('tasks-template');

newTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  newTaskFormValidation();
});

newProjectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  newProjectFormValidation();
});

const newTaskFormValidation = () => {
  if (newTaskNameInput.value === '') {
    console.log('failure');
    newTaskMessage.innerHTML = 'Task cannot be blank';
  } else {
    console.log('success');
    newTaskMessage.innerHTML = '';
    acceptData();
    addTask.setAttribute('data-bs-dismiss', 'modal');
    addTask.click();

    (() => {
      addTask.setAttribute('data-bs-dismiss', '');
    })();
  }
};

const newProjectFormValidation = () => {
  const projectName = newProjectNameInput.value;
  if (projectName == null || projectName === '') {
    console.log('failure');
    newProjectMessage.innerHTML = 'Project cannot be blank';
  } else {
    console.log('success');
    newProjectMessage.innerHTML = '';
    // acceptData();
    addProject.setAttribute('data-bs-dismiss', 'modal');
    addProject.click();

    (() => {
      addProject.setAttribute('data-bs-dismiss', '');
    })();
  }
};

let data = [];

let acceptData = () => {
  data.push({
    id: Date.now().toString(),
    priority: newTaskPriorityInput.value,
    text: newTaskNameInput.value,
    date: newTaskDueDateInput.value,
    description: newTaskDescriptionInput.value,
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

  newTaskForm.reset();
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

  newTaskNameInput.value =
    selectedTask.firstElementChild.children[1].textContent.trim();
  newTaskDueDateInput.value = selectedTask.children[1].innerHTML;
  newTaskDescriptionInput.value = selectedTask.children[2].innerHTML;

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
