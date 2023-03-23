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
const displayLocationModal = document.querySelector(".locationModal");

const instructionsModal = document.querySelector(".instructionsModal");
const showInstructionsBtn = document.getElementById("add-a-Pin");

const closePinModalBtn = document.querySelector(".closePinModal");
const closeLocationModalBtn = document.querySelector(".closeLocationModal");
const closeInstructionsModalBtn = document.querySelector(
  ".closeInstructionsModal"
);
const cancelLocationAdd = document.querySelector(".form__cancel");
const createLocation = document.querySelector(".form__add");
const locationName = document.getElementById("loc-name");
const locationDescription = document.getElementById("loc-description");

const displayedLocationCoordinates = document.getElementById(
  "coord-placeholder-filled"
);
const displayedLocationName = document.getElementById("loc-name-filled");
const displayedLocationDescription = document.getElementById(
  "loc-description-filled"
);

//JS functions
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
    displayPinsLineup();
  }
}

//empties previous form values
const resetForm = () => {
  locationName.value = "";
  locationDescription.value = "";
};

function showLocationModal(pin) {
  console.log(pin);
  displayLocationModal.classList.remove("hidden");
  displayedLocationCoordinates.innerHTML = `${pin[2]},${pin[3]}`;
  displayedLocationName.innerHTML = pin[4];
  displayedLocationDescription.innerHTML = pin[5];
}

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

closeLocationModalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  displayLocationModal.classList.add("hidden");
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
  canvas.doubleClicked(addLocationOnMap);
  let cols = ceil(canvas.width / pinWidth);
  let rows = ceil(canvas.height / pinHeight);
  //i think the fact that an x,y are properly assigned here is what is causing a delay in pin display
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

  if(frameCount % 120==0){
    displayPinsLineup();
    
  }
  

}


function displayPinsLineup(){
  pins.forEach(function (pin) {
    image(redPin, pin[0], pin[1], pinWidth, pinHeight);
    fill(0);
    //text(pin[6].toString(),pin[0]+5,pin[1]+20);
    stroke(255, 0, 0);
    noFill();
    rect(pin[0], pin[1], pinWidth, pinHeight);
  });

}

function mousePressed() {
  pins.forEach(function (pin) {
    if (
      mouseX > pin[0] &&
      mouseX < pin[0] + pinWidth &&
      mouseY > pin[1] &&
      mouseY < pin[1] + pinHeight
    ) {
      console.log("clicked " + pin[6]);
      showLocationModal(pin);
    } 
  });
}

// clicked() {
//   if (dist(mouseX, mouseY, this.x, this.y) < this.size) {
//     background(255, 0, 0);
//   }
// }
