'use strict';


/* Elementos que usamos en el HTML */
const newFormElement = document.querySelector('.js-new-form');
const listElement = document.querySelector('.js-list');
const searchButton = document.querySelector('.js-button-search');
const buttonAdd = document.querySelector('.js-btn-add');
const buttonCancelForm = document.querySelector('.js-btn-cancel');
const inputDesc = document.querySelector('.js-input-desc');
const inputPhoto = document.querySelector('.js-input-photo');
const inputName = document.querySelector('.js-input-name');
const linkNewFormElememt = document.querySelector('.js-button-new-form');
const labelMessageError = document.querySelector('.js-label-error');
const input_search_desc = document.querySelector('.js_in_search_desc');
const input_race = document.querySelector('.js-race');
let kittenListStored = JSON.parse(localStorage.getItem('kittensList'));


//Objetos con cada gatito
const kittenData_1 = {
    image: "https://dev.adalab.es/gato-siames.webp",
    name: "Anastacio",
    desc: "Porte elegante, su patrón de color tan característico y sus ojos de un azul intenso, pero su historia se remonta a Asía al menos hace 500 años, donde tuvo su origen muy posiblemente.",
    race: "Siamés",
};
const kittenData_2 = {
    image: "https://dev.adalab.es/sphynx-gato.webp",
    name: "Fiona",
    desc: "Produce fascinación y curiosidad. Exótico, raro, bello, extraño… hasta con pinta de alienígena han llegado a definir a esta raza gatuna que se caracteriza por la «ausencia» de pelo.",
    race: "Sphynx",
};
const kittenData_3 = {
    image: "https://dev.adalab.es/maine-coon-cat.webp",
    name: "Cielo",
    desc: " Tienen la cabeza cuadrada y los ojos simétricos, por lo que su bella mirada se ha convertido en una de sus señas de identidad. Sus ojos son grandes y las orejas resultan largas y en punta.",
    race: "Maine Coon",
};

let kittenDataList = [];

//Funciones
function renderKitten(kittenData) {
    const kitten = `<li class="card">
    <article>
      <img
        class="card_img"
        src=${kittenData.image}
        alt="gatito"
      />
      <h3 class="card_title">${kittenData.name}</h3>
      <h3 class="card_race">${kittenData.race}</h3>
      <p class="card_description">
      ${kittenData.desc}
      </p>
    </article>
    </li>`;
    return kitten;
}

function renderKittenList(kittenDataList) {
    listElement.innerHTML = "";
    for (const kittenItem of kittenDataList) {
        listElement.innerHTML += renderKitten(kittenItem);
    }
}

//Mostrar/ocultar el formulario
function showNewCatForm() {
    newFormElement.classList.remove('collapsed');
}
function hideNewCatForm() {
    newFormElement.classList.add('collapsed');
}

function handleClickNewCatForm(event) {
    event.preventDefault();
    if (newFormElement.classList.contains('collapsed')) {
        showNewCatForm();
    } else {
        hideNewCatForm();
    }
}

// funcion para vaciar input 

function clearInputs () {
    inputDesc.value = "";
    inputPhoto.value = "";
    inputName.value = "";
}

// Variables de github

const GITHUB_USER =  'francescabentin';
const SERVER_URL = `https://dev.adalab.es/api/kittens/${GITHUB_USER}`;


//Adicionar nuevo gatito
function addNewKitten(event) {
    event.preventDefault();
    const newDescription = inputDesc.value;
    const newImage = inputPhoto.value;
    const newName = inputName.value;
    const newRace = input_race.value;
    const newKittenDataObject = {
            name: newName,
            image: newImage,
            desc : newDescription,
            race: newRace,
            };
    if (newDescription === "" || newImage === "" || newName === "") {
        labelMessageError.innerHTML = "¡Uy! parece que has olvidado algo";
    } else {
        if (newDescription !== "" && newImage !== "" && newName !== "") {
            labelMessageError.innerHTML = "";
            // crear un nuevo gatito y enviarlo al servidor
            fetch(`https://dev.adalab.es/api/kittens/${GITHUB_USER}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newKittenDataObject),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (data.success) {
                //Completa y/o modifica el código:
                //Agrega el nuevo gatito al listado
                kittenDataList.push(newKittenDataObject);
                //Guarda el listado actualizado en el local stoarge
                kittenListStored = localStorage.setItem('kittenDataList', JSON.stringify(kittenDataList))
                //Visualiza nuevamente el listado de gatitos
                renderKittenList(kittenDataList);
                //Limpia los valores de cada input
                clearInputs();
                labelMessageError.innerHTML = 'Mola! Un nuevo gatito en Adalab!';
                } else {
                labelMessageError.innerHTML = "¡Uy! No se ha podido añadir el gatito";
                
                }
            }); 
        }
    }
}

//Cancelar la búsqueda de un gatito
function cancelNewKitten(event) {
    event.preventDefault();
    newFormElement.classList.add("collapsed");
    clearInputs();

   
}

//Filtrar por descripción
function filterKitten (event) {
    event.preventDefault();
    const descrSearchText = input_search_desc.value;
    const raceSearchText = input_race.value;
    listElement.innerHTML = "";
    const kittenFiltered = kittenDataList
    .filter((kittenItem) => kittenItem.desc.includes(descrSearchText))
    .filter((kittenItem) => kittenItem.race.includes(raceSearchText))
    renderKittenList(kittenFiltered)
}

//Mostrar el litado de gatitos en ell HTML
renderKittenList(kittenDataList);

//Eventos
linkNewFormElememt.addEventListener("click", handleClickNewCatForm);
searchButton.addEventListener("click", filterKitten);
buttonAdd.addEventListener("click", addNewKitten);
buttonCancelForm.addEventListener("click", cancelNewKitten);


// Fetch y guardar en localStorage
if (kittenListStored) {
    renderKittenList(kittenListStored)
} else {
 fetch(SERVER_URL, {
  method: 'GET',
  headers: {'Content-Type': 'application/json'},
}).then((response) => response.json())
.then ((data) => {
    console.log(data.results);
    kittenDataList = data.results.map((kitten) => ({
    name:kitten.name,
    desc: kitten.desc,
    image: kitten.image,
    race: kitten.race,
}))
    kittenListStored = localStorage.setItem('kittenDataList', JSON.stringify(kittenDataList))
    renderKittenList(kittenDataList);
});
}

  

