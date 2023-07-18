// get all our html elements
// const todoList = document.querySelector(".content ul");
// const todo_wrapper = document.querySelector(".new_content");
// const itemsLeft = document.querySelector(".items-left span");
// const itemsLeft2 = document.querySelector(".items-left2 span");

// getting all html elements from the DOM (document object model)
let [todoList, todo_wrapper, itemsLeft, itemsLeft2] = query_selector(
  ".content ul",
  ".new_content",
  ".items-left span",
  ".items-left2 span"
);

function get_element_id(...data) {
  // initialize an empty array to store data
  let arr = [];
  // for each element in the data array, add the element to 'arr'
  data.forEach((id) => {
    arr.push(document.getElementById(id));
  });
  return arr;
}
let [theme, newItemInput] = get_element_id("theme", "addItem");
// Query selector
function query_selector(...selectors) {
  let arr = [];
  if (selectors.length == 1) return document.querySelector(selectors[0]);
  else {
    selectors.forEach((selector) => {
      arr.push(document.querySelector(selector));
    });
  }
  return arr;
}

// Query all
// pass the classnames of each element into query_all function
function query_all(selector_id) {
  return document.querySelectorAll(`.${selector_id}`);
}
// Event listener
// examples of event listeners - 'click', 'submit', 'change'
// accessor - element which event occurs on
// event - 'click', etc
function eventListener(accessor, event, callback) {
  accessor.addEventListener(event, callback);
}

//theme switcher
eventListener(theme, "click", () => {
  // select the html element called body
  const body = query_selector("body");
  // ternary operator to change theme
  const newTheme = theme.checked ? "theme-light" : "theme-dark";
  body.classList = [newTheme];
  localStorage.setItem("theme", newTheme);
});

// Retrieve theme from local storage
function getThemeFromLocalStorage() {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    const body = query_selector("body");
    body.classList = [storedTheme];
    theme.checked = storedTheme === "theme-light";
  }
  itemsLeft2.innerHTML = JSON.parse(localStorage.getItem("itemsCount"));
}

// Retrieve todos from local storage
function getLocalStorage() {
  let localItems = JSON.parse(localStorage.getItem("localItem"));
  if (localItems !== null && typeof localItems === "string") {
    todoList.innerHTML = localItems;
  }
  addCompleted();
}
// Invoke functions
function addCompleted() {
  let allItems = document
    // an array of input elements
    .querySelectorAll('li input[type="checkbox"]')
    .forEach((item) => {
      // if each item is clicked, run this anonymous arrow function
      item.addEventListener("click", () => {
        // if item is not clicked
        if (!item.checked) {
          updateItemsCount(1, false);
        } else if (item.checked) {
          // if item is clicked
          updateItemsCount(-1, true); // Invoke with completed = true
        }
      });
    });
}

// Save todos to local storage
function updateLocalStorage() {
  localStorage.setItem("localItem", JSON.stringify(todoList.innerHTML));
}

//mouse input
eventListener(query_selector(".add-new-item span"), "click", () => {
  newItemInput.value.length > 0 &&
    // if the item is clicked, pass in the input value and set the input field to ""
    (createNewTodoItem(newItemInput.value), (newItemInput.value = ""));
});

//keyboard input
// check validity
eventListener(newItemInput, "keypress", (e) => {
  // if the enter key is pressed
  e.key === "Enter" &&
    // and the length of what is typed is ? 0
    newItemInput.value.length > 0 &&
    // then pass the value into the createNewTodoItem function
    (createNewTodoItem(newItemInput.value), (newItemInput.value = ""));
});

