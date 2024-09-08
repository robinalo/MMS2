// ****** Select Items **********
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// Edit Options
let editElement = null;
let editFlag = false;
let editID = "";

// ****** Event Listeners **********
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

// ****** Functions **********

// Add Item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value.trim();
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id, value);
    displayAlert("Artikel hinzugefügt", "success");
    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Artikel geändert", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Bitte trage einen Artikel ein", "danger");
  }
}

// Display Alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// Clear Items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(item => list.removeChild(item));
  }
  container.classList.remove("show-container");
  displayAlert("Liste geleert", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// Delete Item
function deleteItem(e) {
  const element = e.currentTarget.closest(".grocery-item");
  const id = element.dataset.id;
  list.removeChild(element);
  if (!list.children.length) container.classList.remove("show-container");
  displayAlert("Artikel entfernt", "danger");
  removeFromLocalStorage(id);
}

// Edit Item
function editItem(e) {
  const element = e.currentTarget.closest(".grocery-item");
  editElement = element.querySelector(".title");
  grocery.value = editElement.textContent;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Bearbeiten";
}

// Set Back to Default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Hinzufügen";
}

// ****** Local Storage **********

function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(item => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(item => (item.id === id ? { ...item, value } : item));
  localStorage.setItem("list", JSON.stringify(items));
}

// Setup Items
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(item => createListItem(item.id, item.value));
    container.classList.add("show-container");
  }
}

// Create List Item
function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  element.setAttribute("data-id", id);
  element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  list.appendChild(element);

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
}
