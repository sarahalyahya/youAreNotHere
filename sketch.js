
// Grabbing HTML elements 
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal");
const cancelLocationAdd = document.querySelector(".form__cancel"); 
const locationName = document.getElementById("loc-name");
const locationDescription = document.getElementById("loc-description");


//JS functions
function addLocationOnMap(){
  const position = myMap.pixelToLatLng(mouseX,mouseY);
  document.getElementById('placeholder').innerHTML = `${position.lat}, ${position.lng}`;
  toggleModal();}

//empties previous form values
  const resetForm = () => {
    locationName.value = "";
    locationDescription.value = "";
  };

//display and close modal
  const toggleModal = (action) => {
    if (action === "closeModal") {
      modal.classList.add("hidden");
    } else {
      modal.classList.remove("hidden");
    }
  }
  

  //calls all needed functions to close modal
  const closeModalHandler = (e) => {
    //default brings back map to Tantura home
    e.preventDefault();
    resetForm();
    toggleModal("closeModal");
  };
  


  //Event Listeners
  closeModalBtn.addEventListener("click", (e) =>{
    closeModalHandler(e);
  })

  cancelLocationAdd.addEventListener("click", (e) =>{
    closeModalHandler(e);
  })




const key = 'pk.eyJ1Ijoic2FyYWhhbHlhaHlhIiwiYSI6ImNsY3JjZGo3eDBlbmozeG1zbWV5enF3NHEifQ.riUptbqKaET6RE6XJ8usvg';

// Options for map
const options = {
  lat: 0,
  lng: 0,
  zoom: 0,
  style: 'mapbox://styles/sarahalyahya/clddbjxfo000901lasb1bl3ur',
  pitch: 0,
};


// Create an instance of MapboxGL
const mappa = new Mappa('MapboxGL', key);
let myMap;

let canvas;
let phrases;




function setup() {
  canvas = createCanvas(1920, 1080)
    
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  
  phrases = loadTable('testText for Blur - Sheet1.csv', 'csv', 'header');
  
  
  
  fill(252,190,17);
  stroke(100); 
  
}

function draw(){
  canvas.mouseClicked(addLocationOnMap); 

  }





