

//Pin Object Array
let pins = [];
//Pin CSV Table
let allPinsTable;
//Lat lng based on click
let position;

let numColumns = 35; 
let horzMargin = 10; 
let vertMargin = 10;
let vertOffset = 5; 
let horzOffset = horzMargin/2; 
let xMult;
let pinWidth;
let pinHeight; 
let redPin;
let darkRedPin;
let greyPin; 
let whitePin; 

const key =
  "pk.eyJ1Ijoic2FyYWhhbHlhaHlhIiwiYSI6ImNsY3JjZGo3eDBlbmozeG1zbWV5enF3NHEifQ.riUptbqKaET6RE6XJ8usvg";

// Options for map
const options = {
  lng: 0,
  lat: 0,
  zoom: 1.8,
  style: "mapbox://styles/sarahalyahya/clddbjxfo000901lasb1bl3ur",
  pitch: 0,
};

// Create an instance of MapboxGL
const mappa = new Mappa("MapboxGL", key);
let myMap;

let canvas;


//Preload
function preload() {
  allPinsTable = loadTable(
    "Pins.csv",
    "csv",
    "header",
    // Callback:
    function (table) {
      loaded = true;
    }
  );
  redPin = loadImage("redNavFull.png");
  darkRedPin = loadImage("darkRedNavFull.png");
  whitePin = loadImage("whiteNavFull.png");
  greyPin = loadImage("greyNavFull.png");
}



function setup() {
  //Convert CSV to Array
  pins=allPinsTable.getArray();
  canvas = createCanvas(windowWidth, windowHeight);
  pinWidth = (width-(horzMargin*numColumns))/(numColumns); 
  pinHeight = pinWidth*(redPin.height/redPin.width); 
  xMult = width/(numColumns); 

  let index = pins.length; 
  console.log("before loop:", pins);
  

  for(let i =0; i<index; i++){
    let x = i%numColumns;
    let y = floor(i/numColumns);
    pins[i][0] = (x*xMult)+horzOffset; 
    pins[i][1] = y*(pinHeight+vertMargin)+vertOffset; 
  }
  console.log("after loop:", pins);
  
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  //background(3,13,28);
  

 }

// Grabbing HTML elements
//Add Pin Modal
const addPinModal = document.querySelector(".addPinModal");
const cancelLocationAdd = document.querySelector(".form__cancel");
const createLocation = document.querySelector(".form__add");
const closePinModalBtn = document.querySelector(".closePinModal");
const locationName = document.getElementById("loc-name");
const locationDescription = document.getElementById("loc-description");

//Instructions Modal
const instructionsModal = document.querySelector(".instructionsModal");
const showInstructionsBtn = document.getElementById("add-a-Pin");
const closeInstructionsModalBtn = document.querySelector(".closeInstructionsModal");

//Display Location Modal 
const displayLocationModal = document.querySelector(".locationModal");
const closeLocationModalBtn = document.querySelector(".closeLocationModal");
const displayedLocationCoordinates = document.getElementById("coord-placeholder-filled");
const displayedLocationName = document.getElementById("loc-name-filled");
const displayedLocationDescription = document.getElementById("loc-description-filled");



//JS functions

//Gets latitude and longitude based on mouse click location and injects it into html + opens add pin modal
function addLocationOnMap() {
      displayLocationModal.classList.add("hidden");
      position = myMap.pixelToLatLng(mouseX, mouseY);
      document.getElementById("placeholder").innerHTML = `${position.lng}, ${position.lat}`;
      togglePinModal();
    }

//Creates a pin object and returns it
function createPin() {
  //Gets inputs from html values
  //const positionDisplayed = document.getElementById("placeholder").innerHTML.split(","); *i THINK i don't need this*
  const locationDescriptionEdited = locationDescription.value.trim();
  const locationNameEdited = locationName.value.trim();
  
  //User must fill in at least one of the inputs 
  if (locationDescriptionEdited.length == 0 && locationNameEdited.length == 0) {
    alert("You must enter either a location name or description");
  } else {
    
    let currentPin = new Pin(
     0,
     0,
      position.lng,
      position.lat,
      locationNameEdited,
      locationDescriptionEdited,
      myMap.getZoom(),
      pins.length + 1,
    );
    return currentPin
  
  }
}

//Empties previous input form values
const resetForm = () => {
  locationName.value = "";
  locationDescription.value = "";
};

