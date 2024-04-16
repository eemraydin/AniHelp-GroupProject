import {ttkey} from './common.js';
import { Report, addReport,updateReportUser}  from './class/report.js';

 import { getAllOrganizations } from "./class/organization.js";

 import { login, signup, logout,googleSignIn, getUserDetails  } from './authentication.js';

 import { auth } from "./common.js";

// =================IDs=======================
//user name: name
//email: email
//phone: phone
//address: address
//submit button: submitBtn
// print area div: list
// ===================================================
 
// =================User=======================
let reporterDetails;

getUserDetails().then((user)=>{
  if(user){
    reporterDetails = user;
    username.value = reporterDetails.displayName;
    username.disabled = true;
  }

 //the return object "user" contains these info: displayname, email, isadmin, uid
})

// ===================================================
// =============== CURRENT DATE AND TIME ====================================
const now = new Date();
const vancouverTimeZone = { timeZone: 'America/Vancouver' };

  // Format date to YYYY-MM-DD for input type date
  const formattedDate = now.toLocaleDateString('en-CA', vancouverTimeZone);
  document.getElementById('date').value = formattedDate;
  document.getElementById('date').setAttribute('max', formattedDate);
  


  // Format time to HH:MM for input type time
  const formattedTime = now.toLocaleTimeString('en-CA', { hour12: false, hour: '2-digit', minute: '2-digit' });
  document.getElementById('time').value = formattedTime;
  // document.getElementById('time').setAttribute('max', formattedTime);




// =================Animal Class selection=======================
// ===================================================



let selectedAnimalType="";
let selectedAnimalClass=""
let typeSelection=""
function showAnimalType() {
  let animalClass = document.getElementById("animalClass").value;
  let animalTypeDiv = document.getElementById("animalTypeDiv");
  let animalType=document.getElementById("animalType");
  // Clear existing options in the secondary dropdown
  animalType.innerHTML = '';

  
  switch (animalClass) {
    case "Mammals":
      animalTypeSelect(animalType, ["Select", "Moose", "Bear", "Wolf/coyote","Cougar/Lynx","Deer","Raccoon","Bat","Dog","Cat","Squirrel","Other"]);
      selectedAnimalClass="Mamaals"
        return selectedAnimalClass;
  
    case "Birds":
      animalTypeSelect(animalType, ["Select", "Raptor", "Goose", "Crow","Pidgeon","Other"]);
      selectedAnimalClass="Birds"
        return selectedAnimalClass;
  
        
    case "Reptiles":
      animalTypeSelect(animalType, ["Select", "Snake", "Turtle", "Lizard","Other"]);
      selectedAnimalClass="Reptiles"
        return selectedAnimalClass;
        
        
    case "Amphibian":
      animalTypeSelect(animalType, ["Select", "Frog", "Salamander", "Other"]);
      selectedAnimalClass="Amphibian"
        return selectedAnimalClass;
        
    case "Marine Mammals":
      animalTypeSelect(animalType, ["Select", "Whale", "Dolphin", "Seal","Other"]);
      selectedAnimalClass="Marine Mammals"
      return selectedAnimalClass;
     
     
  }
}
function animalTypeSelect(selectElement, options) {
  options.forEach(function (optionText) {
      var option = document.createElement("option");
      option.value = optionText;
      option.text = optionText;
      selectElement.appendChild(option);
  });
}

animalClass.addEventListener("change",function(){

  animalTypeDiv.hidden=false;
  showAnimalType()

})

