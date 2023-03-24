//Pin Object Array
let pins = [];
//Pin CSV Table
let allPinsTable;
//Lat lng based on click
let position;
//Image Ratio to maintain correctly scaled image
let imageRatio = 0.729;
let pinHeight = 35;
let pinWidth = pinHeight * imageRatio;

const key =
  "pk.eyJ1Ijoic2FyYWhhbHlhaHlhIiwiYSI6ImNsY3JjZGo3eDBlbmozeG1zbWV5enF3NHEifQ.riUptbqKaET6RE6XJ8usvg";

// Options for map
const options = {
  lng: 0,
  lat: 0,
  zoom: 1.6,
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
      console.log(loaded);
    }
  );
  redPin = loadImage("redNavFull.png");
  whitePin = loadImage("whiteNavFull.png");
}



function setup() {
  //Convert CSV to Array
  pins=allPinsTable.getArray();
  console.log("after loading;",pins);
  canvas = createCanvas(windowWidth, windowHeight);

  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

 }

// Grabbing HTML elements
//Add Pin Modal
const addPinModal = document.querySelector(".addPinModal");
const displayLocationModal = document.querySelector(".locationModal");
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
const closeLocationModalBtn = document.querySelector(".closeLocationModal");
const displayedLocationCoordinates = document.getElementById("coord-placeholder-filled");
const displayedLocationName = document.getElementById("loc-name-filled");
const displayedLocationDescription = document.getElementById("loc-description-filled");



//JS functions

//Gets latitude and longitude based on mouse click location and injects it into html + opens add pin modal
function addLocationOnMap() {
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
    //Create pin object
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
    
  });

}




//Modal Functionalities

//Displays added location modal 
function showLocationModal(pin) {
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
    zoom: 1.6
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
    zoom: 1.6
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
  console.log("pin Array:",myArray);
  pins.push(myArray);

  if (pins.length > currentPinsArrayLength) {
    closePinModalHandler(e);
  }
  myMap.map.flyTo({
    center: [
       0,0
        
      ],
    zoom: 1.6
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

  
  //OVERFLOW NEEDS TO BE FIGURED OUT
  
    //Calculating number of row and cols based on canvas and pin size 
    var numRows = floor(canvas.height / pinHeight);
    var numCols = floor(canvas.width / pinWidth)-25;

    // Calculate the horizontal and vertical spacing between elements
    var xSpacing = (canvas.width / numCols)+5;
    var ySpacing = (canvas.height / numRows)+5;
   
    // Loop through pins array and give them the x,y values needed later for displaying the pins 
    for (var i = 0; i < pins.length; i++) {

      // Calculate the row and column of the current element
      //based on columns because "number of columns" is what makes up a row
      var row = floor(i / numCols);

      //Since i/numCols is the row, the remainder gives us the specific cell of the row the object is in (so the column)
      var col = i % numCols;

      // Calculate the x and y position of the pin and center it with taking spacing into account 
      var x = col * xSpacing + (xSpacing - (pinWidth)) / 2;
      var y = row * ySpacing + (ySpacing - pinHeight) / 2;

      //adding the x,y
      pins[i][0] = x;
      pins[i][1] = y;
      
    }

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
        zoom: pin[6]
      });
      
     
      showLocationModal(pin);

    
    } 
  });
}

