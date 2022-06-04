// selctors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const trashButton = document.querySelector('.trash-btn')
const filterOption = document.querySelector('.filter-todo')

// event listeners
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo)
document.addEventListener('DOMContentLoaded', loadTodos)

// functions
function addTodo(event, todoValue = undefined, todoCompleted = false){
    // todo div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    // create li
    // if todo not created from button submission and todoValue not undefined: take todoValue for todo creation
    if(event != '[object PointerEvent]' && todoValue !== undefined){ // if event is not todo creation (via todoButton submisson)
        console.log('probably page load Event: ' + event);
        console.log('todo addTodo, after page load: ' + todoValue)

        // -> equivalent to todo creation from one local storage item
        const newTodo = document.createElement('li');
        newTodo.innerText = todoValue;
        newTodo.classList.add('todo-text');
        todoDiv.appendChild(newTodo);

        if(todoCompleted){
            newTodo.classList.toggle("completed-text");
            const todoElement = newTodo.parentElement;
            todoElement.classList.toggle('completed');
        }
    }else{ // if event is todo creation (via todoButton submission)
        console.log('probably todoButton Event: ' + event);
        // prevent form from submitting
        event.preventDefault();

        // if todo created from button submission: use original approach
        const newTodo = document.createElement('li');
        newTodo.innerText = todoInput.value;
        newTodo.classList.add('todo-text');
        todoDiv.appendChild(newTodo);
    
        // add todo to local storage
        saveLocalTodos(todoInput.value)        
    }

    // check mark button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);

    // check trash button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    // append to list
    todoList.appendChild(todoDiv);

    // clear todo input value
    todoInput.value = "";
}


function deleteCheck(event){
    console.log(event.target);

    const item = event.target;
    // delete todo
    if (item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        //animation
        todo.classList.add("fall");
        // delete todo from DOM
        todo.addEventListener("transitionend", () => todo.remove())

        // get todo value from delete button
        let deleteValue = item.previousSibling.previousSibling.innerText
        console.log('this value should be deleted: ' + deleteValue)

        // update new todolist to localstorage (by deleting object where taskName == deleteValue)
        saveLocalTodos(deleteValue, doDelete = true)
    }
    
    // mark item as completed (give 'completed' class on checkmark click)
    if (item.classList.contains('complete-btn')) {
        const todoElement = item.previousSibling;
        const todoText = todoElement.innerText;
        console.log(todoElement)
        const todo = item.parentElement;
        todoElement.classList.toggle("completed-text");
        todo.classList.toggle('completed');

        // check if 'completed' class along with 'todo' class
        // if 'completed' class NOT along with 'todo' class: completed false
        // if 'completed' class along with 'todo' class: completed true
        const taskComplete = todo.classList.contains('completed');
        console.log('task complete?: ' + taskComplete)

        saveLocalTodos(todoText, doDelete = false, completed = taskComplete)
    }
}


function filterTodo(e){
    const todos = todoList.childNodes;
    todos.forEach(function(todo){
        switch(e.target.value){
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if(todo.classList.contains('completed')){
                    todo.style.display = "flex";
                }else{
                    todo.style.display = "none";
                }
                break;
            case 'uncompleted':
                if(!todo.classList.contains('completed')){
                    todo.style.display = 'flex';
                }else{
                    todo.style.display = 'none';
                break;
                }
        }
    })
    
}


function saveLocalTodos(todoParameter, doDelete = false, completed = false){
    // when todo created (click on form button) - save it in local storage (JSON)

    console.log('saveLocalTodos "todoParameter" parameter: ' + todoParameter)
    console.log('saveLocalTodos "doDelete" parameter: ' + doDelete)
    console.log('saveLocalTodos "completed" parameter: ' + completed)

    // else (if nothing in local storage) - create a local storage
    let todos;
    let updateTodo;
    if(localStorage.getItem('todos') === null){ // if local storage has no todos key
        todos = [];
    }else{ // if local storage has todo key
        todos = JSON.parse(localStorage.getItem('todos'));

        if(doDelete === true){
            // delete this one item from local storage:
            // find 
            console.log('"todos" is array?: ' + Array.isArray(todos))
            // console.log('first "todo"-array entry\'s taskName: ' + todos[1].taskName)
            for(let i = 0; i < todos.length; i++){
                console.log('todo taskName: ' + todos[i].taskName)
                if (todos[i].taskName === todoParameter) {
                    console.log('todo taskName typeof: ' + typeof todos[i].taskName)
                    console.log('todo typeof: ' + typeof todoParameter)
                    console.log('This should be deleted: ' + todos[i].taskName)
                    todos.splice(i, 1);
                }
            }
        };

        if(completed !== undefined){ // if completed is true
            // todos = JSON.parse(localStorage.getItem('todos'));
            console.log('This is todos: ' + todos)
            let localStorageTodo = todos.find(todo => todo.taskName === todoParameter)
            if(localStorageTodo){
                console.log('localStorageTodo\'s taskName: ' + localStorageTodo.taskName)
                console.log('localStorageTodo completed?: ' + localStorageTodo.completed)
                localStorageTodo.completed = completed
                console.log('localStorageTodo completed updated: ' + localStorageTodo.completed)
    
                updateTodo = localStorageTodo
                console.log('Complete part updateTodo.taskName: ' + updateTodo.taskName)
                console.log('Complete part updateTodo.completed: ' + updateTodo.completed)
    
                // change completed key in localStorage to true if currently false
                // change completed key in localStorage to false if currently true
            }

        }
    }

    if(completed !== 'completed'){ // if completed is undefined or false
        // create a key-value variable for a new todo
        updateTodo = {
            taskName: todoParameter,
            completed: false
        };
    }

    console.log('This is the updateTodo.taskName: ' + updateTodo.taskName)

    // actually update localStorage (delete or add todo)
    // if shouldn't be deleted and object not in localStorage already
    if(doDelete === false && !(todos.some(todo => todo.taskName === updateTodo.taskName))){
        todos.push(updateTodo);
    }
    // else{ // if doDelete not false
    //     // get respective item from localStorage and delete it

    // }
    localStorage.setItem('todos', JSON.stringify(todos));
}


function loadTodos(){
    // get todos back from local storage on page (re)load (if there is a localstorage)

    console.log('page loaded👌')

    let localTodos = localStorage.getItem('todos')
    if(localTodos !== null){
        // get all items from local storage and create todos from them
        
        // console.log(typeof localTodos)
        let loadedTodos = JSON.parse(localTodos)
        console.log(loadedTodos)
        console.log('loadedTodos is array?: ' + Array.isArray(loadedTodos))

        // get names of items from local storage one by one
        loadedTodos.forEach(function(loadedTodo){
            console.log('typeof loadedTodo: ' + typeof loadedTodo)
            console.log('loadedTodo taskName: ' + loadedTodo.taskName)
            console.log('loadedTodo completed? : ' + loadedTodo.completed)

            addTodo(ev = 'loadTodos', loadedTodo.taskName, loadedTodo.completed)
        });
    }else{
        // if no todos in local storage - do nothing
    }
}

// function: delete completed todo from local storage of todos (when click on .trash-btn) 



// #### todo
// remember if completed
    // save correctly✔
    // when trash-btn click: delete task✔
    // when complete-btn click: change completed value in localStorage to true✔
    // get tasks from localStorage and display tasks correctly when page load
        // display done tasks with completed strikethrough when page refresh



// ###### further feature ideas
// add check mark or party emoji at the end of text of completed tasks
// save and load todos from local storage with correct (un)complete class
// (save local storage when closing browser)
// add alert which notifies that input is empty, if form button clicked without input