animalType.addEventListener("change",function(){
  typeSelection = animalType.value
  
  //check which type selected
  switch (typeSelection) {
    case "Moose":
      case "Bear":
        case "Wolf/coyote":
          case "Cougar/Lynx":
            case "Deer":
    selectedAnimalType = "Big Mammals"
        break;
     
    case "Raccoon":
      case "Bat":
      case "Dog":
      case "Cat":
      case "Squirrel":
    selectedAnimalType = "Small Mammals"
        break;
   
      case  "Goose":
        case "Crow":
          case "Pidgeon":
            case "Squirrel":
              
    selectedAnimalType = "Bird"
        break;

      case  "Snake":
        case "Turtle":
          case "Lizard": 
    selectedAnimalType = "Reptiles"
        break;

      case  "Frog":
        case "Salamander":
          case "Lizard": 
    selectedAnimalType = "Amphibian"
        break;

      case  "Whale":
        case "Dolphin":
          case "Seal": 
    selectedAnimalType = "Marine Mammals"
        break;
   
      
  }

  // check if other selected
  if(animalClass.value == "Mammals" && typeSelection == "Other"){
    selectedAnimalType = "Mammals"
  }else if(animalClass.value == "Birds" && typeSelection == "Other"){
    selectedAnimalType = "Birds"
  }else if(animalClass.value == "Reptiles" && typeSelection == "Other"){
    selectedAnimalType = "Reptiles"
  }else if(animalClass.value == "Amphibian" && typeSelection == "Other"){
    selectedAnimalType = "Amphibian"
  }else if(animalClass.value == "Marine Mammals" && typeSelection == "Other"){
    selectedAnimalType = "Marine Mammals"
  }

  if(typeSelection == "Raptor"){
    selectedAnimalType = "Raptor"
  }

})

 


// =======================================================================
// =================Photo add with Camera to object=======================



let video = document.getElementById('camera');
//hide the camera
video.style.display='none';
video.setAttribute("autoplay", "false");
video.setAttribute("playsinline", "true");
// Elements for taking the snapshot
let canvas = document.getElementById('canvas');
let snap = document.getElementById('snap');
let context = canvas.getContext('2d');
context.scale(0.5, 0.5);

// elements to control actions
const startBtn = document.getElementById('start_camera');
const stopBtn = document.getElementById('stop_camera');
const snapBtn = document.getElementById('snap')
snapBtn.disabled = true;

// START CAMERA
function startCamera(e) {
  e.preventDefault();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      let mediaPromise = navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        mediaPromise.then((stream) => {
            // called if successful
            video.srcObject = stream;
            canvas.setAttribute("hidden",false)
            //display the camera
            video.style.display='block';
            //activate the buttons
            startBtn.disabled = true;
            stopBtn.disabled = false;
            snapBtn.disabled = false;


          });
          mediaPromise.catch((error) => {
            console.error(error);
            // called if failed
            context.font = '20px Tahoma';
            context.fillText(error, 20, 100);
          });
    } else {
          console.log("this browser doesn't support media devices");
        }
}
startBtn.addEventListener('click', (e) => startCamera(e));

// STOP CAMERA
function stopCamera() {
  let tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  startBtn.disabled = false;
  stopBtn.disabled = true;
  snapBtn.disabled = true;

  //hide the camera
  video.style.display='none';
  canvas.setAttribute("hidden",false)
}
// attach stopCamera function to stop button
stopBtn.addEventListener('click', stopCamera);

// attach snapPhoto function to snap button
snapBtn.addEventListener('click', () => snapPhoto());

// Trigger taking photo
let canvasDataURL = '';
let snap_counter = 0; // count the snaps for limiting to 5
let photoGalery = [];

// SNAP PHOTO
function snapPhoto() {
  if (snap_counter < 5) {
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    canvasDataURL = canvas.toDataURL();
    // Snap limit
    createSnapshotImage(canvasDataURL);
    snapBtn.disabled = true;
    video.style.display='none';
    snap_counter++;
  } else {
    alert('You can only add up to 5 photos.');
    snapBtn.disabled = true;
  }
}


  let image_preview= document.getElementById("image_preview");
  let imageGalery= document.getElementById("imageGalery")
  let optionsDiv = document.createElement('div');
  let useButton = document.createElement('button');
  let retakeButton = document.createElement('button');
  useButton.setAttribute("id","useButton");



  //CREATE SNAPSHOT
function createSnapshotImage(dataURL) {
  
  let copyImg = document.createElement('img');
  copyImg.style.height = '240px';
  copyImg.src = dataURL;
  image_preview.appendChild(copyImg);

  optionsDiv.classList.add('photo-options');
  useButton.innerText = 'Use Photo';
  
  retakeButton.innerText = 'Retake';
  retakeButton.addEventListener('click', () => retakePhoto(optionsDiv));
  optionsDiv.appendChild(useButton);
  optionsDiv.appendChild(retakeButton);

  image_preview.append(optionsDiv);
  
}

