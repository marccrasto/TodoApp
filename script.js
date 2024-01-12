// Global variables. Accessed by all functions.

// A variable that stores the div 'form' in it.
const form = document.getElementById("form");

// A variable that stores the textbox 'input' in it. Used to access whatever is entered into the textbox and add functionality (shown later on) in it.
const input = document.getElementById("input");

// A variable that stores the ul 'todos' in it. Will be used to add the list items dynamically and also obtain the already added li.
const todos = document.getElementById("todos");

// 'let' indicates that the value of the variable is subject to change. Here we obtain the already added list items (tasks) from the local storage (part of the server). Returns an array storing the already added tasks.
let strings = JSON.parse(localStorage.getItem('todoStored'));

// Here we obtain an array of booleans that show which tasks have finished completion and which haven't. Basically works in correspondence with the 'strings' variable
let clearedStrings = JSON.parse(localStorage.getItem('completedStored'));

// A 'count' variable that is initialised to '0'. It is used to keep track of the number of list items displayed on the screen and provides 'a sort of id' for each li (used in the buttons for each li).
let count = 0;


// 'addEventListener' is a type of function that used on an HTML element (in this case, the textbox 'input') to add functionality to it. The function triggers depending on the action taken (determined in the first parameter of the function, in this case, a key press)
// Once a key press takes place, a function is carried out (function definition in the second parameter of 'addEventListener').
input.addEventListener('keydown', (event) => {
    // Checks if the user has entered the 'enter' button on the keyboard.
    if(event.key == "Enter") {
        // '.value' obtains the text that is entered into the textbox 'input' by the user.
        const todoText = input.value;

        // Checks first if there is text in the textbox.
        if (todoText) {
            // Creates a new element in the document. This will be li that will display each task.
            const todoEl = document.createElement('li');
            // '.innerHTML' allows me to customise the li created above. In this case I include a button and an icon for that button. The position of the li and the  button and their styling will be handled by the CSS file linked to the html document.
            // '${todoText}' displays what the user has entered into the textbox in the list. The current value of '${count}' is given as an id to each li's button.
            // 'onClick="removeItem(this.id)"' basically means that when the user clicks on the button, a function will trigger.
            todoEl.innerHTML = `
                ${todoText}
                    <button id="${count}" onClick="removeItem(this.id)">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
            `;

            // Here, a function triggers everytime the user clicks on the li. 
            todoEl.addEventListener('click', () => {
                // When the user clicks on the li, it will toggle its class to 'completed'. 
                todoEl.classList.toggle('completed');
                // Stores the changes in local storage. Function explained below.
                updateLS();

            });

            // After the li and its child elements have been dealt with, we append it to the ul 'todos'. This makes the li element a child of the ul element.
            todos.appendChild(todoEl);

            // Increment the value of 'count' each time an li is added.
            count++;

            updateLS();

            // Clear the textbox after user has entered a todo.
            input.value = '';
        }
    }
});

// A function to display and update the list box below the textbox after a todo has been deleted or when we obtain the already added tasks from the local storage and display them. Takes in a parameter 'text' that is the task in string format.
const restoreDropDown = (text) => {
    
    const todoText = text;

    // Basically recreate the li and store it in the ul
    if (todoText) {
        const todoEl = document.createElement('li');
        todoEl.innerHTML = `
            ${todoText}
                <button id="${count}" onClick="removeItem(this.id)">
                    <i class="fa-solid fa-xmark"></i>
                </button>
        `;

        // Checks whether the task has been completed or not. If completed, will show on HTML (styling dealt with in CSS)
        if (clearedStrings[count] == 1) {
            todoEl.classList.add('completed');
        }
        else {
            //do nothing
        }

        todos.appendChild(todoEl);

        todoEl.addEventListener('click', () => {
            todoEl.classList.toggle('completed');
            updateLS();
        });

        count++;
    }
};

// Basically checks to see if there were already added tasks in the local storage (probably from previous sessions using the application). If so, call the 'restoreDropDown' function for each task to display them.
if (strings) {
    strings.forEach(text => {
        restoreDropDown(text);
    });
}

// A function to update the local storage every time a user enters a new task.
const updateLS = () => {
    // Gets all the tasks (in HTML format) from all the li in the ul and store it in an array.
    let lis = todos.getElementsByTagName('li');

    // Resets the 'strings' (holds the task strings) and 'clearedStrings' (holds booleans to indicate task completion) to empty arrays before updating them.
    strings = [];
    clearedStrings = [];

    // A for loop to update the recently emptied arrays.
    for (let i = 0; i < lis.length; i++) {
        // Push the li element's inner text (in string format) into the array
        strings.push(lis[i].innerText);

        // For each li, check if it contains the class 'completed'. If so, push 1 into the 'clearedStrings' array to show task has been cleared. Otherwise, push 0.
        if (lis[i].classList.contains('completed')) {
            clearedStrings.push(1);
        }
        else {
            clearedStrings.push(0);
        }
    }

    // 'setItem' creates and updates the storage object. In this case, we create a 'todoStored' storage object and store (in JSON format) the 'strings' array. Same goes for 'clearedStrings' array.
    localStorage.setItem('todoStored', JSON.stringify(strings));
    localStorage.setItem('completedStored', JSON.stringify(clearedStrings));
};

// Called when the user clicks on the delete button associated with the li. Takes in a parameter id which is the id of the button
const removeItem = (id) => {
    // Gets the id (from the button when we associated its id with the then current value of 'count'). Then using the id, the li from the 'strings' array is removed. Same goes for its associated 'completed' boolean in the 'clearedStrings' array.
    strings.splice(id, 1);
    clearedStrings.splice(id, 1);

    // Resets the ul html before updating it
    todos.innerHTML = ``;

    // Resets the 'count' to 0 before updating it
    count = 0;

    // Looks at the update strings array and restores the list box by calling 'restoreDropDown'
    strings.forEach(text => {
        restoreDropDown(text);
    });

    // Updates the local storage with the updated 'strings' and 'clearedStrings' arrays.
    localStorage.setItem('todoStored', JSON.stringify(strings));
    localStorage.setItem('completedStored', JSON.stringify(clearedStrings));
};