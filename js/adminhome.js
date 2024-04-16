/*================= TO TEST UI ======================== 
    1. Comment out the following lines:

        1.a. The code below redirects the user to index page if a user is not logged in, and if is not admin

        if(!user){
        window.location = "../";
        }
        loggedUser = user;

        if(!loggedUser.isAdmin){
            window.location = "../";
        }


        1.b. The code below fetches the reports based on the user that is logged in.
            If no report was assigned to the user, this will return null.
    
            getReportsByOrganization(loggedUser.uid)


    2. Uncomment this line in order to fetch all reports:
        //getAllReports()

=================== TO TEST UI ========================*/

/*=================== TO TEST ACTUAL DATA ========================
    
To view all information on this page, it's required that
    1. Your credentials are added to the organization collection
    2. There is a report assigned to the organization where your credentials is linked

=================== TO TEST ACTUAL DATA  ========================*/

// ============================================================================
// IMPORT
// ============================================================================
import { getAllReports, getReportById, getStatusList, updateReportStatus, getStatus, getReportsByOrganization, mergeReports } from './class/report.js';
import { getUserDetails } from './authentication.js';
// ============================================================================
// DISPLAY INFO
// ============================================================================

const content = document.querySelector('.ah-content');
const itemsPerPage = 15;
let loggedUser;

getUserDetails().then(user => {
    if(!user){
        window.location = "../";
     }
     loggedUser = user;
 
     if(!loggedUser.isAdmin){            //redirect to index page if user is not an organization
         window.location = "../";
     }
     loadReports();
     
}).catch(err => {
    console.log(err);
});

function loadReports(id){
    tableBody.innerHTML = "";
    let items = []; // array of rows
    let rows = [];
    getReportsByOrganization(loggedUser.orgId)
     // getAllReports()
    .then((reports) => {
        
        if(reports == null){
            return;
        }
        let currentPage = 0;
        mergeBtn.disabled = true;
        reports.forEach(doc => {

            // Populate table:
            let data = doc.data();

            if(id && doc.id != id){
                return;
            }

            if(data.parent!=undefined){ //don't proceed with display if has a parent report
                return;
            };

            let row = tableBody.insertRow();
            items.push(data);
            row.setAttribute("id", doc.id)
            
            let cell1 = row.insertCell(0); //Select
            let cell2 = row.insertCell(1); //Report ID
            let cell3 = row.insertCell(2); //Location
            let cell4 = row.insertCell(3); //Date/Time
            let cell5 = row.insertCell(4); //Class of animal
            let cell6 = row.insertCell(5); //Type of animal
            let cell7 = row.insertCell(6); //Condition of animal
            let cell8 = row.insertCell(7); //Description
            let cell9 = row.insertCell(8); //Status
            let cell10 = row.insertCell(9); //Actions
            let saveBtn = `<label for="saveBtn"><button type="button" class="save" id="saveBtn-${doc.id}">Save</button></label>`;
            let viewBtn = `<label for="viewBtn"><button type="button" id="viewBtn-${doc.id}"><a href="./admindetailspage.html?id=${doc.id}">View</a></button></label>`;

            let hiddenPhotoField = `<input type="hidden" id="photo-${doc.id}" value="${data.photo}">`;
            let hiddenReporterField = `<input type="hidden" id="reporter-${doc.id}" value="${data.name}">`;
            let hiddenContactField = `<input type="hidden" id="contact-${doc.id}" value="${data.phone}">`;

            cell1.innerHTML = `<input type="checkbox" class="merge" name="merge"></>`;
            cell1.setAttribute('class', "ah-table-column ah-col-select");

            cell2.innerText = doc.id;
            cell2.setAttribute('class', "ah-table-column ah-col-id");

            cell3.innerText += data.realAddress
            cell3.setAttribute('class', "ah-table-column ah-col-address");
            cell3.setAttribute('id', `location-${doc.id}`);

            let reportDate = new Date(data.date);
            cell4.innerText = `${reportDate.toLocaleDateString()} ${reportDate.toLocaleTimeString()}`;
            cell4.setAttribute('class', "ah-table-column ah-col-date-and-time");
            cell4.setAttribute('id', `date-${doc.id}`);

            cell5.innerText = data.animalClass;
            cell5.setAttribute('class', "ah-table-column ah-col-animal-class");
            cell5.setAttribute('id', `animalclass-${doc.id}`);

            cell6.innerText = data.animalType;
            cell6.setAttribute('class', "ah-table-column ah-col-animal-type");
            cell6.setAttribute('id', `animaltype-${doc.id}`);

            cell7.innerText = data.condition;
            cell7.setAttribute('class', "ah-table-column ah-col-condition");

            cell8.innerText = data.description;
            cell8.setAttribute('class', "ah-table-column ah-col-description");
            cell8.setAttribute('id', `description-${doc.id}`);

            cell9.append(createStatusList(data, doc.id));
            cell9.setAttribute('class', "ah-table-column ah-col-status");

            cell10.innerHTML = saveBtn + viewBtn + hiddenPhotoField +  hiddenReporterField + hiddenContactField;
            cell10.setAttribute('class', "ah-table-column ah-col-buttons");

            rows.push(row);

        });
        createPageButtons(currentPage, items, rows);
        showPage(currentPage, rows);
        addSaveAction();
        addCheckboxEvent();

    });
}

