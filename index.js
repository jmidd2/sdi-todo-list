const newListItemInnerHtml = `<span class="icon"><i class="fas fa-square"></i></span>
  <span class="list-text"></span>
  <span class="delete-icon icon has-text-danger"><i class="fas fa-trash"></i></span>`;

const clearBtn = document.querySelector('form #clear-btn');
const addBtn = document.querySelector('form #add-btn');
const todoInput = document.querySelector('form #todo-item');

const todoListElement = document.querySelector('ul.todo-list');

// incrementer to hold number of items until they are stored in an iterable
let i = 0;
let todoItems;

const populateTodoList = () => {
  todoItems.forEach((value, key) => {
    console.log(value);
    createNewListItem(value.todo, key, value.status);
  })
};

window.addEventListener('load', () => {
  if (getTodoItemsFromStorage()) {
    populateTodoList();
  }
});


clearBtn.addEventListener('click', event => {
  event.preventDefault();
  todoInput.value = '';
})
addBtn.addEventListener('click', event => {
  // TODO: Prevent adding if todoInput is blank and show error validation
  event.preventDefault();

  createNewListItem(todoInput.value);

  saveTodoItemsToStorage();
});

const createNewListItem = (itemValue, itemId, itemStatus) => {
  const existingElement = itemStatus === 'complete';
  itemId = itemId ? itemId : `list-item-${i}`;

  const newListItem = document.createElement('li');
  newListItem.classList.add('list-item');
  newListItem.id = itemId;
  newListItem.innerHTML = newListItemInnerHtml;
  newListItem.querySelector('.list-text').innerHTML = itemValue;

  todoListElement.appendChild(newListItem);

  const listItem = document.querySelector(`#${itemId}`);
  const listItemIcon = document.querySelector(`#${itemId} .icon i`);

  if (existingElement) {
    newListItem.classList.add('complete');
    listItemIcon.classList.remove('fa-square');
    listItemIcon.classList.add('fa-check-square');
  }

  if (!existingElement) {
    todoItems.set(itemId, {todo: itemValue, status: 'not-complete'});
  }

  newListItem.addEventListener('click', (event) => {
    // make sure the user did not click the delete icon
    if (!event.target.classList.contains('fa-trash')) {
      listItem.classList.toggle('complete');
      listItemIcon.classList.toggle('fa-square');
      listItemIcon.classList.toggle('fa-check-square');

      if(listItem.classList.contains('complete')) {
        // item is completed
        // update map
        console.log(todoItems.get(itemId));
        todoItems.get(itemId).status = 'complete';
      } else {
        console.log(itemId);
        todoItems.get(itemId).status = 'not-complete';
      }

      console.log('list', todoItems);

      saveTodoItemsToStorage();
      // TODO: Move completed tasks to the bottom of the list
    }
  });

  newListItem.querySelector('.delete-icon').addEventListener('click', () => {
    // TODO: change icon to spinner and add respective classes
    document.querySelector(`#${itemId}`).remove();
    todoItems.delete(itemId);
    saveTodoItemsToStorage();
  });


  i++;
};

const saveTodoItemsToStorage = () => {
  console.log('saved');
  if (todoItems.size > 0) {
    localStorage.todoItems = JSON.stringify([...todoItems]);
  }
};

const getTodoItemsFromStorage = () => {
  if (localStorage.todoItems) {
    todoItems = new Map(JSON.parse(localStorage.todoItems));
    return true;
  } else {
    todoItems = new Map();
  }
  return false;
};

/*
    TODO: Add some instructions to your README.md file around what your application is, how to run it, and how to use it.
    TODO: Archive completed tasks in a viewable location on screen

 */