import _ from 'lodash';

$(document).ready(() => {
  setName();

  $('form[name="add-project"]').submit(function (e) {
    addNewProject(e.target[0].value);
    e.preventDefault();
  });

  console.log('Document Loaded!!');
});

class Project {
  constructor(name) {
    this.name = name;
  }

}

let addNewProject = (name) => {
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

let setName = () => {
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
