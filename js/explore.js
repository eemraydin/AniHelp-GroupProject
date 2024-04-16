import { ttkey } from './common.js';
import { timeAgo } from './utils.js';
import { getAllReports, reportStatusList} from "./class/report.js";

const options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 0,
    showAccuracyCircle:false
  };

const geolocateControl = new tt.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
    },
  });

const map = tt.map({
    key: ttkey,
    container: 'exploremap',
    dragPan: !isMobileOrTablet(),
    center: [-99.98580752275456, 33.43211082128627],
    zoom: 3,
    style: `https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAZ2R4MTZLWHhubUxCQUV1Nzs4OGY2ZDFjNC03YjVmLTQyYTctYTViYS1mYWY1NDVmODNmMzE=.json?key=${ttkey}`

});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());
map.addControl(geolocateControl);

map.dragPan.enable({
    linearity: 0.3,
    maxSpeed: 2000,
    deceleration: 2500,
  });

function createMarker(icon, position, color, popupText) {
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
    new tt.Marker({element: markerElement, anchor: 'bottom'})
        .setLngLat(position)
        .setPopup(popup)
        .addTo(map);
}
loadData();

function loadData() {
    let maplist = document.getElementById('maplist');

    getAllReports().then((arr) => {
        arr.forEach((doc) => {
            let data = doc.data();
            if (data.status != reportStatusList.Open.text) {
                return;
            }

            if (data.location.lat < 0) {
                console.warn(`Error on ${doc.id} location:`, data.location);
                return;
            }

            let card = document.createElement("article");
            card.setAttribute("class", "report-card");

            
            


            card.innerHTML = `<div class="cards">

                <img class="ah-cardImage" src=${data.photo}>
                <h3>${data.animalType}</h3>
                <p><i class='ah-location'></i>${data.realAddress}</p>
                <p><i class='ah-calendar'></i>${timeAgo(data.date)}</p>
                <p>Description: ${data.description}</p>
                <a href="./detailspage.html?id=${doc.id}"><button class="viewBtn">View Details</button></a>
                </div>`;

            let card2 = document.createElement("article");
            card2.setAttribute("class", "report-card-popup");


            card2.innerHTML = `<div class="mapPopup">

                <img src=${data.photo}>
                <h3>${data.animalType}</h3>
                <p><i ></i>${data.realAddress}</p>
                <p><i ></i>${timeAgo(data.date)}</p>
                <p>Description: ${data.description}</p>
                <a href="./detailspage.html?id=${doc.id}"><button class="viewBtn">View</button></a>
                </div>`;

            maplist.append(card);
            createMarker('../assets/logo-favicon.svg', [data.location.lng, data.location.lat], '#09579F', card2.outerHTML);
        });
    });
}



function getCurrentLocation() {
return new Promise((resolve, reject) => {
    function success(pos) {
    const crd = pos.coords;
    
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
   
}).catch(err => {
    console.log(err);
});