//Displays a pin for each location added. My pins are in white for guidance & backstory
function displayPinsLineup(){
  pins.forEach(function (pin) {
    if(pin[7] == 1){
      image(redPin, pin[0], pin[1], pinWidth, pinHeight);
    }else{
      image(whitePin, pin[0], pin[1], pinWidth, pinHeight);
    }

    if (
      mouseX > pin[0] &&
      mouseX < pin[0] + pinWidth &&
      mouseY > pin[1] &&
      mouseY < pin[1] + pinHeight
    ) {


      if(pin[7] == 1){
      image(darkRedPin, pin[0], pin[1], pinWidth, pinHeight);
    }else{
      image(greyPin, pin[0], pin[1], pinWidth, pinHeight);
    }


    }

    
  });

}


//Modal Functionalities

//Displays added location modal 
function showLocationModal(pin) {
  addPinModal.classList.add("hidden");
  //takes object values and displays them in the HTML element 
  displayedLocationCoordinates.innerHTML = `${pin[2]},${pin[3]}`;
  displayedLocationName.innerHTML = pin[4];
  displayedLocationDescription.innerHTML = pin[5];
  displayLocationModal.classList.remove("hidden");

}

//Display and close pin modal
const togglePinModal = (action) => {
  if (action === "closeModal") {
    addPinModal.classList.add("hidden");
  } else {
    addPinModal.classList.remove("hidden");
  }
};

//Calls all needed functions to close the pin modal
const closePinModalHandler = (e) => {
  e.preventDefault();
  resetForm();
  togglePinModal("closeModal");
};

//Event Listeners

//Closing add pin modal
closePinModalBtn.addEventListener("click", (e) => {
  closePinModalHandler(e);
});

//Shows instruction modal
showInstructionsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("here");
  displayLocationModal.classList.add("hidden");
  addPinModal.classList.add("hidden");
  console.log("and here");
  instructionsModal.classList.remove("hidden");
  
  
});

//Closes instructions modal
closeInstructionsModalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  instructionsModal.classList.add("hidden");
  
});

//Closes location modal
closeLocationModalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  myMap.map.flyTo({
    center: [
       0,0
        
      ],
    zoom: 1.6,
    duration: 11000
  });
  displayLocationModal.classList.add("hidden");

});

//Cancels adding location
cancelLocationAdd.addEventListener("click", (e) => {
  closePinModalHandler(e);
  myMap.map.flyTo({
    center: [
       0,0
        
      ],
    zoom: 1.6,
    duration: 9000
  });
});

//Creates a location by pushing the object into the csv file, and object array to the pins array 
createLocation.addEventListener("click", (e) => {
  currentPinsArrayLength = pins.length;
  e.preventDefault();
  pin = createPin();
  function forPostReq(pin) {
    let thisPin = pin;
    $.post("/ajax_response", thisPin, function (data, status) {
      alert("Data: " + data + "\nStatus:" + status);
    });
  }
  forPostReq(pin);
  //Because i've converted the CSV table to an array, i must convert the pin object to a pin array before i push it
  const myArray = Object.values(pin);

  let x = currentPinsArrayLength%numColumns;
  let y = floor(currentPinsArrayLength/numColumns); 
  myArray[0] = (x*xMult)+horzOffset;
  myArray[1] = y*(pinHeight+vertMargin)+vertOffset; 

  
  

  pins.push(myArray);

  if (pins.length > currentPinsArrayLength) {
    closePinModalHandler(e);
  }
  myMap.map.flyTo({
    center: [
       0,0
        
      ],
    zoom: 1.6,
    duration: 9000
  });
});

//Pin Class
class Pin {
  constructor(_x, _y, lng, lat, name, desc, _zoom, id) {
    this.x = _x;
    this.y = _y;
    this.longitude = lng;
    this.latitude = lat;
    this.locName = name;
    this.locDesc = desc;
    this.zoom = _zoom;
    this.id = id;
  }
  

  }






function draw() {
  canvas.doubleClicked(addLocationOnMap);

  
  
  displayPinsLineup();
  
}



function mousePressed() {
  //Looping over each pin to check whether a specific location modal needs to display
  pins.forEach(function (pin) {
    if (
      mouseX > pin[0] &&
      mouseX < pin[0] + pinWidth &&
      mouseY > pin[1] &&
      mouseY < pin[1] + pinHeight
    ) {
      
      myMap.map.flyTo({
        center: [
           pin[2],pin[3]
            
          ],
        zoom: pin[6],
        duration: 9000
      });
      
     
      showLocationModal(pin);

    
    } 
  });
}