useButton.addEventListener('click', () => usePhoto(canvasDataURL));

let imageIndex = 0; // Initialize an index counter for the images





  // SELECTED PICTURE
function printSelectedImage(dataURL) {
    const copyToGalery = document.createElement('img');
    copyToGalery.style.height = '120px';
    copyToGalery.src = dataURL;
    const snapDiv = document.createElement('div');
    snapDiv.classList.add('snap-photo-div');
    
    const deleteFromGalery = document.createElement('button');
    deleteFromGalery.innerHTML = '&#10006;'; // Unicode 'x' character
    deleteFromGalery.classList.add('delete-button');

    // Set a data attribute to identify the photo for deletion
    snapDiv.setAttribute('data-photo-index', photoGalery.length-1);
    imageIndex++;
    imageGalery.append(snapDiv);
    snapDiv.appendChild(copyToGalery);
    snapDiv.appendChild(deleteFromGalery);
  
    deleteFromGalery.addEventListener('click', () => {


      
      const photoIndex = snapDiv.getAttribute('data-photo-index');
      if (photoIndex !== null) {
          const index = parseInt(photoIndex);
          if (!isNaN(index)) {
              deletePhoto(index);
            
          }
      }
  });

}
  //SELECT PICTURE
function usePhoto(dataURL) {
    photoGalery.push(dataURL);
    printSelectedImage(dataURL); // push every snaped picture to array
    snapBtn.disabled=false;

    if (stopBtn.disabled==true) {
      snapBtn.disabled=true;
    }


    optionsDiv.remove();
    image_preview.innerHTML='';
    canvasDataURL='';
    if (snap_counter==5) {
      snapBtn.disabled=true;
    }
    video.style.display='block';
}
  //RETAKE PICTURE
function retakePhoto(optionsDiv) {
    // Remove the options and captured image
    image_preview.innerHTML='';
  
    snapBtn.disabled = false;
    optionsDiv.remove();
    video.style.display='block';
    snap_counter--;
}
//DELETE FROM GALLERY
function deletePhoto(index) {
  // Remove the photo from the photoGalery array
  photoGalery.splice(index, 1);

  // Remove the photo and the associated delete button from the screen
  const snapDiv = document.querySelector(`[data-photo-index="${index}"]`);
  if (snapDiv) {
      imageGalery.removeChild(snapDiv);
      // Update data-photo-index attributes for the remaining items in the gallery
      const snapDivs = imageGalery.querySelectorAll('.snap-photo-div');
      snapDivs.forEach((div, i) => {
          div.setAttribute('data-photo-index', i);
      });
      snap_counter--;
      if (snap_counter<5) {
        snapBtn.disabled=false;
      }
  }
}




// ====================================================================
// ====================================================================
        



// =================Saved photo add to object=======================
// =====================================================================


// Select the file input and the upload button
const fileInput = document.getElementById('addPhoto');
const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB

fileInput.addEventListener('change', (event) => {
  const files = event.target.files;

  if (files.length > 0) {
    const file = files[0];

    // Check if the file size is within the limit
    if (file.size > maxSizeInBytes) {
      alert('File size exceeds the limit. Please choose a smaller file.');
      // Clear the file input
      event.target.value = null;
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const dataURL = e.target.result;
      // Use the dataURL to display the image in the gallery
      printSelectedImage(dataURL);
      photoGalery.push(dataURL);
    };

    reader.readAsDataURL(file);
    // Clear the file input to be able to add the same file after deleting it
    event.target.value = null;
  }
  snap_counter++;
  if (snap_counter==5) {
    snapBtn.disabled=true;
  }
});




// ====================================================================
// ====================================================================




// =================Location/MAP=======================================


let userLNG = '';
let userLTT = '';
let markerLocation = '';
let markerRealAddress="";
let lngLat = "";
let center = [-123.044466, 49.243723];
var roundLatLng = Formatters.roundLatLng;//format the coordinates 

  


  //Map API
let map = tt.map({
  key: ttkey,
  container: 'map',
  dragPan: !isMobileOrTablet(),
  center: center,
  zoom: 9,
  style: `https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAZ2R4MTZLWHhubUxCQUV1Nzs4OGY2ZDFjNC03YjVmLTQyYTctYTViYS1mYWY1NDVmODNmMzE=.json?key=${ttkey}`
});



