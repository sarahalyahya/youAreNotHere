//Pin Object Array
let pins = [];
//pin csv table
let allPinsTable;
let imageRatio = 0.729;
let pinHeight = 35;
let pinWidth = pinHeight * imageRatio;

const key =
  "pk.eyJ1Ijoic2FyYWhhbHlhaHlhIiwiYSI6ImNsY3JjZGo3eDBlbmozeG1zbWV5enF3NHEifQ.riUptbqKaET6RE6XJ8usvg";

// Options for map
const options = {
  lat: 0,
  lng: 0,
  zoom: 1.6,
  style: "mapbox://styles/sarahalyahya/clddbjxfo000901lasb1bl3ur",
  pitch: 0,
};

// Create an instance of MapboxGL
const mappa = new Mappa("MapboxGL", key);
let myMap;

let canvas;
let phrases;

//preload
function preload() {
  allPinsTable = loadTable(
    "Pins.csv",
    "csv",
    "header",
    // Callback:
    function (table) {
      loaded = true;
      console.log(loaded);
    }
  );
  redPin = loadImage("redNavFull.png");
  blackPin = loadImage("blackNavFull.png");
}

function setup() {
  pins = allPinsTable.getArray();

  canvas = createCanvas(1710, 1276);

  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  //pins table

  fill(252, 190, 17);
  stroke(100);
}

// Grabbing HTML elements
const addPinModal = document.querySelector(".addPinModal");
const instructionsModal = document.querySelector(".instructionsModal");
const showInstructionsBtn = document.getElementById("add-a-Pin");
const closePinModalBtn = document.querySelector(".closePinModal");
const closeInstructionsModalBtn = document.querySelector(
  ".closeInstructionsModal"
);
const cancelLocationAdd = document.querySelector(".form__cancel");
const createLocation = document.querySelector(".form__add");
const locationName = document.getElementById("loc-name");
const locationDescription = document.getElementById("loc-description");

//JS functions
//probably need to merge the following 2 functions
function addLocationOnMap() {
  const position = myMap.pixelToLatLng(mouseX, mouseY);
  document.getElementById(
    "placeholder"
  ).innerHTML = `${position.lat}, ${position.lng}`;
  togglePinModal();
}

function createPin() {
  const position = document.getElementById("placeholder").innerHTML.split(",");
  const locationDescriptionEdited = locationDescription.value.trim();
  const locationNameEdited = locationName.value.trim();

  if (locationDescriptionEdited.length == 0 && locationNameEdited.length == 0) {
    alert("You must enter either a location name or description");
  } else {
    let currentPin = new Pin(
      0,
      0,
      position[0],
      position[1],
      locationNameEdited,
      locationDescriptionEdited,
      pins.length + 1
    );

    pins.push(currentPin);
  }
}

// function displayPin() {
//   let index = pins.length - 1;
//   console.log(pins[index]);
// }

//empties previous form values
const resetForm = () => {
  locationName.value = "";
  locationDescription.value = "";
};

//Modal Functionalities

//display and close pin modal
const togglePinModal = (action) => {
  if (action === "closeModal") {
    addPinModal.classList.add("hidden");
  } else {
    addPinModal.classList.remove("hidden");
  }
};

//calls all needed functions to close modal
const closePinModalHandler = (e) => {
  //default brings back map to Tantura home
  e.preventDefault();
  resetForm();
  togglePinModal("closeModal");
};

//Event Listeners
closePinModalBtn.addEventListener("click", (e) => {
  closePinModalHandler(e);
});

showInstructionsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  instructionsModal.classList.remove("hidden");
});

closeInstructionsModalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  instructionsModal.classList.add("hidden");
});

cancelLocationAdd.addEventListener("click", (e) => {
  closePinModalHandler(e);
});

createLocation.addEventListener("click", (e) => {
  currentPinsArrayLength = pins.length;
  e.preventDefault();
  createPin();
  pin = pins[pins.length - 1];
  function forPostReq(pin) {
    let thisPin = pin;
    console.log("i am here");
    $.post("/ajax_response", thisPin, function (data, status) {
      alert("Data: " + data + "\nStatus:" + status);
    });
  }
  forPostReq(pin);

  if (pins.length > currentPinsArrayLength) {
    closePinModalHandler(e);
  }
});

//Pin Class
class Pin {
  constructor(_x, _y, lat, lng, name, desc, id) {
    this.x = _x;
    this.y = _y;
    this.latitude = lat;
    this.longitude = lng;
    this.locName = name;
    this.locDesc = desc;
    this.id = id;
  }
}

function draw() {
  let cols = ceil(canvas.width / pinWidth);
  let rows = ceil(canvas.height / pinHeight);
  //console.log(pins);
  //let pins2D = [];
  let pinCounter = 0;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      pins[pinCounter][1] = i * (pinHeight + 15) + 20;
      pins[pinCounter][0] = j * (pinWidth + 10) + 10;
      if (pinCounter < pins.length - 1) {
        pinCounter += 1;
      }
    }
  }
  let index = 0;
  pins.forEach(function (pin) {
    //button = createButton(pin[6]);
    //button.addClass("btn--basic");
    // button.addClass("btn--pin");
    //button.position(pin[0],pin[1]);
    image(redPin, pin[0], pin[1], pinWidth, pinHeight);
  });

  //image(redPin, mouseX, mouseY, pinWidth, pinHeight);
}

// clicked() {
//   if (dist(mouseX, mouseY, this.x, this.y) < this.size) {
//     background(255, 0, 0);
//   }
// }
