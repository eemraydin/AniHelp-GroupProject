/*================= TO TEST UI ======================== 
    1. Comment out the following lines:

        1.a. The code below redirects the user to index page if a user is not logged in

         if(!user){
            window.location = "../";
        }


        1.b. The code below fetches the reports based on the user that is logged in.
            If no report was created by the user, this will return null.
    
             getReportsByUser(loggedUser.uid)


    2. Uncomment this line in order to fetch all reports:
        //getAllReports()

=================== TO TEST UI ========================*/

/*=================== TO TEST ACTUAL DATA ========================
    
To view all information on this page, it's required that
    1. You are logged in
    2. You have created a report

=================== TO TEST ACTUAL DATA  ========================*/

import { getAllReports, getReportsByUser} from './class/report.js';
import { getUserDetails  } from './authentication.js';


const content = document.querySelector('.myReportContent');
const itemsPerPage = 6;
let loggedUser;

getUserDetails().then(user => {
    if(!user){
       window.location = "../";
    }
    loggedUser = user;

    var myReportsTable = document.getElementById("myReportsTable");

    let myReportItem = []; // array of rows
    let myReportRows = [];

    // getAllReports() 
    getReportsByUser(loggedUser.uid)
    .then((reports) => {

        let currentPage = 0;
        reports.forEach(doc => {
            
            // Populate table:
            let data = doc.data();
            
            myReportItem.push(data);
            let row = myReportsTable.insertRow();
            row.setAttribute("id", doc.id)

            let cell1 = row.insertCell(0); 
            let cell2 = row.insertCell(1); 
            let cell3 = row.insertCell(2); 
            let cell4 = row.insertCell(3); 
            let cell5 = row.insertCell(4); 
            let cell6 = row.insertCell(5); 
            let cell7 = row.insertCell(6); 
            // let cell8 = row.insertCell(7); 
            // let cell9 = row.insertCell(8);
            
            let reportPhoto = document.createElement("img")
            reportPhoto.setAttribute("src", data.photo);
           
            let reportDate = new Date(data.date);
            
            cell1.append(reportPhoto) ;
            cell1.setAttribute('class', "ah-table-column ah-col-photo");

            cell2.innerHTML = data.animalType;
            cell2.setAttribute('class', "ah-table-column ah-col-animal-type");

            cell3.innerHTML = data.realAddress
            cell3.setAttribute('class', "ah-table-column ah-col-address");

            cell4.innerHTML = `${reportDate.toLocaleDateString()} ${reportDate.toLocaleTimeString()}`;
            cell4.setAttribute('class', "ah-table-column ah-col-date-and-time");

            cell5.innerHTML = data.description;
            cell5.setAttribute('class', "ah-table-column ah-col-description");

            cell6.innerHTML = data.status;

            let statusClass = "";
            switch (data.status) {
                case "Open":
                    statusClass = "status-open";
                    break;
                case "Picked Up":
                    statusClass = "status-picked-up";
                    break;
                case "In Progress":
                    statusClass = "status-in-progress";
                    break;
                case "Saved":
                    statusClass = "status-saved";
                    break;
                case `Can't Find`:
                    statusClass = "status-cant-find";
                    break;
                case "Deceased":
                    statusClass = "deceased";
                    break
                default:
                    break;
            }

            cell6.setAttribute('class', `ah-table-column ah-col-status ${statusClass}`);

            cell7.innerHTML = `<label for="viewBtn"><button type="button" id="viewBtn-${doc.id}"><a href="./detailspage.html?id=${doc.id}">View Details</a></button></label>`;
            cell7.setAttribute('class', "ah-table-column ah-col-buttons");

            // cell1.innerHTML = doc.id;

            // cell5.innerHTML = data.condition;
            myReportRows.push(row);

        });
        createPageButtons(currentPage, myReportItem, myReportRows);
        showPage(currentPage, myReportRows);


    });

});

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
    const totalPages = Math.ceil(items.length / itemsPerPage); 
    const paginationContainer = document.createElement('div'); // creates a div to contain the buttons
    const paginationDiv = myReportOutputArea.appendChild(paginationContainer); 
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

