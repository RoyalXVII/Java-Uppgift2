const form = document.querySelector('#form');
const input = document.querySelector('#input');
const output = document.querySelector('#output');

let todos = []

// fetch Todos
const fetchTodos = async () => {
  let url = 'https://jsonplaceholder.typicode.com/todos';

  const res = await fetch(url);
  const _todos = await res.json();

  todos = _todos;

  listTodos(todos); // list all todos from api
}
fetchTodos(); // run fetchTodos

const listTodos = (todos) => {
  output.innerHTML = '';

  // A loop that creates a todo for every item we get from the api
  todos.forEach(todo => {
    output.innerHTML += newTodo(todo);
  })
}

const newTodo = todo => {

  // if item has completed = true print this as html element
  let template = todo.completed ? ` 
  <div id="${todo.id}" class="todo completed">
    <h3 class="title">${todo.title}</h3>
    <button class="btn btn-danger">X</button>
  </div>
  `
  // if item has completed = false print this as html element instead
  : `
  <div id="${todo.id}" class="todo">
    <h3 class="title">${todo.title}</h3>
    <button class="btn btn-danger">X</button>
  </div>
  `
  return template
}

// When we create a new todo from our input:
const createTodo = async title => {
  let url = 'https://jsonplaceholder.typicode.com/todos';

  // Our new todo:
  const _todo = {
    title,
    completed: false
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(_todo)
  })

  const todo = await res.json()

  console.log(todo);
  todo.id = Date.now(); // generates random id, (method returns the number of milliseconds elapsed since January 1)

  todos.unshift(todo) // adds our new todo to the beginning of the array
  listTodos(todos); // prints the new todo out as html
}

form.addEventListener('submit', e => {
  e.preventDefault();

  // Only add a new todo if input isn't empty
  if(input.value !== '') {
    createTodo(input.value); // creates new todo
    console.log("not empty, adding todo.")
    input.classList.remove("is-invalid") // removes is-invalid bootstrap class
  } else {
    console.log("EMPTY INPUT VALUE")
    input.classList.add("is-invalid") // adds is-invalid bootstrap class
  }
  
  input.value = ''; // clears input field
})

output.addEventListener('click', e => {

  // if you click on a button that has the btn-danger class do this:
  if(e.target.classList.contains('btn-danger')) {
    deleteTodo(e.target.parentNode.id) // deletes the clicked todo
  }
})

// deletes todo function
const deleteTodo = id => {
  todos = todos.filter(todo => todo.id != id); // removes the clicked todo from todos array
  listTodos(todos); // prints out updates list of todos
}