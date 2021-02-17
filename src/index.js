import _ from 'lodash';

$(document).ready(() => {
  setName();

  $('form[name="add-project"]').submit(function (e) {
    console.log(e.target[0].value);
    addNewProject(e.target[0].value);
    e.target[0].value = '';
    e.preventDefault();
  });

  // console.log(JSON.parse(window.localStorage.getItem('projectsList')));

  loadProjects();

  console.log('Document Loaded!!!');
});

// loadProjects if false wont add doms again, just return lists
const loadProjects = (run = true) => {
  if (JSON.parse(window.localStorage.getItem('projectsList'))) {
    let projectsList = JSON.parse(window.localStorage.getItem('projectsList'));
    let projectsListNames = JSON.parse(
      window.localStorage.getItem('projectsListNames')
    );

    if (run) {
      projectsList.forEach((element) => {
        addProjectDOM(element.name);
      });
    }

    return { projectsList, projectsListNames };
  } else {
    let projectsList = [];
    let projectsListNames = [];

    return { projectsList, projectsListNames };
  }
};

class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
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

const addNewProject = (name) => {
  let lists = loadProjects(false);

  if (name == '' || name == null) {
    console.log('Proyect needs a name');
  } else if (lists.projectsListNames.includes(name)) {
    console.log('Proyect already exists');
  } else {
    lists.projectsListNames.push(name);

    let newProyect = new Project(name);
    lists.projectsList.push(newProyect);

    addProjectDOM(name);

    window.localStorage.setItem(
      'projectsList',
      JSON.stringify(lists.projectsList)
    );
    window.localStorage.setItem(
      'projectsListNames',
      JSON.stringify(lists.projectsListNames)
    );
  }
};

const addProjectDOM = (name) => {
  const projects = $('.projects');

  const div = document.createElement('div');
  div.classList.add('project-div');

  const p = document.createElement('p');
  p.classList.add('project-name');
  p.setAttribute('id', `project-${name}`);
  p.innerHTML = name;

  div.append(p);

  projects.append(div);
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
  $('.user-info').html(`${name}'s Projects`);
};
