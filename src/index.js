import _ from 'lodash';

$(document).ready(() => {
  setName();

  $('form[name="add-project"]').submit(function (e) {
    console.log(e.target[0].value);
    addNewProject(e.target[0].value);
    e.target[0].value = '';
    e.preventDefault();
  });

  $('form[name="add-task"]').submit(function (e) {
    addNewTask(e.target[0].value);

    e.target[0].value = '';
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

  getName() {
    return this.name;
  }
}

class Task {
  constructor(title, description, dueDate, priority) {
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

  const id = `project-${name.replace(/ /, '-').toLowerCase()}`;
  p.setAttribute('id', id);
  p.innerHTML = name;

  div.append(p);
  projects.append(div);

  addProjectFunctions($(`#${id}`));
};

const addProjectFunctions = (dom) => {
  dom.on('click', function (e) {
    loadTasks(e.target.innerHTML);
    e.preventDefault();
  });
};

const addNewProject = (name) => {
  let projectsList = loadProjects(false);

  for (let i in projectsList) {
    if (name === projectsList[i].name) {
      return console.log('Proyect already exists');
    }
  }

  if (name == '' || name == null) {
    console.log('Proyect needs a name');
  } else {
    let newProyect = new Project(name);
    projectsList.push(newProyect);

    addProjectDOM(name);

    window.localStorage.setItem('projectsList', JSON.stringify(projectsList));
  }
};

const addNewTask = (
  title,
  description = 'Generic description',
  dueDate = 'Today',
  priority = 'medium'
) => {
  let projectName = $('.tasks-list-title').html().split("'")[0];
  console.log(projectName);

  if (title == '' || title == null) {
    console.log('Task needs a name');
  } else if (projectName === 'Tasks') {
    console.log('Select project first!');
  } else {
    let projectsList = loadProjects(false);
    let project = '';
    projectsList.forEach((element) => {
      if (element.name === projectName) {
        project = element;
        return project;
      }
    });
    console.log(project);

    let newTask = new Task(title, description, dueDate, priority);

    project.addTask(newTask);

    window.localStorage.setItem('projectsList', JSON.stringify(projectsList));
    loadTasks(project.name);
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
    // console.log('Projects Loaded', projectsList);
    return projectsList;
  } else {
    return projectsList;
  }
};

// loadTasks if false wont add doms again, just return lists
const loadTasks = (name, run = true) => {
  $('.tasks-list').empty();

  if (name.charAt(name.length - 1) === 's') {
    $('.tasks-list-title').html(`${name}' Tasks`);
  } else {
    $('.tasks-list-title').html(`${name}'s Tasks`);
  }

  let projectsList = loadProjects(false);

  projectsList.forEach((project) => {
    if (project.name === name) {
      project.tasks.forEach((task) => {
        addTaskDOM(task);
      });
    }
  });
};

const addTaskDOM = (task) => {
  const tasks = $('.tasks-list');

  const div = document.createElement('div');
  div.classList.add('task-div');

  const p = document.createElement('p');
  p.classList.add('task-name');

  const id = `project-${task.title.replace(/ /, '-').toLowerCase()}`;
  p.setAttribute('id', id);
  p.innerHTML = task.title;

  div.append(p);
  tasks.append(div);

  addTaskFunctions($(`#${id}`));
};

const addTaskFunctions = (dom) => {
  dom.on('click', function (e) {
    loadTaskDetails(e.target.innerHTML);
    e.preventDefault();
  });
};

const loadTaskDetails = (taskTitle) => {
  $('.no-task-selected').hide();
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

          addTaskDetailsDOM(task);
          return task;
        }
      });
    }
  });
};

const addTaskDetailsDOM = (task) => {
  $('#edit-task-input').val(task.title);
  $('.task-dueDate').html(task.dueDate);
  console.log(task.priority)
  $('#priority-options').val(task.priority);
  $('#edit-task-description').val(task.description);
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
