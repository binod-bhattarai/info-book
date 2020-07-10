// Creating UI vars
const addBtn = document.querySelector("#add-person"),
  form = document.querySelector("#form"),
  filter = document.querySelector("#filter"),
  fullName = document.querySelector("#full-name"),
  email = document.querySelector("#email"),
  phone = document.querySelector("#phone"),
  notes = document.querySelector('#notes'),
  infoSection = document.querySelector("#info-section"),
  requiredFullName = document.querySelector('.full-name-required'),
  requiredEmail = document.querySelector('.email-required'),
  requiredPhone = document.querySelector('.phone-required'),
  success = document.querySelector('.success'),
  deleted = document.querySelector('.deleted');

// directly focusing on the search when the page loads
filter.autofocus = 'true';

// Load DOM
document.addEventListener("DOMContentLoaded", function () {
  let persons;
  if (localStorage.getItem("persons") === null) {
    persons = [];
  } else {
    persons = JSON.parse(localStorage.getItem("persons"));
  }
  persons.forEach(function (person) {
    // create single info div element
    const singleInfo = document.createElement("div");
    singleInfo.className = "single-info";

    // create person info div element
    const personInfo = document.createElement("div");
    personInfo.className = "person-info";

    // Create p to add info
    const paraFullName = document.createElement("p");
    paraFullName.appendChild(document.createTextNode(person.fullName));

    const paraEmail = document.createElement("p");
    paraEmail.appendChild(document.createTextNode(person.email));

    const paraPhone = document.createElement("p");
    paraPhone.appendChild(document.createTextNode(person.phone));

    const paraNotes = document.createElement("p");
    paraNotes.appendChild(document.createTextNode(person.notes));
    if (person.notes !== '') {
      paraNotes.className = 'note-style';
    } else {
      paraPhone.style.paddingBottom = '0';
    }

    personInfo.appendChild(paraFullName);
    personInfo.appendChild(paraEmail);
    personInfo.appendChild(paraPhone);
    personInfo.appendChild(paraNotes);

    singleInfo.appendChild(personInfo);
    singleInfo.innerHTML += `<i id="dlt-icon" class="far fa-trash-alt"></i>`;

    // Append single info to info section
    infoSection.appendChild(singleInfo);
  });
});

// Show Form
addBtn.addEventListener("click", showForm);
function showForm() {
  form.className = 'show-form'
  form.style.display = "block";
  fullName.autofocus = 'true';
}

// Add Info to the UI
form.addEventListener("submit", addInfo);
function addInfo(e) {
  // Prevent the default behavior of submit
  e.preventDefault();
  if (fullName.value.trim() === "" || email.value.trim() === "" || phone.value.trim() === "" || phone.value.length !== 10) {
    if (fullName.value.trim() === '') {
      // Add class
      requiredFullName.className = 'full-name-required';
      // show error
      requiredFullName.style.display = 'block';
    }
    if (email.value.trim() === '') {
      // Add class
      requiredEmail.className = 'email-required';
      // show error
      requiredEmail.style.display = 'block';
    }
    if (phone.value.trim() === '' || phone.value.length !== 10) {
      // Add class
      requiredPhone.className = 'phone-required';
      // show error
      requiredPhone.style.display = 'block';
    }

  } else {
    // create single info div element
    const singleInfo = document.createElement("div");
    singleInfo.className = "single-info person-show";

    // create person info div element
    const personInfo = document.createElement("div");
    personInfo.className = "person-info";

    // Create p to add info
    const paraFullName = document.createElement("p");
    paraFullName.appendChild(document.createTextNode(fullName.value));

    const paraEmail = document.createElement("p");
    paraEmail.appendChild(document.createTextNode(email.value));

    const paraPhone = document.createElement("p");
    paraPhone.appendChild(document.createTextNode(phone.value));

    const paraNotes = document.createElement("p");
    paraNotes.appendChild(document.createTextNode(notes.value));
    if (notes.value !== '') {
      paraNotes.className = 'note-style';
    } else {
      paraPhone.style.paddingBottom = '0';
    }

    personInfo.appendChild(paraFullName);
    personInfo.appendChild(paraEmail);
    personInfo.appendChild(paraPhone);
    personInfo.appendChild(paraNotes);

    singleInfo.appendChild(personInfo);
    singleInfo.innerHTML += `<i id="dlt-icon" class="far fa-trash-alt"></i>`;

    // Append single info to info section
    infoSection.appendChild(singleInfo);

    // Adding to object
    const personObj = {
      fullName: fullName.value,
      email: email.value,
      phone: phone.value,
      notes: notes.value
    };

    // Again hide the form after submitting
    form.className = 'hide-form';
    setTimeout(function () {
      form.style.display = "none";
    }, 300);

    // store in local storage
    storeInLocalStorage(personObj);

    // Clear input values
    fullName.value = "";
    email.value = "";
    phone.value = "";
    notes.value = '';

    // Clear error after submitting
    requiredFullName.style.display = 'none';
    requiredEmail.style.display = 'none';
    requiredPhone.style.display = 'none';

    // person added Success animation
    success.style.display = 'inline-block';
    setTimeout(function () {
      success.style.display = 'none';
    }, 2500);
  }
}

// store info in local storage
function storeInLocalStorage(person) {
  let persons;
  if (localStorage.getItem("persons") === null) {
    persons = [];
  } else {
    persons = JSON.parse(localStorage.getItem("persons"));
  }
  persons.push(person);
  localStorage.setItem("persons", JSON.stringify(persons));
}

// Remove Info from the UI
infoSection.addEventListener("click", removeInfo);
function removeInfo(e) {
  if (e.target.classList.contains("far")) {
    e.target.parentElement.classList.add('person-delete');
    setTimeout(function () {
      e.target.parentElement.remove();
    }, 700);

    deleted.style.display = 'inline-block';
    setTimeout(function () {
      deleted.style.display = 'none';
    }, 2500);

    removeFromLocalStorage(e.target.parentElement);
  }
}

// Remove info from local storage
function removeFromLocalStorage(singlePerson) {
  let persons;
  if (localStorage.getItem("persons") === null) {
    persons = [];
  } else {
    persons = JSON.parse(localStorage.getItem("persons"));
  }
  persons.forEach(function (person, index) {
    const text = singlePerson.firstElementChild.firstElementChild.textContent.toLowerCase();
    if (text === person.fullName.toLowerCase()) {
      persons.splice(index, 1);
    }
  });
  localStorage.setItem("persons", JSON.stringify(persons));
}

// Filter / search
filter.addEventListener("keyup", search);
function search(e) {
  const search = e.target.value.toLowerCase();
  document.querySelectorAll(".person-info").forEach(function (singlePersonInfo) {
    const personFullName = singlePersonInfo.firstElementChild.firstChild.textContent,
      personEmail = singlePersonInfo.firstElementChild.nextElementSibling.firstChild.textContent,
      personPhone = singlePersonInfo.lastElementChild.previousElementSibling.firstChild.textContent;
    if (personFullName.toLowerCase().indexOf(search) !== -1 || personEmail.toLowerCase().indexOf(search) !== -1 || personPhone.indexOf(search) !== -1) {
      singlePersonInfo.parentElement.style.display = "flex";
    } else {
      singlePersonInfo.parentElement.style.display = "none";
    }
  });
}
