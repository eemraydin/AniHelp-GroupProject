import { db, storage } from "../common.js";
import { collection,
    doc, 
    getDoc,
    updateDoc,
    getDocs,
    addDoc, 
    where, 
    query,
    orderBy,
    arrayUnion,
    deleteField,
    getCountFromServer,
    setDoc
 } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";
import { getStorage, 
        ref, 
        uploadString, 
        getDownloadURL, 
        listAll} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-storage.js";
export {Report, getAllReports, getReportById, getReportsByUser, addReport, updateReportStatus, mergeReports,
        getStatus, getStatusList, reportStatusList, animalConditionList, getReportsByOrganization,updateReportUser}

class Report{
    constructor(animalClass ,animalType, description, condition, photo, location, date, name, phone, realAddress, status, orgID, uid){
        this.animalClass=animalClass;
        this.animalType=animalType;
        this.description=description;
        this.condition=condition;
        this.photo=photo;
        this.location=location;
        this.date=date;
        this.name=name;
        this.phone=phone;
        this.realAddress=realAddress;
        this.orgID=orgID;
        this.status=status;
        this.user=uid;
    }
    
    toString(){ //print object
        return `<p>Animal Class: ${this.animalClass} <br> 
        <p>Animal type: ${this.animalType} <br>
        Description: ${this.description}<br>
        Condition: ${this.condition}<br>
        Photo: ${this.photo}<br>
        Location: ${this.location}</p>
        Date: ${this.date}<br>
        Name: ${this.name}<br>
        Phone: ${this.phone}<br>
        Address: ${this.realAddress}<br>
        Status: ${this.status}<br>
        Assiged Organization ID: ${this.orgID}<br>
        Reporter ID: ${this.user}<br>
        `;
    }   
}


function replacer(key, value) {
    // Filter out photo property to disable saving of base64 on database
    if (key === "photo") {
        return [];
    }
    return value;
}

async function storeImage(id, photo) {
    const promises = [];

    for (let i = 0; i < photo.length; i++) {
        const storageRef = ref(storage, `images/${id}/${i}.png`);
        promises.push(
            uploadString(storageRef, photo[i], 'data_url')
                .then(uploadResult => getDownloadURL(uploadResult.ref))
        );
    }

    const photos = await Promise.all(promises);

    try {
        await updateDoc(doc(db, "reports", id), {
            photo: photos
        });
    } catch (error) {
        console.log(error);
    }
}


async function generateId(){
    const coll = collection(db, "reports");
    const snapshot = await getCountFromServer(coll);
    return (snapshot.data().count + 1).toString().padStart(5, '0');
}


async function addReport(report){
    if(Object.values(report).every(element => element === undefined)){
        console.log("empty report");
        return;
    }
    const newReport = JSON.parse(JSON.stringify(report, replacer));
    let id = await generateId();
    await setDoc(doc(db, "reports", id),newReport);
    storeImage(id, report.photo);

    return id;
}

async function updateReportUser(reportId, uid) {
    if (reportId === undefined || uid === undefined) {
        throw "Invalid reportId or uid";
    }

    try {
        const reportRef = doc(db, "reports", reportId);

        if (uid !== undefined) {
            await updateDoc(reportRef, {
                user: uid
            });

            console.log(`Report ${reportId} updated with user ID: ${uid}`);
        }
    } catch (error) {
        console.error("Error updating report:", error);
    }
}


async function updateReportStatus(reportId, newstatus, currentstatus){
    if(reportId == undefined || newstatus == undefined){
        throw "Invalid reportId or status";
    }
    if(newstatus == currentstatus){
        throw "No Update"
    }
    const updatedStatus = getStatus(Number(newstatus));
    if(updatedStatus != undefined){
        updateDoc(doc(db, "reports", reportId), {
            status: updatedStatus.text
        })
    }
}

