import { ttkey } from "./common.js";
import { getAllOrganizations } from "./class/organization.js";

// animalTypeDiv.style.display = "none";

let markerLocation ;
let marker;
let markersOnTheMap = {};

const options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 0,
    showAccuracyCircle:false,
    placeholder: "Search a location...",
    searchOptions: {
      key: ttkey,
      language: "en-GB",
      limit: 5
    },
    autocompleteOptions: {
      key: ttkey,
      language: "en-GB"
    }
  };

const geolocateControl = new tt.GeolocateControl({
positionOptions: {
    enableHighAccuracy: false,
},
});

createreportbtn.addEventListener('click', function(){
    window.location.href = "../pages/createreport.html";
});


function getCurrentLocation() {
return new Promise((resolve, reject) => {
    function success(pos) {
    const crd = pos.coords;
    markerLocation = { lat: crd.latitude, lng: crd.longitude};
    resolve({ lat: crd.latitude, lng: crd.longitude });
    }

    function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    reject(err);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
});
}



getCurrentLocation().then((result) => {
   map.flyTo({center: result, zoom: 12});
   
   marker = new tt.Marker({
    draggable: true,
  }).setLngLat(result).addTo(map);

}).catch(err => {
    console.log(err);
});

var map = tt.map({
    key: ttkey,
    container: 'map',
    center:  [-123.1353996, 49.3930454],
    zoom: 10,
    dragPan: isMobileOrTablet(),
    style: `https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAZ2R4MTZLWHhubUxCQUV1Nzs4OGY2ZDFjNC03YjVmLTQyYTctYTViYS1mYWY1NDVmODNmMzE=.json?key=${ttkey}`
});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());
map.addControl(geolocateControl);
map.on('click',mapClick);

/* ------------------START: SEARCH-------------------------------*/
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
  ////////
  marker.setLngLat(result.position);
  markerLocation = new tt.LngLat(roundLatLng(result.position.lng), roundLatLng(result.position.lat));
  GetClosestOrg();
  marker.togglePopup();
  /////////
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

/* ------------------END:  SEARCH-------------------------------*/

geolocateControl.on('geolocate', function(event) {
    var coordinates = event.coords;
    //state.userLocation = [coordinates.longitude, coordinates.latitude];
    console.log([coordinates.longitude, coordinates.latitude]);
    // ttSearchBox.updateOptions(Object.assign({}, ttSearchBox.getOptions(), {
    //     distanceFromPoint: state.userLocation
    // }));
});

async function mapClick(e){
    const { lng, lat } = e.lngLat;
    // // Set the marker's position to the clicked coordinates
    marker.setLngLat([lng, lat]);
    let lngLat = marker.getLngLat(e);
    // Update the popup content with the new coordinates
    lngLat = new tt.LngLat(roundLatLng(lng), roundLatLng(lat));
    markerLocation = lngLat;
    
    GetClosestOrg();
    
    marker.togglePopup();
}

let selectedAnimalType;

function GetClosestOrg() {
    if(selectedAnimalType == ""){
        return;
    }
    //clear markers on the map
    Object.keys(markersOnTheMap).forEach(function(id) {
        markersOnTheMap[id].remove();
        delete markersOnTheMap[id];
    });
    //clear contact list
    contactsdiv.innerHTML ="";

    getAllOrganizations()
      .then((querySnapshot) => {
        contactslist.hidden = false;

        querySnapshot.forEach((doc) => {
            const orgData = doc.data();
            let orgLocation='';

            //check type
            orgData.animal_type.forEach((type) => {
                if(type==selectedAnimalType){
                    orgLocation=orgData.location; 

                    const distance = haversineDistance(
                        markerLocation.lat,
                        markerLocation.lng,
                        orgLocation.lat,
                        orgLocation.lng
                    );
    
                    if(distance < 25){
                        createMarker('../assets/logo-favicon.svg', [orgData.location.lng, orgData.location.lat], '#09579F', orgData.name, doc.id);
                        
                        const contact = document.createElement('div'); // creates a div to contain the buttons
                        contact.setAttribute('class', 'ah-contactlist');
                        contact.innerHTML = `
                        <a href="tel:${orgData.phone}" class="ah-contact">${orgData.name}<i class="ah-call-icon"></i></a>`;
                        contactsdiv.appendChild(contact); 
                    }
                }
                
            });
      });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
  



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


animalClass.addEventListener("change",function(){
  animalTypeDiv.hidden = false;
  animalType.disabled = false;
  contactslist.hidden = true;
  showAnimalType();
})

let selectedAnimalClass=";"

function showAnimalType() {
  let animalClass = document.getElementById("animalClass").value;
  let animalType = document.getElementById("animalType");

  // Clear existing options in the secondary dropdown
  animalType.innerHTML = '';

  
  switch (animalClass) {
    case "Mammals":
      animalTypeSelect(animalType, ["Select", "Moose", "Bear", "Wolf/coyote","Cougar/Lynx","Deer","Raccoon","Bat","Dog","Cat","Squirrel","Other"]);
      selectedAnimalClass="Mammals"
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


  animalType.addEventListener("change",function(){
    let typeSelection = animalType.value
    
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
        case  "Bat":
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


    GetClosestOrg();
  })


  function createMarker(icon, position, color, popupText, id) {
    var markerElement = document.createElement('div');
    markerElement.className = 'marker';
    var markerContentElement = document.createElement('div');
    markerContentElement.className = 'marker-content';
    markerContentElement.style.backgroundColor = color;
    markerElement.appendChild(markerContentElement);
    var iconElement = document.createElement('div');
    iconElement.className = 'marker-icon';
    iconElement.style.backgroundImage =
        'url(' + icon + ')';
    markerContentElement.appendChild(iconElement);
    var popup = new tt.Popup({offset: 30}).setHTML(popupText);
    // add marker to map
    let newMarker = new tt.Marker({element: markerElement, anchor: 'bottom'})
        .setLngLat(position)
        .setPopup(popup)
        .addTo(map);
    markersOnTheMap[id] = newMarker

    newMarker.togglePopup();
}