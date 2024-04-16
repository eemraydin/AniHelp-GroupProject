import { auth, ttkey } from './common.js'
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
  getOrganizationById(result.orgID).then(org =>{
    if(auth.currentUser == null || auth.currentUser.uid != org.uid){
      window.location = "./adminhome.html";
    }else{
      divstatusReport.hidden = false;
    }

  })
    result.photo.forEach(element => {
  
    let img = document.createElement('img');
    img.setAttribute('class', `ah-image-card`);
    img.src = element;

    photo.appendChild(img);
  
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
  nameOfReporter.innerHTML = result.name;
  phone.innerHTML = result.phone;

  user_lng = Number(result.location.lng);
  user_lat = Number(result.location.lat);
  createMarker( [user_lng , user_lat], '#09579F', result.realAddress);
  statusChange.appendChild(createStatusList(result));

  ///CHILD REPORTS
  if(result.childReports){

    let slideIndex = [1,1];
    let slideId = [];

    function plusSlides(n, no) {
      showSlides(slideIndex[no] += n, no);
    }

    function showSlides(n, no) {
      let i;
      let x = document.getElementsByClassName(slideId[no]);
      if (n > x.length) {slideIndex[no] = 1}    
      if (n < 1) {slideIndex[no] = x.length}
      for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
      }
      x[slideIndex[no]-1].style.display = "block";  
    }

    let slideCtr = 0;
    let childReportHeader = document.createElement('h3');
    childReportHeader.innerText ="Merged Reports"
    childReports.appendChild(childReportHeader);

    result.childReports.forEach(item => {
      // getReportById(item.id).then(result => {
      let divChildReport = document.createElement('div');
      divChildReport.setAttribute('class', 'ah-flex');

        let divPhoto = document.createElement('div');
        divPhoto.setAttribute('class', 'ah-flex-item');

        let divChildCarousel = document.createElement('div');
        divChildCarousel.setAttribute('class', 'ah-carousel');
        
       

        if(item.photo){

          let prevChild = document.createElement('a');
          prevChild.setAttribute('class', 'prevchild prev');
          prevChild.setAttribute('id', `prev-${slideCtr}`); //
          prevChild.innerHTML = "&#10094;";
          prevChild.addEventListener('click', function(e){
            plusSlides(-1,e.target.id.split('-')[1]);
          })
          divChildCarousel.appendChild(prevChild);
          
          let nextChild = document.createElement('a');
          nextChild.setAttribute('class', 'nextchild next');
          nextChild.setAttribute('id', `next-${slideCtr}`); //
          nextChild.innerHTML = "&#10095;";
          nextChild.addEventListener('click', function(e){
            plusSlides(1,e.target.id.split('-')[1]);
          })
          divChildCarousel.appendChild(nextChild);
          
          slideId.push(`ah-image-card-child${slideCtr}`);
          item.photo.split(',').forEach(element => {

            let img = document.createElement('img');
            img.setAttribute('class', `ah-image-card-child${slideCtr}`);
            img.src = element;
  
            divChildCarousel.appendChild(img);
          });
  
          divPhoto.appendChild(divChildCarousel);
          slideCtr+=1;

        }
        

        let divDetails = document.createElement('div');
        divDetails.setAttribute('class', 'ah-flex-item');

        let divAnimalType = document.createElement('div');
        divAnimalType.setAttribute('class', 'reportdetailsdiv');
        let animalType = document.createElement('h4');
        animalType.innerText = item.selectedAnimalType;
        divAnimalType.appendChild(animalType);
        divDetails.appendChild(divAnimalType);

        ////////------------REPORTID
        let divReportId = document.createElement('div');
        divReportId.setAttribute('class', 'reportdetailsdiv');

        let labelReportId = document.createElement('p');
        labelReportId.setAttribute('class', 'reportDetails');
        labelReportId.innerText = "Report ID:";
        divReportId.appendChild(labelReportId);

        let reportId = document.createElement('span');
        reportId.setAttribute('class', 'reportDetails');
        reportId.innerHTML = `<a href="admindetailspage.html?id=${item.id}">${item.id}</a>`;
        divReportId.appendChild(reportId);
        divDetails.appendChild(divReportId);

          ////////------------ANIMAL TYPE
          let divAnimalclass = document.createElement('div');
          divAnimalclass.setAttribute('class', 'reportdetailsdiv');

          let labelAnimalClass = document.createElement('p');
          labelAnimalClass.setAttribute('class', 'reportDetails');
          labelAnimalClass.innerText = "Type Of Animal:";
          divAnimalclass.appendChild(labelAnimalClass);

          let animalClass = document.createElement('span');
          animalClass.setAttribute('class', 'reportDetails');
          animalClass.innerText = item.animalClass;
          divAnimalclass.appendChild(animalClass);
          divDetails.appendChild(divAnimalclass);

        ////////------------DATE
        let childReportDate = new Date(item.reportDate);

        let divDate = document.createElement('div');
        divDate.setAttribute('class', 'reportdetailsdiv');

        let labelDate = document.createElement('p');
        labelDate.setAttribute('class', 'reportDetails');
        labelDate.innerText = "Date:";
        divDate.appendChild(labelDate);

        let reportDate = document.createElement('span');
        reportDate.setAttribute('class', 'reportDetails');
        reportDate.innerText = childReportDate.toLocaleDateString();
        divDate.appendChild(reportDate);
        divDetails.appendChild(divDate);


        ////////------------TIME
        let divTime = document.createElement('div');
        divTime.setAttribute('class', 'reportdetailsdiv');

        let labelTime = document.createElement('p');
        labelTime.setAttribute('class', 'reportDetails');
        labelTime.innerText = "Time:";
        divTime.appendChild(labelTime);

        let reportTime = document.createElement('span');
        reportTime.setAttribute('class', 'reportDetails');
        reportTime.innerText = childReportDate.toLocaleTimeString();
        divTime.appendChild(reportTime);
        divDetails.appendChild(divTime);

        ////////------------DESCRIPTION
        let divDescription = document.createElement('div');
        divDescription.setAttribute('class', 'reportdetailsdiv');

        let labelDescription = document.createElement('p');
        labelDescription.setAttribute('class', 'reportDetails');
        labelDescription.innerText = "Description:";
        divDescription.appendChild(labelDescription);

        let description = document.createElement('span');
        description.setAttribute('class', 'reportDetails');
        description.innerText = item.description;
        divDescription.appendChild(description);
        divDetails.appendChild(divDescription);

        ////////------------LOCATION
        let divLocation = document.createElement('div');
        divLocation.setAttribute('class', 'reportdetailsdiv');

        let labelLocation = document.createElement('p');
        labelLocation.setAttribute('class', 'reportDetails');
        labelLocation.innerText = "Location:";
        divLocation.appendChild(labelLocation);

        let location = document.createElement('span');
        location.setAttribute('class', 'reportDetails');
        location.innerText = item.location;
        divLocation.appendChild(location);
        divDetails.appendChild(divLocation);

        ////////------------REPORTER
        let divReporter = document.createElement('div');
        divReporter.setAttribute('class', 'reportdetailsdiv');

        let labelReporter = document.createElement('p');
        labelReporter.setAttribute('class', 'reportDetails');
        labelReporter.innerText = "Name Of Reporter:";
        divReporter.appendChild(labelReporter);

        let reporter = document.createElement('span');
        reporter.setAttribute('class', 'reportDetails');
        reporter.innerText = item.reporter;
        divReporter.appendChild(reporter);
        divDetails.appendChild(divReporter);

        ////////------------CONTACT
        let divContact = document.createElement('div');
        divContact.setAttribute('class', 'reportdetailsdiv');

        let labelContact = document.createElement('p');
        labelContact.setAttribute('class', 'reportDetails');
        labelContact.innerText = "Contact Info:";
        divContact.appendChild(labelContact);

        let contact = document.createElement('span');
        contact.setAttribute('class', 'reportDetails');
        contact.innerText = item.contact;
        divContact.appendChild(contact);
        divDetails.appendChild(divContact);

        divChildReport.appendChild(divPhoto);
        divChildReport.appendChild(divDetails);

        childReports.appendChild(divChildReport);

      });

    // })
  }
  ///CHILD REPORTS

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


function createStatusList(data){
  let statuslistSelect = document.createElement("select");    
  statuslistSelect.setAttribute("id", `statusdropdown`)
  statuslistSelect.setAttribute("class", `ah-dropdown`)

  let def = document.createElement("option");
  def.value = getStatus(data.status).id;
  def.innerText = data.status;
  def.disabled = true;
  def.selected = true;
  statuslistSelect.add(def);
  
  let statuslist = getStatusList(data.condition,data.status);
  statuslist.forEach(element => {
      let opt = document.createElement("option");
      opt.value = element.id;
      opt.innerText = element.text;
      statuslistSelect.add(opt);
  });

  statuslistSelect.addEventListener('change', ()=>{
      btnUpdateStatus.disabled=false;
  })
  return statuslistSelect;
}

btnUpdateStatus.addEventListener("click", ()=>{
    const statusDropdown = document.getElementById(`statusdropdown`);
    const selectedStatus = statusDropdown.value;
    const currentStatus = statusDropdown[0].value;

    //Update the status at the backend
    updateReportStatus(id, selectedStatus, currentStatus).then(()=>{
        alert("Updated");

        //Rebuild the dropdown to reflect the new allowed status selections
        getReportById(reportID.innerHTML).then(res => {
          //update child report status as well
          if(res.childReports){
            res.childReports.forEach(item => {
                updateReportStatus(item.id, selectedStatus, currentStatus);
            });
          }

          const statusdropdown = document.querySelector(`#statusdropdown`);
          if (statusdropdown) {
            statusChange.removeChild(statusdropdown);
          }
          statusChange.appendChild(createStatusList(res));
          reportStatus.innerHTML = getStatusWithIcon(res.status); //update displayed status 
          btnUpdateStatus.disabled=true;
        }).catch(getReportIdError => {
            console.log(getReportIdError);
        })
    }).catch(updateReportStatusError => {
        alert(updateReportStatusError)
    });
});