map.dragPan.enable({
  linearity: 0.3,
  maxSpeed: 2000,
  deceleration: 2500,
});

let popup = new tt.Popup({
  offset: 35,
  closeOnClick:false,
  closeOnMove:true
});


const options = {
  searchOptions: {
    key: ttkey,
    language: "en-GB",
    limit: 5,
    
    
  },
  autocompleteOptions: {
    key: ttkey,
    language: "en-GB",
    
  },
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
  showAccuracyCircle:false,
  placeholder: "Search a location...",
  
};



// =================== SEARCH BAR ==========================


var ttSearchBox = new tt.plugins.SearchBox(tt.services, options)
var searchMarkersManager = new SearchMarkersManager(map)
ttSearchBox.on("tomtom.searchbox.resultsfound", handleResultsFound)
ttSearchBox.on("tomtom.searchbox.resultselected", handleResultSelection)
ttSearchBox.on("tomtom.searchbox.resultfocused", handleResultSelection)
ttSearchBox.on("tomtom.searchbox.resultscleared", handleResultClearing)
map.addControl(ttSearchBox, "top-left")
let searchBoxHTML = ttSearchBox.getSearchBoxHTML()

searchBoxHTML.addEventListener("click",()=>{
  searchBoxHTML.style.width="500px";
})  


function handleResultsFound(event) {
  var results = event.data.results.fuzzySearch.results

  if (results.length === 0) {
    searchMarkersManager.clear()
  }
  searchMarkersManager.draw(results)
  fitToViewport(results)
}

function handleResultSelection(event) {
  var result = event.data.result
  if (result.type === "category" || result.type === "brand") {
    return
  }
  searchMarkersManager.draw([result])
  fitToViewport(result)
}

function fitToViewport(markerData) {
  if (!markerData || (markerData instanceof Array && !markerData.length)) {
    return;
  }
  var bounds = new tt.LngLatBounds();

  if (markerData instanceof Array) {
    markerData.forEach(function (marker) {
      var markerBounds = getBounds(marker);
      if (markerBounds) {
        bounds.extend(markerBounds[0]);
        bounds.extend(markerBounds[1]);
      }
    });
  } else {
    var markerBounds = getBounds(markerData);
    if (markerBounds) {
      bounds.extend(markerBounds[0]);
      bounds.extend(markerBounds[1]);
    }
  }

  map.fitBounds(bounds, { padding: 50, linear: false });
}

function getBounds(data) {
  if (data.viewport) {
    var btmRight = [
      data.viewport.btmRightPoint.lng,
      data.viewport.btmRightPoint.lat,
    ];
    var topLeft = [
      data.viewport.topLeftPoint.lng,
      data.viewport.topLeftPoint.lat,
    ];

    // Ensure correct order for LngLatBounds (topLeft, btmRight)
    return [topLeft, btmRight];
  }
  return null;
}

function handleResultClearing() {
  searchMarkersManager.clear()
}

function SearchMarkersManager(map, options) {
  this.map = map
  this._options = options || {}
  this._poiList = undefined
  this.markers = {}
}

SearchMarkersManager.prototype.draw = function (poiList) {
  this._poiList = poiList
  this.clear()
  this._poiList.forEach(function (poi) {
    var markerId = poi.id
    var poiOpts = {
      name: poi.poi ? poi.poi.name : undefined,
      address: poi.address ? poi.address.freeformAddress : "",
      distance: poi.dist,
      classification: poi.poi ? poi.poi.classifications[0].code : undefined,
      position: poi.position,
      entryPoints: poi.entryPoints,
    }
    var marker = new SearchMarker(poiOpts, this._options)
    marker.addTo(this.map)
    this.markers[markerId] = marker
  }, this)
}

SearchMarkersManager.prototype.clear = function () {
  for (var markerId in this.markers) {
    var marker = this.markers[markerId]
    marker.remove()
  }
  this.markers = {}
  this._lastClickedMarker = null
}

function SearchMarker(poiData, options) {
  this.poiData = poiData
  this.options = options || {}
  this.marker = new tt.Marker({
    element: this.createMarker(),
    anchor: "bottom",
  })
  var lon = this.poiData.position.lng || this.poiData.position.lon
  this.marker.setLngLat([lon, this.poiData.position.lat])
}

