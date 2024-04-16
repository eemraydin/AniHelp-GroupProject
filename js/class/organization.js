import { db } from "../common.js";
import { 
    collection,
    getDocs,
    query, where, limit, getDoc, doc } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";
export {Organization, getAllOrganizations, getOrganization, getOrganizationById}

class Organization{
    constructor(name, animal_type, location, address, phone, email, organizationUid){
        this.name=name;
        this.animal_type=animal_type;
        this.location=location;
        this.address=address;
        this.phone=phone;
        this.email=email;
        this.organizationUid=organizationUid;
    }
}

async function getAllOrganizations(){
    const q = query(collection(db, "organization"));

    try{
        return await getDocs(q);

    }catch(error){
        console.log(error);
        return null;
    }
}

async function getOrganization(uid){
    let orgId = null;
    const q = query(collection(db, "organization"), where("uid", "==", uid), limit(1));
    return await getDocs(q).then((res) => {
        res.forEach(doc => {
            orgId = doc.id;
        });
        return orgId;
    }).catch(err => {
        console.log(err);
    })
}


async function getOrganizationById(orgId){    
    if(orgId == undefined || orgId == null){
        console.log("empty orgId")
        return null;
    }

    return await getDoc(doc(db, "organization", orgId))
        .then((docSnap) => {
            if (docSnap.exists()) {
                let d = docSnap.data();
                // let report = new Report();
                // // console.log(d);
                // report.id = d.id;
                // report.animalClass = d.animalClass;
                // report.animalType = d.animalType;
                // report.description=d.description;
                // report.condition=d.condition;
                // report.photo = d.photo;
                // report.location=d.location;
                // report.name=d.name;
                // report.phone=d.phone;
                // report.date=d.date;
                // report.realAddress = d.realAddress
                // report.status=d.status;
      
                // //report.statusList = getStatusList(d.condition, d.status);
                // return report;
                return d;
            } else{
                console.log("reportId not found")
                return null;
            }
        });
}

