import _ from 'lodash';

$(document).ready(() => {
  setName();

  const name = localStorage.getItem('name');

  $('.user-info').html(`${name}'s Projects`);

  console.log('Document Loaded!!');
});

let setName = () => {
  if (localStorage.getItem('name') === null) {
    const name = prompt("What's your name?");
    if (name === '' || name === null) {
      setName();
    } else {
      localStorage.setItem('name', name);
    }
  }
};
