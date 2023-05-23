const newListItemInnerHtml = `<span class="icon"><i class="fas fa-square"></i></span>
  <span class="list-text"></span>
  <span class="delete-icon icon has-text-danger"><i class="fas fa-trash"></i></span>`;

const clearBtn = document.querySelector('form #clear-btn');
const addBtn = document.querySelector('form #add-btn');
const todoInput = document.querySelector('form #todo-item');

// incrementer to hold number of items until they are stored in an iterable
let i = 0;

clearBtn.addEventListener('click', event => {
  event.preventDefault();
  todoInput.value = '';
})
addBtn.addEventListener('click', event => {
  // TODO: Track todo in HashMap
  event.preventDefault();
  const newListItem = document.createElement('li');
  newListItem.classList.add('list-item');
  let newId = `list-item-${i}`
  newListItem.id = newId;
  newListItem.innerHTML = newListItemInnerHtml;
  newListItem.querySelector('.list-text').innerHTML = todoInput.value;
  document.querySelector('ul.todo-list').appendChild(newListItem);

  newListItem.addEventListener('click', (event) => {
    // make sure the user did not click the delete icon
    if (!event.target.classList.contains('fa-trash')) {
      document.querySelector(`#${newId}`).classList.toggle('complete');
      document.querySelector(`#${newId} .icon i`).classList.toggle('fa-square');
      document.querySelector(`#${newId} .icon i`).classList.toggle('fa-check-square');
    }
  });

  newListItem.querySelector('.delete-icon').addEventListener('click', () => {
    // TODO: change icon to spinner and add respective classes
    document.querySelector(`#${newId}`).remove();
  });

  i++;
});