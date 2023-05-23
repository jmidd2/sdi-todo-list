const newListItemInnerHtml = `<span class="icon"><i class="fas fa-square"></i></span>
  <span class="list-text"></span>
  <span class="delete-icon icon has-text-danger"><i class="fas fa-trash"></i></span>`;

const clearBtn = document.querySelector('form #clear-btn');
const addBtn = document.querySelector('form #add-btn');
const todoInput = document.querySelector('form #todo-item');

const todoListElement = document.querySelector('ul.todo-list');
const helpElement = document.querySelector('form .field .help');

// incrementer to hold number of items until they are stored in an iterable
let i = 0;
let todoItems;

const saveTodoItemsToStorage = () => {
  console.log('saved');
  if (todoItems.size > 0) {
    localStorage.todoItems = JSON.stringify([...todoItems]);
  } else {
    localStorage.todoItems = '';
  }
};

const getTodoItemsFromStorage = () => {
  if (localStorage.todoItems) {
    todoItems = new Map(JSON.parse(localStorage.todoItems));
    return true;
  } else {
    todoItems = new Map();
    document.querySelector('.todos').classList.add('is-hidden');
  }
  return false;
};

window.addEventListener('load', () => {
  if (getTodoItemsFromStorage()) {
    populateTodoList();
  }
});

const populateTodoList = () => {
  todoItems.forEach((value, key) => {
    console.log(value);
    createNewListItem(value.todo, key, value.status);
  })
};

const validateInputs = () => {
  if (todoInput.value) {
    todoInput.removeEventListener('keyup', removeValidationErrors);
    return true;
  }

  todoInput.classList.add('is-danger');
  helpElement.classList.add('is-danger');
  helpElement.innerHTML = 'Task input cannot be blank.';

  todoInput.addEventListener('keyup', removeValidationErrors);

  return false;
};

const removeValidationErrors = (event) => {
  if (!(event.key === 'Enter' || event.key === 'NumpadEnter')) {
    todoInput.classList.remove('is-danger');
    helpElement.classList.remove('is-danger');
    helpElement.innerHTML = '';
  }
}

const getNewItemId = (itemId) => {
  if (itemId) {
    return itemId;
  }

  // make sure the current list key is not in the Map
  while (todoItems.has(`list-item-${i}`)) {
    i++;
  }

  return `list-item-${i}`;
};
const createNewListItem = (itemValue, itemId, itemStatus) => {
  const existingElement = itemStatus === 'complete';

  itemId = getNewItemId(itemId);
  // itemId = itemId ? itemId : `list-item-${i}`;

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
        todoItems.get(itemId).status = 'complete';

        let completedTodoElement = listItem;
        todoListElement.removeChild(completedTodoElement);
        todoListElement.appendChild(completedTodoElement);

      } else {
        console.log(itemId);
        todoItems.get(itemId).status = 'not-complete';
      }

      todoItems = new Map([...todoItems].sort((a) => {
        /**
         * > 0  sort a after b, e.g. [b, a]
         * < 0  sort a before b, e.g. [a, b]
         * === 0  keep original order of a and b
         */
        if (a[1].status === 'complete') {
          return 1;
        }
        if (a[1].status === 'not-complete') {
          return -1;
        }
        return 0;
      }));

      saveTodoItemsToStorage();
    }
  });

  newListItem.querySelector('.delete-icon').addEventListener('click', () => {
    listItem.classList.remove('complete', 'not-complete');
    listItem.classList.add('spinner');
    listItemIcon.classList.remove('fa-square', 'fa-check-square');
    listItemIcon.classList.add('fa-spinner', 'fa-pulse');
    setTimeout(() => {
      document.querySelector(`#${itemId}`).remove();
      todoItems.delete(itemId);
      saveTodoItemsToStorage();
      if (todoItems.size === 0) {
        document.querySelector('.todos').classList.add('is-hidden');
      }
    }, 1000);
  });

  i++;
};

const addNewTodoCallback = (event) => {
  event.preventDefault();

  if (validateInputs()) {
    document.querySelector('.todos').classList.remove('is-hidden');
    createNewListItem(todoInput.value);
    saveTodoItemsToStorage();
    todoInput.value = '';
  }
}

addBtn.addEventListener('click', addNewTodoCallback);

document.querySelector('form').addEventListener('submit', addNewTodoCallback);

clearBtn.addEventListener('click', event => {
  event.preventDefault();
  todoInput.value = '';
});

/*
    TODO: Add some instructions to your README.md file around what your application is, how to run it, and how to use it.
 */