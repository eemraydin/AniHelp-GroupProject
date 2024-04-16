import { app } from '../js/common.js'
import { getFirestore, 
    collection,
    doc, 
    setDoc,
    getDoc,
    getDocs,
    addDoc, 
    where, 
    query, 
    onSnapshot } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";

const db = getFirestore(app);

async function getAdmin(uid){
    const ref = doc(db, "admin", uid);
    return await getDoc(ref)
        .then((docSnap) => {
            if (docSnap.exists()) {
                return true;
            } 
            else{
                return false;
            }
        }).catch((error) => {
            //To be used later
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, ":", errorMessage);
        });
}

async function addReport(report){
    console.log("database",report.toString());
    const reports = collection(db, 'reports');
    const newReport = JSON.parse(JSON.stringify(report));
    const newDocRef = await addDoc(reports, newReport);
    // console.log('New document added with ID:', newDocRef.id);
    //get doc id
    //save images on folder <doc id>/incremental-filename.jpg
    //update report photo location url
}

//---------------Get list of reports
async function getUserReports(user){
        const q = query(collection(db, "reports"), where("user", "==", user));
        return await getDocs(q);
}

async function getReports(user){
    const q = query(collection(db, "reports"));
    return await getDocs(q);
}

//--------------Get list of reports assigned to admin
async function getAdminReports(admin){
    const q = query(collection(db, "reports"), where("admin_id", "==", admin));
    return await getDocs(q);
}

// Firestore data converter
// const reportConverter = {
//     toFirestore: (report) => {
//         return {
//             animalType: report.animalType,
//             description: report.description,
//             date: report.date,
//             time: report.time,
//             user: report.user,
//             status: report.status,
//             photo: report.photo,
//             location: report.location
//             };
//     },
//     fromFirestore: (snapshot, options) => {
//         const data = snapshot.data(options);
//         return new Report(data.animalType, 
//                         data.description, 
//                         data.date, 
//                         data.time,
//                         data.user,
//                         data.status,
//                         data.photo,
//                         data.location);
//     }
// };

export {getAdmin, addReport, getReports};
