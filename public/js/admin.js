import { listeUfficiEdAmm } from "../../utils/listeAmministrazioniEdUffici.js";
import { APIcreateUser, APIupdateUser, APIdeleteUser, APIgetUserByCodiceFiscale } from "../../utils/apiUtils.js";
import { UserModel } from "../../model/userModel.js";

let livelloUser='0';
document.addEventListener('DOMContentLoaded', async function() {
    
    popolaSelect("selectUfficio",listeUfficiEdAmm.uffici,callbackSelect);
    popolaSelect("selectAmministrazione",listeUfficiEdAmm.amministrazioni,callbackSelect);
    popolaSelect("selectLivello",listeUfficiEdAmm.livelliUser,callbackSelectlivello);
    btnElimina();
    addNewUser()
})


async function popolaSelect(idSelectElement, opzioniArray, onChangeFunction) {
    var select = document.getElementById(idSelectElement);
    // Rimuovi le opzioni esistenti
    select.innerHTML = "";
    // Aggiungi le opzioni dall'array alla select
    opzioniArray.forEach(function(opzione, index) {
        var option = document.createElement("option");
        option.text = opzione;
        option.value = opzione;
  
        // Se è il primo elemento dell'array, selezionalo di default
        if (index === 0) {
            option.selected = true;
        }
  
        select.appendChild(option);
    });
     // Aggiungi un gestore di eventi per l'evento "change"
     select.addEventListener("change", function() {
      var selectedValue = this.value; // Ottieni il valore selezionato
      // Chiama la funzione onChangeFunction passando il valore selezionato come parametro
      onChangeFunction(selectedValue);
    });
  }
async function callbackSelect(valore){
  console.log(valore)
}
async function callbackSelectlivello(valore){
    if(valore==='1'||valore==='2'){
        alert("ATTEZIONE: SI STA INSERENDO UN UTENTE CON AUTORIZZAZIONI DA AMMINISTRATORE")
    }
    livelloUser=valore
  console.log(valore)
}
 async function btnElimina(){
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    document.getElementById('eliminaUtente').addEventListener('click', async function() {
        const form = document.getElementById('userForm');
        form.querySelectorAll('input, select').forEach(function(element) {
            if (element.id !== 'codiceFiscale') {
                console.log('*********',element.id)
                element.removeAttribute('required');
            }
        });
        // Mostra un alert di conferma
        const codiceFiscale = document.getElementById('codiceFiscale').value;
        if(codiceFiscale===""){
            alert("inserire il codice fiscale dell'utente da cancellare")
        }
        else{
            if (confirm("Sei sicuro di voler eliminare questo utente?")) {
                // Rimuovi l'attributo required da tutti i campi tranne codiceFiscale
                form.querySelectorAll('input, select').forEach(async function(element) {
                    if (element.id !== 'codiceFiscale') {
                        element.removeAttribute('required');
                    }
                });
                // Cambia l'azione del form per eliminare l'utente
                const respGetUserByCod = await APIgetUserByCodiceFiscale(hostApi,codiceFiscale)
                //console.log(respGetUserByCod._id)
                const respDeleteUser=await APIdeleteUser(hostApi,respGetUserByCod._id)
                //console.log(respDeleteUser);
                alert (`utente  ${codiceFiscale} cancellato con successo`)
                location.reload();

                //form.submit();
            } else {
                // Annulla l'operazione di eliminazione
                alert("Operazione di eliminazione annullata.");
            }
        }
    })
  }
async function addNewUser(){
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    document.getElementById('aggiungiUtente').addEventListener('click', async function() {
        
        const nome =await document.getElementById('nome').value;
        const cognome =await document.getElementById('cognome').value;
        const codiceFiscale =await document.getElementById('codiceFiscale').value;
        const amministrazione =await document.getElementById('selectAmministrazione').value;
        const qualifica  =await document.getElementById('qualifica').value;
        const ufficio  =await document.getElementById('selectUfficio').value;
        const livello  =await document.getElementById('selectLivello').value;
        console.log(nome,cognome,codiceFiscale,amministrazione,qualifica,ufficio,livello)
            let newUser= new UserModel({});
            newUser.setAnagrafica({
                "nome":nome,
                "cognome":cognome,
                "codiceFiscale":codiceFiscale
            })
            newUser.setAmministrazione(amministrazione);
            newUser.setQualifica(qualifica);
            newUser.setUfficio(ufficio);
            newUser.setLivelloUser(livello);
            newUser.setAssenze({})
            console.log(newUser.anagrafica)
         
       
        if(livelloUser==='1'||livelloUser==='2'){
            confirm(`SI STA PER INSERIRE UN UTENTE CON AUTORIZZAZIONI DA AMMINISTRATORE DI LIVELLO: ${livelloUser} `)
        }
        let anagrafica={
            "nome":nome,
            "cognome":cognome,
            "codiceFiscale":codiceFiscale
        }
        let respCreateUser= await APIcreateUser(hostApi,newUser)
        alert("utente inserito correttamente")
        
       
    }

)}

  