SearchMarker.prototype.addTo = function (map) {
  this.marker.addTo(map)
  this._map = map
  return this
}

SearchMarker.prototype.createMarker = function () {
  var elem = document.createElement("div")
  elem.className = "tt-icon-marker-black tt-search-marker"
  if (this.options.markerClassName) {
    elem.className += " " + this.options.markerClassName
  }
  var innerElem = document.createElement("div")
  innerElem.setAttribute(
    "style",
    "display: block, background: white; width: 10px; height: 10px; border-radius: 50%; border: 3px solid black;"
  )

  elem.appendChild(innerElem)
  return elem
}

SearchMarker.prototype.remove = function () {
  this.marker.remove()
  this._map = null
}


// =========================================================
// =========================================================




// ====================Distant Calculation==== Closest organization ==========================



// Function to calculate the distance between two points
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}
let closestOrg = null;
let closestOrgId = null;

function GetClosestOrg() {
  let closestDistance = Number.MAX_VALUE;
  // Get the marked location

  getAllOrganizations()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const orgData = doc.data();

        let orgLocation=''
        //check type
        orgData.animal_type.forEach((type) => {
          if(type==selectedAnimalType){
            orgLocation=orgData.location; 
          }
        // Calculate the distance between the marked location and the organization
        const distance = haversineDistance(
          markerLocation.lat,
          markerLocation.lng,
          orgLocation.lat,
          orgLocation.lng
        );
        // Check if this organization is closer than the current closest one
        if (distance < closestDistance) {
          closestOrg = orgData;
          closestOrgId = doc.id;
          closestDistance = distance;
        }
      });
    });
      // closestOrg contains the organization closest to the marked location
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}


// ====================================================================

// ====================================================================


// =============Get current location and other map functions===========

// Define a Promise-based function to get the current location
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    function success(pos) {
      const crd = pos.coords;
      userLNG = crd.longitude;
      userLTT = crd.latitude;
      resolve({ lat: userLTT, lng: userLNG });
      markerLocation = {lat: userLTT, lng: userLNG };
      marker.setLngLat([userLNG, userLTT]);
    }
    
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      reject(err);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
    
  });
}


     //Function to convert coordinates to real address. REVERSE GEOLOCATION
function realAddressGenerator(markerLocation) {
  return new Promise((resolve, reject) => {
    tt.services.reverseGeocode({
      key: ttkey,
      position: markerLocation
    })
      .then((response) => {
        markerRealAddress = response.addresses[0].address.freeformAddress;
        resolve(markerRealAddress);
        
      })
      .catch((error) => {
        console.error('Error reverse geocoding:', error);
        reject(error);
      });
  });
}




async function mapClick(e){
  const { lng, lat } = e.lngLat;
  // // Set the marker's position to the clicked coordinates
  marker.setLngLat([lng, lat]);
  lngLat = marker.getLngLat(e);
  // Update the popup content with the new coordinates
  lngLat = new tt.LngLat(roundLatLng(lng), roundLatLng(lat));
  markerLocation = lngLat;
  
try {
  // Call realAddressGenerator to update the marker's address and wait for it to complete
  const newAddress = await realAddressGenerator(lngLat);
  markerRealAddress = newAddress;
  // Update the popup content after the address 
  popup.setHTML(markerRealAddress);
  popup.setLngLat(lngLat);
  marker.setPopup(popup);
  GetClosestOrg();
  
} catch (error) {
  console.error('Error updating address:', error);
}
marker.togglePopup();

}


let marker = new tt.Marker({
  draggable: true,
}).setLngLat(center).addTo(map);

//get the location when marker let free
async function onDragEnd() {
  lngLat = marker.getLngLat();
  lngLat = new tt.LngLat(roundLatLng(lngLat.lng), roundLatLng(lngLat.lat));
  //popup the coordinates

  try{
    const newAddress = await realAddressGenerator(lngLat);
    markerRealAddress = newAddress;
    popup.setHTML(markerRealAddress);
    popup.setLngLat(lngLat);
    marker.setPopup(popup);
  
  }catch(error){
    console.error('Error updating address:', error);
  }
  marker.togglePopup();
}