async function mergeReports(reports){
    if(reports == undefined){
        throw "Invalid reports";
    }
    
    const status = getStatus(Math.max(...reports.map(r => r.currentStatus))).text; //get higher status
    const parentReport = reports.reduce((a, b) => new Date(a.date) > new Date(b.date) ? b : a);//get latest report
    reports = reports.filter(a => a !== parentReport); //remove parent report from array
    
    let newChildReports = reports.map((r) => r);
    let promises = [];
    
    for(const item of reports){ //get childreports' childreports, if exists. These will be transferred to the new parent report
        promises.push(getReportById(item.id).then(report =>{
            if(report.childReports != undefined){
                newChildReports.push(...report.childReports);
            }
        }));
    }

    Promise.all(promises).then(() => {
        updateDoc(doc(db, "reports", parentReport.id), {    //add childreports to the parent report. update status
            childReports: arrayUnion(...newChildReports),
            status: status
        });

        newChildReports.forEach(item => {                   //update childreports status, parent reportid, and delete childreports
            updateDoc(doc(db, "reports", item.id), {
                childReports: deleteField(),
                parent: parentReport.id,
                status: status
            })
        });
    });
}

async function getReportById(reportId){    
    if(reportId == undefined || reportId == null){
        console.log("empty reportId")
        return null;
    }

    return await getDoc(doc(db, "reports", reportId))
        .then((docSnap) => {
            if (docSnap.exists()) {
                let d = docSnap.data();
                let report = new Report();
                // console.log(d);
                report.id = docSnap.id;
                report.animalClass = d.animalClass;
                report.animalType = d.animalType;
                report.description=d.description;
                report.condition=d.condition;
                report.photo = d.photo;
                report.location=d.location;
                report.name=d.name;
                report.phone=d.phone;
                report.date=d.date;
                report.realAddress = d.realAddress
                report.status=d.status;
                report.orgID=d.orgID;
                report.childReports=d.childReports;
      
                //report.statusList = getStatusList(d.condition, d.status);
                return report;
            } else{
                console.log("reportId not found")
                return null;
            }
        });
}

//-------------fetch all reports (FOR TESTING PURPOSES)
async function getAllReports(){
    const q = query(collection(db, "reports"), orderBy("date", "desc"));
    return await getDocs(q);
}

//-------------fetch all user reports (use email address) //auth.currentUser.uid
async function getReportsByUser(user){
    const q = query(collection(db, "reports"), where("user", "==", user), orderBy("date", "desc"));
    return await getDocs(q);
}

//-------------fetch all reported incidents to organization
async function getReportsByOrganization(orgId){
    
    const q = query(collection(db, "reports"), where("orgID", "==", orgId), orderBy("date", "desc"));
    return await getDocs(q);
}

const getStatusList = function(cond, status){
    switch(status.toLowerCase()){
        case reportStatusList.Open.text.toLowerCase(): return [reportStatusList.InProgress];
        case reportStatusList.InProgress.text.toLowerCase(): 
            switch(cond.toLowerCase()){
                case animalConditionList.Injured.toLowerCase():
                    return [
                        reportStatusList.Saved,
                        reportStatusList.CantFind,
                        reportStatusList.Deceased
                    ];
                case animalConditionList.Dead.toLowerCase():
                    return [
                        reportStatusList.CantFind,
                        reportStatusList.PickedUp
                    ]
                default: return [
                    reportStatusList.CantFind,
                    reportStatusList.PickedUp
                ]
            }
        default: return [reportStatusList.InProgress];
    }
}

const getStatus = function(value){
    return searchObj(reportStatusList, value);
}

const searchObj = function(obj, query) {
    let result;
      for (var key in obj) {
          var value = obj[key];
  
          if (typeof value === 'object') {
              result = searchObj(value, query);
                  if (result) {
                      return result;
                  }
          }
          else if (value === query) {
              return obj;
          }
  
      }
  }

const reportStatusList =
{
    Open: {text:'Open',id: 0},
    InProgress: {text: 'In Progress',id:1},
    Saved: {text: 'Saved', id: 2},
    PickedUp: {text: 'Picked Up', id: 3},
    CantFind: {text: 'Can\'t Find', id: 4},
    Deceased: {text: 'Deceased', id: 5}
}

const animalConditionList =
{
    Alive: 'Alive',
    Injured: 'Injured',
    Dead: 'Dead'
}