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
    console.log(e.target[0].value);
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
  constructor(project, title, description, dueDate, priority) {
    this.project = project;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}

const addNewTask = (
  project,
  title,
  description = '',
  dueDate = 'Today',
  priority = 'Medium'
) => {
  let newTask = new Task(project, title, description, dueDate, priority);
  if (title == '' || title == null) {
    console.log('Task needs a name');
  } else {
    project.addTask(newTask);
  }
};

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

const loadTasks = (name) => {
  if (name.charAt(name.length - 1) === 's') {
    $('.tasks-list-title').html(`${name}' Tasks`);
  } else {
    $('.tasks-list-title').html(`${name}'s Tasks`);
  }
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

// loadProjects if false wont add doms again, just return lists
const loadProjects = (run = true) => {
  let projectsList = [];

  if (JSON.parse(window.localStorage.getItem('projectsList'))) {
    let tempProjectsList = JSON.parse(
      window.localStorage.getItem('projectsList')
    );

    tempProjectsList.forEach((element) => {
      let project = new Project(element.name);
      projectsList.push(project);
      if (run) {
        addProjectDOM(element.name);
      }
    });

    console.log('Projects Loaded', projectsList)
    return projectsList;
  } else {
    return projectsList;
  }
};
