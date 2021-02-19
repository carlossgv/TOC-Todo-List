import _ from 'lodash';
import { formatDistance, subDays } from 'date-fns';

$(document).ready(() => {
  setName();

  $('form[name="add-project"]').submit(function (e) {
    addNewProject(e.target[0].value);
    e.target[0].value = '';
    e.preventDefault();
  });

  $('form[name="add-task"]').submit(function (e) {
    addNewTask(
      $('#new-task-input').val(),
      $('.new-task-description textarea').val(),
      $('.new-task-dueDate input').val(),
      $('.new-task-priority select').val()
    );

    cleanAddTaskForm();
    e.preventDefault();
  });

  $('#new-task-input').focus(function (e) {
    showNewTaskOptions();
    e.preventDefault();
  });

  loadProjects();

  console.log('Document Loaded!!!');
});

class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(taskToRemove) {
    this.tasks = _.remove(this.tasks, function (task) {
      return task != taskToRemove;
    });
    return this.tasks;
  }

  getName() {
    return this.name;
  }
}

class Task {
  constructor(title, description = '', dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}

const addProjectDOM = (name) => {
  const projects = $('.projects');

  const div = document.createElement('div');
  div.classList.add('project-div');

  const p = document.createElement('p');
  p.classList.add('project-name');

  const id = `project-${_.kebabCase(name)}`;
  p.setAttribute('id', id);
  p.innerHTML = name;

  div.append(p);
  projects.append(div);

  addProjectFunctions($(`#${id}`));
};

const addProjectFunctions = (dom) => {
  dom.on('click', function (e) {
    let projectsList = loadProjects(false);

    projectsList.forEach((project) => {
      if (e.target.innerHTML === project.name) {
        loadTasks(project);
      }
    });

    e.preventDefault();
  });
};

const addNewProject = (projectName) => {
  let projectsList = loadProjects(false);

  for (let i in projectsList) {
    if (projectName === projectsList[i].name) {
      return alert('Proyect already exists, please enter another name');
    }
  }

  if (projectName == '' || projectName == null) {
    console.log('Proyect needs a name');
  } else {
    let newProyect = new Project(projectName);
    projectsList.push(newProyect);

    addProjectDOM(projectName);

    window.localStorage.setItem('projectsList', JSON.stringify(projectsList));

    loadTasks(newProyect);
  }
};

const addNewTask = (title, description, dueDate, priority) => {
  let projectName = $('.tasks-list-title').html().split("'")[0];

  if (title == '' || title == null) {
    console.log('Task needs a name');
  } else if (projectName === 'Tasks') {
    alert('Select project to add task first');
  } else {
    let projectsList = loadProjects(false);
    let project = '';
    projectsList.forEach((element) => {
      if (element.name === projectName) {
        project = element;

        project.tasks.forEach((projectTask) => {
          if (projectTask.title === title) {
            alert('Task already created');
            project = false;
          }
        });

        return project;
      }
    });

    if (project) {
      let newTask = new Task(title, description, dueDate, priority);

      project.addTask(newTask);

      window.localStorage.setItem('projectsList', JSON.stringify(projectsList));
      $('.new-task-details').addClass('hidden');
      loadTasks(project);
    }
  }
};

// loadProjects if false wont add doms again, just return lists
const loadProjects = (run = true) => {
  let projectsList = [];

  if (JSON.parse(window.localStorage.getItem('projectsList'))) {
    let tempProjectsList = JSON.parse(
      window.localStorage.getItem('projectsList')
    );

    tempProjectsList.forEach((element) => {
      let tempTasks = element.tasks;

      let project = new Project(element.name);
      tempTasks.forEach((task) => {
        project.addTask(task);
      });

      projectsList.push(project);
      if (run) {
        addProjectDOM(project.name);
      }
    });
    console.log('Projects Loaded', projectsList);
    return projectsList;
  } else {
    return projectsList;
  }
};

// loadTasks if false wont add doms again, just return lists
const loadTasks = (project) => {
  $('.tasks-list').empty();

  if (project.name.charAt(project.name.length - 1) === 's') {
    $('.tasks-list-title').html(`${project.name}' Tasks`);
  } else {
    $('.tasks-list-title').html(`${project.name}'s Tasks`);

    console.log(project.tasks);
  }

  project.tasks.forEach((task) => {
    addTaskDOM(task, project);
  });
};

const addTaskDOM = (task, project) => {
  const tasks = $('.tasks-list');

  const div = document.createElement('div');
  div.classList.add('task-div');

  const p = document.createElement('p');
  p.classList.add('task-name');

  const id = `${_.kebabCase(project.name)}-${_.kebabCase(task.title)}`;
  p.setAttribute('id', id);
  p.innerHTML = task.title;

  div.append(p);

  let p2 = document.createElement('p');
  p2.classList.add('task-dueDate');

  
  p2.innerHTML = task.dueDate;

  div.append(p2);

  tasks.append(div);

  addTaskFunctions($(`#${id}`));
  console.log('im adding tasks doms');
};

const addTaskFunctions = (dom) => {
  dom.on('click', function (e) {
    console.log('im adding task functions');
    loadTaskDetails(e.target.innerHTML);
    e.preventDefault();
  });
};

const loadTaskDetails = (taskTitle) => {
  $('.no-task-selected').addClass('hidden');
  $('.task-selected').removeClass('hidden');

  const projectName = $('.tasks-list-title').html().split("'")[0];
  let project = '';
  let task = '';
  const projectsList = loadProjects(false);

  projectsList.forEach((projectElement) => {
    if (projectElement.name === projectName) {
      project = projectElement;

      project.tasks.forEach((taskElement) => {
        if (taskElement.title === taskTitle) {
          task = taskElement;

          addTaskDetailsDOM(task, project);
          return task;
        }
      });
    }
  });
};

const addTaskDetailsDOM = (task, project) => {
  $('.datepicker').datepicker({
    todayBtn: true,
    autoclose: true,
    todayHighlight: true,
  });

  $('#edit-task-input').val(task.title);

  $('.edit-task-dueDate input').datepicker('setDate', task.dueDate);
  $('#edit-priority-options').val(task.priority);
  $('#edit-task-description').val(task.description);

  $('.delete-task-button').click(function (e) {
    deleteTask(task, project);
    e.preventDefault();
  });
};

const deleteTask = (task, project) => {
  // Storage handling
  let projectsList = loadProjects(false);
  let index = _.findIndex(projectsList, project);

  let cleanedTasks = project.removeTask(task);
  project.tasks = cleanedTasks;

  projectsList.splice(index, 1, project);
  console.log(project);

  console.log('before saving', projectsList);

  window.localStorage.setItem('projectsList', JSON.stringify(projectsList));

  // DOM handling
  $(`#${_.kebabCase(project.name)}-${_.kebabCase(task.title)}`).parent().remove();

  $('.task-selected').addClass('hidden');
  $('.no-task-selected').removeClass('hidden');
};

const setName = () => {
  if (localStorage.getItem('name') === null) {
    const name = prompt("What's your name?");
    if (name === '' || name === null) {
      setName();
    } else {
      localStorage.setItem('name', name);
    }
  }
  const name = localStorage.getItem('name');

  if (name.charAt(name.length - 1) === 's') {
    $('.user-info').html(`${name}' Projects`);
  } else {
    $('.user-info').html(`${name}'s Projects`);
  }
};

const showNewTaskOptions = () => {
  $('.new-task-details').removeClass('hidden');
  $('#close-addTask').removeClass('hidden');
  $('.datepicker').datepicker({
    todayBtn: true,
    autoclose: true,
    todayHighlight: true,
  });

  $('.new-task-dueDate input').datepicker('setDate', new Date());
  $('#close-addTask').click(function (e) {
    cleanAddTaskForm();
    $('.new-task-details').addClass('hidden');
    $('#close-addTask').addClass('hidden');
    e.preventDefault();
  });
};

const cleanAddTaskForm = () => {
  $('#close-addTask').addClass('hidden');
  $('#new-task-input').val(''),
    $('.new-task-dueDate input').datepicker('setDate', new Date());
  $('.new-task-priority select').val('medium'),
    $('.new-task-description textarea').val('');
};
