import { isNonLavorativo } from "../../utils/giorniNonLavorativi.js";
import { getDayAbbreviation } from "../../utils/dayOfWeak.js";
import { listaGiustificativi } from "../../utils/giustificativiAssenze.js";
import { listeUfficiEdAmm } from "../../utils/listeAmministrazioniEdUffici.js";
import { APIgetAllUsersInOrdineCognome, APIaddAbsenceById, APIdeleteAbsenceById, APIgetUsersByUfficio } from "../../utils/apiUtils.js";
import { UserModel } from "../../model/userModel.js";

let usersTable=""//*******************test */
document.addEventListener('DOMContentLoaded', async function() {
  const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
  usersTable=await APIgetAllUsersInOrdineCognome(hostApi);//*******************test */
  document.getElementById('previousMonth').addEventListener('click', previousMonth);
  document.getElementById('nextMonth').addEventListener('click', nextMonth);
  document.getElementById('monthSelector').addEventListener('change', updateTableHeaders());
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  document.getElementById('monthSelector').value = formattedDate;
  popolaSelect("selectUfficio",listeUfficiEdAmm.uffici,callbackSelectUfficio)
  updateTableHeaders();
});

async function updateTableHeaders(tabella) {
  if(!tabella){
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    usersTable=await APIgetAllUsersInOrdineCognome(hostApi);}
  else{
    usersTable=tabella;
  }
  //const usersTable = JSON.parse(usersTableString);
  const userCodiceFiscale=document.querySelector('script[type="module"]').getAttribute('userCodFisc');
  const livelloUser=document.querySelector('script[type="module"]').getAttribute('livelloUser');
  const tableHeader = document.getElementById('tableHeader');
 // const rowsHeader = document.getElementById("rowsHeader");
  const tableBody = document.getElementById("tableBody");
  if (!tableHeader) return;

  const monthSelector = document.getElementById('monthSelector');
  const selectedDate = new Date(monthSelector.value);
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  tableHeader.innerHTML = '<tr><th></th>'; // Resetta le intestazioni della tabella
  tableBody.innerHTML = '<tbody id="tableBody"></tbody>'// Resetta le intestazioni delle righe della tabella
  // Aggiunge le intestazioni per ogni giorno del mese
  for (let i = 1; i <= daysInMonth; i++) {
        const dayOfWeek = changeDay(selectedDate, i);
        //console.log("EEEEEEEEEEEEE",dayOfWeek)
        const giorno = getDayAbbreviation(dayOfWeek.getDay());
        const classOfHeadDay = isNonLavorativo(dayOfWeek) ? "head-non-lavorativo" : "";
        const currentClassDay = isCurrentDay(dayOfWeek) ?  "currentDay" : "";
        tableHeader.innerHTML += `<th class="head-day ${classOfHeadDay} ${currentClassDay}">${giorno}<br>${i}</th>`;
    }
        
  // Crea le righe per ogni dipendente
  usersTable.forEach((dipendente, index) => {
      let persona= new UserModel(dipendente)
      let isUserLogged = persona.getCodiceFiscale()===userCodiceFiscale? true:false;
      const cognomeNome = persona.getFullName();
      let classUserLog=persona.getCodiceFiscale().toUpperCase()===userCodiceFiscale.toUpperCase()? "utenteLoggato": "nonLoggato";
      let classUserLogNotWork=persona.getCodiceFiscale().toUpperCase()===userCodiceFiscale.toUpperCase()? "utenteLoggatoNonLavorativo": "nonLoggato";
 // for(const[index,headRow ]of headRows.entries()){//entries()  restituisce un nuovo oggetto iterabile, coppie chiave-valore per ogni elemento 
      let newTr=document.createElement("tr");
      newTr.textContent = cognomeNome.toUpperCase() ;
      tableBody.appendChild(newTr)
      let classTr="none";
      let classTdnonLAv="";
      if (index % 2 === 0) {
        classTr="trDispari"; // Aggiungi la classe CSS
        classTdnonLAv="non-lavorativo-dispari";
      }
      newTr.classList.add(classTr,classUserLog);
      //newTr.classList.add(classUserLog); 
      for (let i = 1; i <= daysInMonth; i++) {
          let classOfDay="";
          let dayOfWeek2=changeDay(selectedDate, i);
          //console.log("EEEEEEEEEEEEE",dayOfWeek2)
          if(isNonLavorativo(dayOfWeek2)===1){ 
            const currentClassDay2 = isCurrentDay(dayOfWeek2) ?  "currentDay" : "";         
            newTr.innerHTML += `
            <td class="non-lavorativo ${classTdnonLAv} ${currentClassDay2} ${classUserLogNotWork}">
            </td>`;
          }
          else{

            let result =controlDayForUser(listaGiustificativi,isUserLogged,livelloUser,dayOfWeek2,persona.getAssenze());
           // if(isUserLogged){console.log("++++++++++++++++++++++++++++++++",result)}
            //console.log("++++++++++++++++++++++++++++++++",result)
            classOfDay="selezionabile "
            let newTd=document.createElement("td");
            newTd.textContent=result
            newTd.classList.add(classTr, "tdLavorativo",classUserLog);
            if(isCurrentDay(dayOfWeek2)){
              newTd.classList.add("currentDay",classUserLog)
            };
            newTr.appendChild(newTd);
           
            if(livelloUser==="2"){
              // const dataDay=String(selectedDate.getDay()).padStart(2,'0')  // Formatta il giorno con due cifre
              // const dataMonth = selectedDate.getMonth();
              // const dataYear = selectedDate.getFullYear();
          
              console.log("+++++++++++ livello ",livelloUser)
              const select_Element = createSelectElement(listaGiustificativi, classOfDay,persona.getId(),dayOfWeek2);
              select_Element.classList.add(classUserLog)
              newTd.appendChild(select_Element);
            }
            else{
              if((dayOfWeek2>=(new Date())||isCurrentDay(dayOfWeek2))&&(persona.getCodiceFiscale().toUpperCase()===userCodiceFiscale.toUpperCase())){
                const select_Element = createSelectElement(listaGiustificativi, classOfDay,persona.getId(),dayOfWeek2);
                select_Element.classList.add(classUserLog)
                newTd.appendChild(select_Element);
              }
            }
        //    newTd.textContent ="tes
            // newTr.innerHTML += `
            // <td class="${classTr} tdLavorativo"></td>`;
          }
      }
  });

  // Aggiungi gestori di eventi onchange ai nuovi elementi select
  const selectElements = document.querySelectorAll('.select-option');
    selectElements.forEach(selectElement => {
        selectElement.addEventListener('change', function() {
            //console.log(this.dataset.user)
            updateCellValue(this,this.classList,this.dataset.user,this.dataset.day);
        });
    });
}

