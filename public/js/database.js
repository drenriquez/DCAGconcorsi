import { APIgetAllConcorsi } from "../../utils/apiUtils.js";

document.addEventListener('DOMContentLoaded', async function() {
   getAllConcorsi()
})

async function getAllConcorsi(){
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    const resp=await APIgetAllConcorsi(hostApi) 
    var concorsi= resp.filter(function(valore, indice,vett){
        return (valore !== "users") && (valore !== "sessions");
        });
    console.log("test-database.ejs", concorsi)
}