//create the map within a function
function createMap() { 
  map.scrollZoom.enable({ around: 'center' });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
  
  marker.on('dragend', onDragEnd);  // change marker on map click
  map.on('click',mapClick);
  center = lngLat;


  let geolocateControl = new tt.GeolocateControl({  // Current location button on the map
    positionOptions: {
      enableHighAccuracy: false,
      showUserLocation:true,
      trackUserLocation: true
    },
    
  });
  map.addControl(geolocateControl)
 
  // Use getCurrentLocation to get the current location before creating the map
    getCurrentLocation()
    .then((coords) => {
      center = [coords.lng, coords.lat];
      realAddressGenerator(center)
      marker.setLngLat([coords.lng, coords.lat]);
      markerLocation={lat: coords.lat, lng: coords.lng };
      GetClosestOrg();
      map.flyTo({center: center, zoom: 12});
    })
    .catch((error) => {
      // Handle errors, e.g., if geolocation is not available
      console.error('Error getting current location:', error);
    });
}
  

// Call createMap to start the process
createMap();


// ====================================================================
// ====================================================================




// CREATE SUCCESS PAGE
const successMessage = document.createElement("div");
successMessage.innerHTML = "<h1>Report Successfully Created</h1>";
successMessage.style.textAlign = "center";
successMessage.style.fontSize = "24px";
successMessage.style.paddingTop = "64px";
successMessage.style.display = "grid";
successMessage.style.margin = "200px auto";
successMessage.style.gridTemplateRows = "1fr 1fr 1fr"; // 3 rows: header, content, and button
successMessage.style.marginTop = "230px";
// const reportIdTitle = document.createElement("h2");
// reportIdTitle.innerText = "Report ID";
// reportIdTitle.style.fontSize = "16px";
// reportIdTitle.style.marginBottom = "16px";

const reportId = document.createElement("h2");
reportId.innerText = "Sign-up or Login for report updates";
reportId.style.fontSize = "24px";
reportId.style.marginTop = "26px";




const successIconContainer = document.createElement("div");
successIconContainer.style.display = "grid";
successIconContainer.style.gridTemplateRows = "1fr"; // 2 rows: icons and button
successIconContainer.style.gap = "20px"; 


const successIcon = document.createElement("div");
successIcon.style.clipPath = "circle(50% at 50% 50%)";
successIcon.style.height = "200px";
successIcon.style.width = "200px";
successIcon.style.backgroundColor = "#2D7A50";
successIcon.style.margin = "20px auto";
successIcon.style.position = "absolute";
successIcon.style.top = "15%";
successIcon.style.left = "50%";
successIcon.style.transform = "translate(-50%)";


const successCheck = document.createElement("div");
successCheck.style.clipPath = "polygon(25% 45%, 18% 52%, 40% 76%, 81% 39%, 74% 31%, 40% 61%)";
successCheck.style.height = "200px";
successCheck.style.width = "200px";
successCheck.style.margin = "20px auto";
successCheck.style.backgroundColor = "white";
successCheck.style.position = "absolute";
successCheck.style.top = "15%";
successCheck.style.left = "50%";
successCheck.style.transform = "translate(-50%)";


const signupButton = document.createElement("button");
signupButton.innerHTML = "Sign Up";
signupButton.style.display = "none";
signupButton.setAttribute("class","ah-btn ah-btn-primary");
signupButton.style.height = "70px";
signupButton.style.width = "200px";
signupButton.style.textAlign = "center";
signupButton.style.margin = "40px auto";


let returnHome = document.createElement("a");
returnHome.innerHTML = "Return Home";
returnHome.style.display = "none";
returnHome.setAttribute("class", "ah-btn ah-btn-primary");
returnHome.style.height = "65px";
returnHome.style.width = "160px";
returnHome.style.textAlign = "center";
returnHome.style.margin = "20px auto";
returnHome.style.textDecoration = "none";
returnHome.href = "../index.html";


let main = document.querySelector("main")
successMessage.style.display="none";
successIconContainer.appendChild(successIcon);
successIconContainer.appendChild(successCheck);
successIconContainer.appendChild(signupButton);
successMessage.appendChild(reportId);
successMessage.appendChild(successIconContainer);
successMessage.appendChild(returnHome);
main.appendChild(successMessage);

