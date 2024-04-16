import { ttkey } from './common.js'
import { getReportById, getStatus,getStatusList, updateReportStatus, reportStatusList  } from './class/report.js';
import { getOrganizationById } from './class/organization.js';

let user_lng = ""
let user_lat = ""
let queryString = window.location.search; //http://localhost:5500/pages/detailspage.html?id=10YMy89nBl1UsadErM3I (example for video)
let id = (queryString.split("=")[1]);
let PrintReportID = document.getElementById("reportID");

PrintReportID.innerHTML=id;

var map = tt.map({
  key: ttkey,
  container: 'map',
  dragPan: !isMobileOrTablet(),
  center: [-123.1207,49.2827],
  zoom: 3,
  style: `https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAZ2R4MTZLWHhubUxCQUV1Nzs4OGY2ZDFjNC03YjVmLTQyYTctYTViYS1mYWY1NDVmODNmMzE=.json?key=${ttkey}`
});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

function createMarker( position, color, popupText) {
  var markerElement = document.createElement('div');
  markerElement.className = 'marker';

  var markerContentElement = document.createElement('div');
  markerContentElement.className = 'marker-content';
  markerContentElement.style.backgroundColor = color;
  markerElement.appendChild(markerContentElement);

  var iconElement = document.createElement('div');
  iconElement.className = 'marker-icon';
  iconElement.style.backgroundImage =
    'url("../assets/logo-favicon.svg")';
  markerContentElement.appendChild(iconElement);

  var popup = new tt.Popup({ offset: 30 }).setText(popupText);
  // add marker to map
  new tt.Marker({ element: markerElement, anchor: 'bottom' })
    .setLngLat(position)
    .setPopup(popup)
    .addTo(map);
}

getReportById(id).then(result => {

  let organization;
  getOrganizationById(result.orgID).then(org =>{
    organization =org;
    orgfield.innerHTML = `${organization.name}<br>
    <a href="tel:${organization.phone}"><p>${organization.phone}</p></a>
    <a href="mailto:${organization.email}"><p>${organization.email}</p></a>
    <p>${organization.address}</p>`;
  })
  let photoNum = 0;
  result.photo.forEach(element => {
  
    let img = document.createElement('img');
    img.setAttribute('class', `ah-image-card`);
    img.src = element;

    photo.appendChild(img);
    photoNum+=1;
  });

  /*---------- image slider action ---------------*/
  prev.addEventListener("click", function(){
    plusSlides(-1);
  })
  next.addEventListener("click", function(){
    plusSlides(1);
  })
  
  let slideIndex = 1;

  if(result.photo.length > 0){
    showSlides(slideIndex);
  }

  function plusSlides(n) {
    showSlides(slideIndex += n);
  }
  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("ah-image-card");
    if(slides.length > 0){
      if (n > slides.length) {slideIndex = 1}    
      if (n < 1) {slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
      }
      slides[slideIndex-1].style.display = "block";  
    }
  }
/*---------- image slider action ---------------*/

  animalType.innerHTML = result.animalType;
  reportStatus.innerHTML = getStatusWithIcon(result.status);
  animalClass.innerHTML = result.animalClass;
  let reportDate = new Date(result.date);
  date.innerHTML = reportDate.toLocaleDateString();
  time.innerHTML = reportDate.toLocaleTimeString();
  location.innerHTML = result.realAddress;
  description.innerHTML = result.description;

  user_lng = Number(result.location.lng);
  user_lat = Number(result.location.lat);
  createMarker( [user_lng , user_lat], '#09579F', result.realAddress);
})

function getStatusWithIcon(status){
  let text = getStatus(status).text;

  switch(text){
    case reportStatusList.Open.text:
      return `<i class="ah-open-icon">${text}</i>`;
    case reportStatusList.InProgress.text:
      return `<i class="ah-inprogress-icon">${text}</i>`;
    case reportStatusList.Saved.text:
      return `<i class="ah-saved-icon">${text}</i>`;
    case reportStatusList.CantFind.text:
      return `<i class="ah-cantfind-icon">${text}</i>`;
    case reportStatusList.Deceased.text:
      return `<i class="ah-deceased-icon">${text}</i>`;
    case reportStatusList.PickedUp.text:
      return `<i class="ah-pickedup-icon">${text}</i>`;
      default: return " ";
  }
}