function showPage(page, rows) { //displays a specified number of reports on the page 
    const startIndex = page * itemsPerPage; // first item to be displayed
    const endIndex = startIndex + itemsPerPage; // last item to be displayed

    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        if (index < startIndex || index >= endIndex) {
            element.classList.add("hidden");
        } else {
            element.classList.remove("hidden");
        };
    };
    updateActiveButtonStates(page);
};

function updateActiveButtonStates(currentPage) { // add/remove class of "active" to the button depending on the page being displayed
    const pageButtons = document.querySelectorAll('.pagination button');
    pageButtons.forEach((button, index) => { 
        if (index === currentPage) { 
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        };

    });
};

function createPageButtons(currentPage, items, rows) { //creates the buttons for pagination depending on the number of reports and number of reports per page
    document.querySelectorAll(".pagination").forEach(el => el.remove()); //remove existing pagination to avoid duplicate upon calling loadReports()

    const totalPages = Math.ceil(items.length / itemsPerPage); 
    const paginationContainer = document.createElement('div'); // creates a div to contain the buttons
    const paginationDiv = outputArea.appendChild(paginationContainer); 
    paginationContainer.classList.add('pagination'); 

    for (let j = 0; j < totalPages; j++) { 
        const pageButton = document.createElement('button'); // create a new button for each page
        pageButton.textContent = j + 1; 
        content.appendChild(paginationContainer); 
        paginationDiv.appendChild(pageButton); 

        pageButton.addEventListener('click', () => { //change number of current page depending on which button is clicked
            currentPage = j; 
            showPage(currentPage, rows); 
        });
    };
};

/*----  Add actions to all save buttons ---*/
function addSaveAction(){
    let saveBtns = document.getElementsByClassName("save");
    for (var i = 0; i < saveBtns.length; i++) {
        let btn = saveBtns[i];
        let id = btn.closest("tr").id;//Get the report id which is assigned to the row       

        btn.addEventListener('click', function(e) {
            const statusDropdown = document.getElementById(`status-${id}`);
            const selectedStatus = statusDropdown.value;
            const currentStatus = statusDropdown[0].value;

            //Update the status at the backend
            updateReportStatus(id, selectedStatus, currentStatus).then(()=>{
                alert("Updated");

                //Rebuild the dropdown to reflect the new allowed status selections
                getReportById(id).then(res => {
                    let td = statusDropdown.closest("td");
                    td.innerHTML  = "";
                    td.append(createStatusList(res, id))
                }).catch(getReportIdError => {
                    console.log(getReportIdError);
                })
            }).catch(updateReportStatusError => {
                alert(updateReportStatusError)
            });
        });

    }
}

let createStatusList = function(data, id){
    let statuslistSelect = document.createElement("select");    
    statuslistSelect.setAttribute("id", `status-${id}`)

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

    return statuslistSelect;
}

mergeBtn.addEventListener("click", function(){
    let reports =[];
    let checked = document.querySelectorAll('input[name=merge]:checked');
    let animalType;
    
    checked.forEach(function(e){
        const id = e.closest("tr").id;//Get the report id which is assigned to the row 
        const location = document.getElementById(`location-${id}`).innerHTML;
        const animalClass = document.getElementById(`animalclass-${id}`).innerHTML;
        const selectedAnimalType = document.getElementById(`animaltype-${id}`).innerHTML;
        const statusDropdown = document.getElementById(`status-${id}`);
        const currentStatus = statusDropdown[0].value;
        const reportDate = document.getElementById(`date-${id}`).innerHTML;
        const description = document.getElementById(`description-${id}`).innerHTML;
        const photo = document.getElementById(`photo-${id}`).value;
        const reporter = document.getElementById(`reporter-${id}`).value;
        const contact = document.getElementById(`contact-${id}`).value;

        if(animalType != undefined && animalType != selectedAnimalType){
            reports = null;
            return;
        }else{
            if(reports != null){
                if(animalType == undefined){
                    animalType = selectedAnimalType;
                }
                reports.push({id, location, animalClass, selectedAnimalType, currentStatus, reportDate, description, photo, reporter, contact});
            }
        }
    });

    if(reports == null){
        alert("Can't merge reports with different animal types.");
    }else if(reports.length > 0){
        mergeReports(reports);
        loadReports();
    }
});


function addCheckboxEvent(){
    let checkedBoxes = document.getElementsByClassName("merge");
    
    for (var i = 0; i < checkedBoxes.length; i++) {
        let chk = checkedBoxes[i];

        chk.addEventListener('change', function(e) {
            let checkedBoxes = document.querySelectorAll('input[name=merge]:checked');
            if(checkedBoxes.length > 1){
                mergeBtn.disabled = false;
            }
            else{
                mergeBtn.disabled = true;
            }
        });
    }
}


search.addEventListener('submit', (e) =>{
    e.preventDefault();
    loadReports(searchBar.value);
});