function updateCellValue(selectElement,classOfDay,userId,day) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
    // Recupera il valore associato dall'attributo 'data-value'
  const actualValue = selectedOption.getAttribute('data-value');
  const cell = selectElement.parentNode;
  cell.textContent = actualValue;
  //console.log("actualvalue -->",actualValue)
  const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');

  //console.log(`actualValue (type: ${typeof actualValue}):`, actualValue);

if (actualValue.trim() === "") { //trim() rimuove eventuali spazi bianchi
  //console.log("actualvalue is empty");
  APIdeleteAbsenceById(hostApi,userId,day)//.then((res)=>{console.log(res)})
} else {
  //console.log("actualvalue is not empty:", actualValue);
  APIaddAbsenceById(hostApi, userId, day, actualValue)//.then((res)=>{console.log(res)});
}
  const selectElementNew = createSelectElement(listaGiustificativi,classOfDay,userId,day);
  cell.appendChild(selectElementNew);
  //console.log("***********************",actualValue)
  selectElementNew.addEventListener('change', function() {
    //console.log("***********************",actualValue)
      updateCellValue(this,classOfDay,userId,day);
  });
}
function previousMonth() {
  let monthSelector = document.getElementById('monthSelector');
  let date = new Date(monthSelector.value);
  date.setMonth(date.getMonth() - 1);
  monthSelector.value = formatDate(date);
  updateTableHeaders();
  ripristinaValoreDefaultSelect()
}

function nextMonth() {
  let monthSelector = document.getElementById('monthSelector');
  let date = new Date(monthSelector.value);
  date.setMonth(date.getMonth() + 1);
  monthSelector.value = formatDate(date);
  updateTableHeaders();
  ripristinaValoreDefaultSelect()
}

function formatDate(date) {
  let month = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  return date.getFullYear() + '-' + month;
}

function changeDay(date, newDay) {
  let newDate = new Date(date.getTime());
  newDate.setDate(newDay);
  return newDate;
}
function isCurrentDay(day){
  const currentDate = new Date();
  let currentDay= currentDate.getDate();
  const currentMonth = currentDate.getMonth() ;
  const currentYear = currentDate.getFullYear();
  const isCurrent = (day.getDate() === currentDay && 
                         day.getMonth() === currentMonth && 
                         day.getFullYear() === currentYear) ? 
                         true : false;
  return isCurrent                      
}
// Funzione per creare un elemento <select> con opzioni
function createSelectElement(listaGiustif, classOfDay, idUser, day) {
  const select = document.createElement('select');
  select.setAttribute('data-user', idUser)
  select.setAttribute('data-day',day)
  select.className = `form-control custom-select select-option ${classOfDay}`;
  const defaultOption = document.createElement('option');
  defaultOption.selected = true;
  defaultOption.disabled = true;
  defaultOption.hidden = true;
  select.appendChild(defaultOption);
  const optionEntry = document.createElement('option');
  optionEntry.textContent = "";
  optionEntry.setAttribute('data-value','');
  select.appendChild(optionEntry);

  Object.entries(listaGiustif).forEach(([key, value]) => {
    const option = document.createElement('option');
   
    let descrizione=key+" "+value[0];
    option.setAttribute('data-value',key);
    option.textContent = descrizione;
    select.appendChild(option);
  });
  return select;
}
function controlDayForUser(listaGiustificativi,isUserLogged,level,day, assenze) {
  let result = "";
  let dayDate = new Date(day);
  let year = dayDate.getFullYear();
  let month = ("0" + (dayDate.getMonth() + 1)).slice(-2); // Aggiunge un padding zero per assicurarsi che il mese sia sempre a due cifre
  let date = ("0" + dayDate.getDate()).slice(-2); // Aggiunge un padding zero per assicurarsi che il giorno sia sempre a due cifre
  if (assenze[year] && assenze[year][month] && assenze[year][month][date]) {
      result = assenze[year][month][date];
  } 
  if(isUserLogged||level>0 || result===""){
    return result
  }
  else {
    return listaGiustificativi[result][1]
    
  }
}
// Funzione per popolare la select con le opzioni dall'array
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
async function callbackSelectUfficio(valore){
  if(valore==="Tutti"){
    updateTableHeaders()
  }
  else{
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    console.log('333333333333333333333333',valore)
    APIgetUsersByUfficio(hostApi,valore).then((res)=>{ updateTableHeaders(res)})
  }
}
// Funzione per ripristinare il valore predefinito del select
function ripristinaValoreDefaultSelect() {
  // Trova l'elemento select
  var select = document.getElementById("selectUfficio");
  // Imposta il valore selezionato al valore predefinito desiderato
  select.value = "Tutti"; // Imposta il valore predefinito vuoto
}