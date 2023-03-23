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
  displayedLocationCoordinates.innerHTML = `${pin.latitude},${pin.longitude}`;
  displayedLocationName.innerHTML = pin.locName;
  displayedLocationDescription.innerHTML = pin.locDesc;
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

// function draw() {
//   canvas.doubleClicked(addLocationOnMap);
//   let cols = ceil(canvas.width / pinWidth);
//   let rows = ceil(canvas.height / pinHeight);
//   console.log('pinsbeginning',pins);
//   //i think the fact that an x,y are properly assigned here is what is causing a delay in pin display
//   let pinCounter = 0;
//   for (let i = 0; i < cols; i++) {
//     for (let j = 0; j < rows; j++) {
//       console.log('pinCounter1',pinCounter);
//       pins[pinCounter][1] = i * (pinHeight + 15) + 20;
//       pins[pinCounter][0] = j * (pinWidth + 10) + 10;
//       console.log('x',pins[pinCounter][0],'y',pins[pinCounter][1]);
//       console.log('pinCounter2',pinCounter);
//       if (pinCounter = 0) {
//         console.log('counter 0',pinCounter);
//         pinCounter += 1;
//       }

//     }
//     console.log('pins end of draw',pins);
//   }

  
//   displayPinsLineup();
    
  
  

// }

function draw() {
  // noLoop();
  canvas.doubleClicked(addLocationOnMap);
  let cols = ceil(canvas.width / pinWidth);
  let rows = ceil(canvas.height / pinHeight);
  //i think the fact that an x,y are properly assigned here is what is causing a delay in pin display
  let pinIndex = 0;
  
  let currCol=0;
  let currRow=0;
  var gridSize = min(canvas.width, canvas.height) / 10;
  // console.log("Grid size: ",gridSize);

    var numRows = floor(canvas.height / 35);
    var numCols = floor(canvas.width / (60 * 0.729));
    console.log('Number of rows: ', numRows,'Number of cols: ',numCols);

    // Calculate the horizontal and vertical spacing between elements
    var xSpacing = (width / numCols)+10;
    var ySpacing = (height / numRows)+10;
    console.log('X spacing: ', xSpacing,'Y spacing: ',ySpacing);
    // Loop through the list of elements and draw them in the grid
    for (var i = 0; i < pins.length; i++) {
      // Calculate the row and column of the current element
      var row = floor(i / numCols);
      var col = i % numCols;
      console.log('Row: ', row,'Col: ',col);
      // Calculate the x and y position of the element based on its row and column
      var x = col * xSpacing + (xSpacing - (35 * 0.729)) / 2;
      var y = row * ySpacing + (ySpacing - 35) / 2;
      console.log('X position: ', x,'Y position: ',y);
      pins[i][1] = y;
      pins[i][0] = x;
    }
  // for (let i = 0; i < cols; i++) {

  //   for (let j = 0; j < rows; j++) {
  //     pins[pinIndex][1] = i * (pinHeight + 15) + 20;
  //     pins[pinIndex][0] = j * (pinWidth + 10) + 10;
  //     // console.log('Pin Index: ',pinIndex);
  //     console.log('X: ',pins[pinIndex][1],'Y: ',pins[pinIndex][0],'Pin number: ',pins[pinIndex][6]);
  //     if (pinIndex < pins.length - 1) {
  //       pinIndex += 1;
  //     }
  //     // if(pinIndex==pins.length-1){
  //     //   console.log("INSIDE BREAK 1");
  //     //   break;
  //     // }
  //   }
  // }
  displayPinsLineup();
  
}



function displayPinsLineup(){
  pins.forEach(function (pin) {
    //console.log('pins in display',pins);
    image(redPin, pin[0], pin[1], pinWidth, pinHeight);
    // console.log('displaying pin', pin[0],'     ',pin[1]);
    fill(0);
    stroke(255, 0, 0);
    noFill();
    //rect(pin[0], pin[1], pinWidth, pinHeight);
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
      console.log("clicked ");
      console.log('first pin',pin.id);
      showLocationModal(pin);
    } 
  });
}

// clicked() {
//   if (dist(mouseX, mouseY, this.x, this.y) < this.size) {
//     background(255, 0, 0);
//   }
// }
