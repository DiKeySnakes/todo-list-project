'use strict';
import { format } from 'date-fns';

const App = (function () {
  const projectsContainer = document.querySelector('[data-projects-list]');
  const newProjectForm = document.querySelector('[data-new-project-form]');
  const tasksContainer = document.getElementById('tasksContainer');
  const projectTitle = document.querySelector('[data-project-title]');
  const taskCount = document.querySelector('[data-task-count]');
  const tasksCards = document.querySelector('[data-tasks-cards]');
  const taskFormTopCloseButton = document.querySelector(
    '[data-task-form-top-close-button]'
  );
  const taskFormBottomCloseButton = document.querySelector(
    '[data-task-form-bottom-close-button]'
  );
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

  const LOCAL_STORAGE_PROJECT = 'task.projects';
  const LOCAL_STORAGE_SELECTED_PROJECT_ID = 'task.selectedProjectId';
  let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT)) || [];
  let selectedProjectId = localStorage.getItem(
    LOCAL_STORAGE_SELECTED_PROJECT_ID
  );

  const createProject = (name) => {
    return { id: Date.now().toString(), name: name, tasks: [] };
  };

  const createTask = (priority, name, date, description) => {
    return {
      id: Date.now().toString(),
      priority: priority,
      name: name,
      date: date,
      description: description,
      complete: false,
    };
  };

  if (projects.length === 0) {
    projects.push(createProject('test project'));
    console.log('created test project');
    console.log(projects);
    selectedProjectId = projects[0].id;
    console.log(selectedProjectId);
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );
    selectedProject.tasks.push({
      id: '1671973451191',
      priority: 'low',
      name: 'test task one',
      date: '2022-12-25',
      description: 'test task one description',
      complete: false,
    });
    selectedProject.tasks.push({
      id: '1671973451192',
      priority: 'medium',
      name: 'test task two',
      date: '2022-12-26',
      description: 'test task two description',
      complete: false,
    });
    selectedProject.tasks.push({
      id: '1671973451193',
      priority: 'high',
      name: 'test task three',
      date: '2022-12-27',
      description: 'test task three description',
      complete: false,
    });
    selectedProject.tasks.push({
      id: '1671973451194',
      priority: 'high',
      name: 'test task four',
      date: '2022-12-28',
      description: 'test task four description',
      complete: false,
    });
    selectedProject.tasks.push({
      id: '1671973451195',
      priority: 'low',
      name: 'test task five',
      date: '2022-12-29',
      description: 'test task five description',
      complete: false,
    });
    selectedProject.tasks.push({
      id: '1671973451196',
      priority: 'medium',
      name: 'test task six',
      date: '2022-12-30',
      description: 'test task six description',
      complete: false,
    });
    selectedProject.tasks.push({
      id: '1671973451197',
      priority: 'high',
      name: 'test task seven',
      date: '2022-12-31',
      description: 'test task seven description',
      complete: false,
    });
    selectedProject.tasks.push({
      id: '1671973451198',
      priority: 'medium',
      name: 'test task eight',
      date: '2023-01-01',
      description: 'test task eight description',
      complete: false,
    });
    selectedProject.tasks.push({
      id: '1671973451199',
      priority: 'low',
      name: 'test task nine',
      date: '2023-01-02',
      description: 'test task nine description',
      complete: false,
    });
  }

  projectsContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'li') {
      selectedProjectId = e.target.dataset.projectId;
      save();
      render();
    }
  });

  tasksContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
      const selectedProject = projects.find(
        (project) => project.id === selectedProjectId
      );
      const selectedTask = selectedProject.tasks.find(
        (task) => task.id === e.target.id
      );
      selectedTask.complete = e.target.checked;
      save();
      renderTaskCount(selectedProject);
      render();
    }
  });

  clearCompleteTasksButton.addEventListener('click', (e) => {
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );
    selectedProject.tasks = selectedProject.tasks.filter(
      (task) => !task.complete
    );
    save();
    render();
  });

  deleteProjectButton.addEventListener('click', (e) => {
    projects = projects.filter((project) => project.id !== selectedProjectId);
    selectedProjectId = null;
    save();
    render();
  });

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
      acceptNewTaskData();
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
      acceptNewProjectData();
      addProject.setAttribute('data-bs-dismiss', 'modal');
      addProject.click();

      (() => {
        addProject.setAttribute('data-bs-dismiss', '');
      })();
    }
  };

  const acceptNewProjectData = () => {
    const projectName = newProjectNameInput.value;
    const project = createProject(projectName);
    projects.push(project);

    save();

    console.log(projects);

    render();
  };

  const acceptNewTaskData = () => {
    const newTaskPriority = newTaskPriorityInput.value;
    const newTaskName = newTaskNameInput.value;
    const newTaskDueDate = newTaskDueDateInput.value;
    const newTaskDescription = newTaskDescriptionInput.value;

    const task = createTask(
      newTaskPriority,
      newTaskName,
      newTaskDueDate,
      newTaskDescription
    );

    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );
    console.log(selectedProject);
    selectedProject.tasks.push(task);

    save();

    console.log(task);

    render();
  };

  const renderProjects = () => {
    projects.forEach((project) => {
      const projectElement = document.createElement('li');
      projectElement.dataset.projectId = project.id;
      projectElement.classList.add('project-name');
      projectElement.innerText = project.name;
      if (project.id === selectedProjectId) {
        projectElement.classList.add('active-project');
      }
      projectsContainer.appendChild(projectElement);
    });

    newProjectForm.reset();
  };

  const renderTasks = () => {
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );
    tasksCards.innerHTML = '';
    selectedProject.tasks.forEach((task) => {
      const tasksElement = document.importNode(tasksTemplate.content, true);
      const tasksDiv = tasksElement.querySelector('[data-tasks-div]');
      tasksDiv.id = task.id;
      console.log(task.id);
      const checkbox = tasksElement.querySelector('input');
      checkbox.id = task.id;
      checkbox.checked = task.complete;
      const label = tasksElement.querySelector('label');
      label.htmlFor = task.id;
      const priority = document.querySelector('data-priority');
      tasksDiv.dataset.priority = task.priority;
      console.log(task.priority);
      let nameSpan = tasksElement.querySelector('[data-task-name]');
      nameSpan.innerHTML = task.name;
      console.log(task.name);
      let dateSpan = tasksElement.querySelector('[data-task-date]');
      const dateObject = new Date(task.date);
      const dateDayOfWeek = format(dateObject, 'EEEE');
      const dateMonth = format(dateObject, 'MMMM');
      const dateDay = format(dateObject, 'd');
      const dateYear = format(dateObject, 'yyyy');
      const dateFormatted = `${dateDayOfWeek}, ${dateMonth} ${dateDay}, ${dateYear}`;
      dateSpan.innerHTML = dateFormatted;
      console.log(dateFormatted);
      let descriptionP = tasksElement.querySelector('[data-task-description]');
      descriptionP.innerHTML = task.description;
      console.log(task.description);
      console.log(task.complete);
      if (task.complete) {
        tasksDiv.classList.add('complete');
        nameSpan.dataset.taskName = 'complete';
        dateSpan.dataset.taskDate = 'complete';
        descriptionP.dataset.taskDescription = 'complete';
      }
      tasksCards.appendChild(tasksElement);
    });

    newTaskForm.reset();
  };

  const deleteTask = (e) => {
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );

    e.target.parentElement.parentElement.remove();

    selectedProject.tasks = selectedProject.tasks.filter(
      (task) => task.id !== e.target.parentElement.parentElement.id
    );

    save();
    render();

    console.log(selectedProject.tasks);
  };

  const editTask = (e) => {
    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );

    const selectedTask = e.target.parentElement.parentElement;

    const selectedTaskPriority = selectedProject.tasks.find(
      (task) => task.id === selectedTask.id
    ).priority;

    const selectedTaskName = selectedProject.tasks.find(
      (task) => task.id === selectedTask.id
    ).name;

    const selectedTaskDate = selectedProject.tasks.find(
      (task) => task.id === selectedTask.id
    ).date;

    const selectedTaskDescription = selectedProject.tasks.find(
      (task) => task.id === selectedTask.id
    ).description;

    newTaskPriorityInput.value = selectedTaskPriority;
    newTaskNameInput.value = selectedTaskName;
    newTaskDueDateInput.value = selectedTaskDate;
    newTaskDescriptionInput.value = selectedTaskDescription;

    save();

    selectedProject.tasks = selectedProject.tasks.filter(
      (task) => task.id !== e.target.parentElement.parentElement.id
    );

    taskFormTopCloseButton.onclick = () => {
      newTaskForm.submit();
    };

    taskFormBottomCloseButton.onclick = () => {
      newTaskForm.submit();
    };

    console.log(selectedProject.tasks);
  };

  tasksCards.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-trash-alt')) {
      deleteTask(e);
      renderTasks();
    } else if (e.target.classList.contains('fa-edit')) {
      editTask(e);
    } else {
      return;
    }
  });

  const clearElement = (element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  const save = () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECT, JSON.stringify(projects));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_PROJECT_ID, selectedProjectId);
  };

  const renderTaskCount = (selectedProject) => {
    const incompleteTaskCount = selectedProject.tasks.filter(
      (task) => !task.complete
    ).length;
    const taskString = incompleteTaskCount === 1 ? 'task' : 'tasks';
    taskCount.innerText = `${incompleteTaskCount} ${taskString} remaining`;
  };

  const render = () => {
    clearElement(projectsContainer);
    renderProjects();

    const selectedProject = projects.find(
      (project) => project.id === selectedProjectId
    );
    if (selectedProjectId == null) {
      tasksContainer.style.display = 'none';
    } else {
      tasksContainer.style.display = '';
      projectTitle.innerText = selectedProject.name;
      renderTaskCount(selectedProject);
      renderTasks(selectedProject);
    }
  };

  render();
})();

export { App };