//create new todo item
function createNewTodoItem(text) {
  // create an 'li' element
  const elem = document.createElement("li");
  // add class to the 'element'
  elem.classList.add("flex-row");

  // set the content of the element typed to 'text'
  elem.innerHTML = `
          <label class="list-item">
          <input type="checkbox" name="todoItem">
          <span class="checkmark"></span>
          <span class="text">${text}</span>
      </label>
      <span class="remove"></span>
      `;
  //new
  elem
    .querySelector('input[type="checkbox"]')
    .addEventListener("click", (e) => {
      if (!e.target.checked) {
        updateItemsCount(1, false);
      } else if (e.target.checked) {
        updateItemsCount(-1, true); // Invoke with completed = true
      }
    });

  // add the element to the array
  todoList.append(elem);
  // clear value in the input field
  newItemInput.value = "";
  updateItemsCount(1);
  updateLocalStorage();
}

// function updateItemsCount
function updateItemsCount(num = 0, completed = false) {
  // count the number of li elements in the ul(todo_wrapper)
  let count = todo_wrapper.getElementsByTagName("li").length;
  let currentCount = itemsLeft2.innerHTML;
  // if there's nothing in the array, set the innerHTML to 0
  if (count === 0) {
    itemsLeft2.innerText = 0;
    itemsLeft.innerText = 0;
    // if completed is true, remove the element from the array (decrement the number)
  } else if (completed) {
    itemsLeft2.innerText--;
    itemsLeft.innerText--;
    // if not completed, add the element to both arrays
  } else if (!completed) {
    itemsLeft2.innerText++;
    itemsLeft.innerText++;
  } else {
    // if num > 0, then count, else decrement count
    // if count is greater than 0, set count to num, else subtract num from count
    itemsLeft2.innerText = num > 0 ? count : count - num;
    itemsLeft.innerText = num > 0 ? count : count - num;
  }

  localStorage.setItem("itemsCount", count); // Save updated count to local storage
}

// remove todo item
function removeTodoItem(elem) {
  elem.remove();
  updateItemsCount(-1);
  updateLocalStorage();
  itemsLeft2.innerHTML = JSON.parse(localStorage.getItem("itemsCount"));
  itemsLeft.innerHTML = JSON.parse(localStorage.getItem("itemsCount"));
}
// if we click on todoList, run this function
eventListener(todoList, "click", (event) => {
  // is the element we clicked on contains("remove")
  event.target.classList.contains("remove") &&
    // remove it from the list
    removeTodoItem(event.target.parentElement);
});

// clear completed items
eventListener(query_selector(".clear"), "click", () => {
  query_all("list-item input[type='checkbox']:checked").forEach((item) => {
    removeTodoItem(item.closest("li"));
  });
  updateLocalStorage();
});

eventListener(query_selector(".clear2"), "click", () => {
  query_all("list-item input[type='checkbox']:checked").forEach((item) => {
    removeTodoItem(item.closest("li"));
  });
  updateLocalStorage();
});

// filter todo list items
document.querySelectorAll(".filter input").forEach((radio) => {
  // forEach radio button, pass the id of the changed todo into the filterTodoItems function
  radio.addEventListener("change", (e) => {
    filterTodoItems(e.target.id);
  });
});

//can be made simpler with an if statement
function filterTodoItems(id) {
  const allItems = todoList.querySelectorAll("li");

  // if the id selected is 'all'
  if (id == "all") {
    // remove the hidden class from each item
    allItems.forEach((item) => item.classList.remove("hidden"));
  }
  // if the id is 'Active'
  if (id == "Active") {
    allItems.forEach((item) =>
      // if the input field is checked,
      item.querySelector("input").checked
        ? //then add the hidden class
          item.classList.add("hidden")
        : // else, remove the hidden class
          item.classList.remove("hidden")
    );
  }
  if (id == "Completed") {
    allItems.forEach((item) =>
      item.querySelector("input").checked
        ? item.classList.remove("hidden")
        : item.classList.add("hidden")
    );
  }
}

// drag and drop
new Sortable(todo_wrapper, {
  animation: 300,
});

getLocalStorage();
getThemeFromLocalStorage();

itemsLeft2.innerHTML = JSON.parse(localStorage.getItem("itemsCount"));
itemsLeft.innerHTML = JSON.parse(localStorage.getItem("itemsCount"));

// adding an item - creating the li for the item
// removing an item
// filter items