// ====================================================================================
// ====================================================================================

// animal condion radio button
function getSelectedValue() {

  var radioButtons = document.getElementsByName('animalStatus');

  // Loop through the radio buttons to find the checked one
  var checkedValue;
  for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
          checkedValue = radioButtons[i].value;
          return checkedValue;
          break; // Exit the loop once a checked radio button is found
      }
  }

}
//cancel button action
document.getElementById("cancelBtn").addEventListener("click", function () {
  window.location.href = '../index.html';
});

// =================Submit button action===========================================


let formAction = document.getElementById("userForm");
const userData = []
let aniHelpReportId ="";

let placeholderImagePath = 'data:image/png;base64,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'
async function submitReport(user) {
  if(selectedAnimalType == null || selectedAnimalType == ""){
    alert("Please select an animal type!");
    throw "Please select an animal type!";
  }
  if (closestOrgId == null) {
    alert("Please select a location on the map!");
    throw "Please select a location on the map!";
  }else{

    //user inputs are assigned to a variable.
    let user_description = document.getElementById("description");
    let user_condition = document.getElementById("animalStatus");
    let user_date = document.getElementById("date");
    let user_time = document.getElementById("time");
    let user_name = document.getElementById("name");
    let user_phone= document.getElementById("phone");
    let status = "Open"; //Remove - this will be handled by addReport function

    let arrimg = [];
 
    if (photoGalery.length === 0) {
      
      arrimg.push(placeholderImagePath);
    }
    // Add user-selected pictures to the array
    for (var i = 0; i < photoGalery.length; i++) {
      arrimg.push(photoGalery[i]);
    }
    let userReport = new Report(selectedAnimalType,
      typeSelection,
      user_description.value,
      getSelectedValue(),
      arrimg,
      markerLocation,
      new Date(user_date.value + " " + user_time.value),
      (user != null) ? user.displayName:username.value,
      user_phone.value,
      markerRealAddress,
      status,
      closestOrgId,
      (user != null) ? user.uid:null)

    userData.push(userReport);
    console.log(userReport)
    try {
      // Add the report to the database
      aniHelpReportId = await addReport(userReport);
  
      // Update aniHelpReportId in localStorage
      localStorage.setItem("aniHelpReportId", aniHelpReportId);
  
      console.log(aniHelpReportId);
  
      // Notify the user that the report has been submitted
      console.log("Report submitted successfully!");
  
      // Display the success message and hide the form
      formAction.style.display = "none";
      document.getElementById("createReport").style.display="none"
      successMessage.style.display = "block";
  
      // If the user is not logged in, display the signup button
      if (!user) {
        signupButton.style.display = "block";
      }
  
    } catch (error) {
      console.error("Error submitting report:", error);
      // Handle the error, optionally display an error message to the user
    }}
 }
 
// ====================================================================================

 formAction.addEventListener("submit", async (event) => {
  event.preventDefault();
 
  // Check if the user is logged in
  const user = await getUserDetails();

  if (user) {
    // User is logged in, submit the report directly
    try{
      await submitReport(user);
      formAction.style.display = "none";
      reportId.style.display = "none";
      successMessage.style.display = "block";
      returnHome.style.display = "block";
      
    }
    catch(error){
      //optional: display error on modal
    }

  } else {

     try{
      await submitReport(user); // sent report either way if user logins or not. 
      formAction.style.display = "none";
      successMessage.style.display = "block";
      signupButton.style.display = "block";
      returnHome.style.display = "block";
     

       signupButton.addEventListener("click", async () => {
        try {
          // Perform signup and wait for user details
          const userAfterSubmit = await googleSignIn(user);
  
          // User is now logged in, submit the report
          
          updateReportUser(aniHelpReportId,userAfterSubmit.uid).then(
            signupButton.style.display = "none",
           reportId.innerHTML="Your report linked to your account.")
           
    
          // loginButton.style.display = "none";
          // signupButton.style.display = "none";



        } catch (error) {
          console.log(error);
        }
      });
     }catch(error){
       //optional: display error on modal
     }
  }
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // You can use 'auto' instead of 'smooth' for an instant scroll
});
})
