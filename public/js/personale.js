import { listaGiustificativi } from "../../utils/giustificativiAssenze.js";
import { APIgetUserByCodiceFiscale, APIgetAbsencesSummaryByCodiceFiscale } from "../../utils/apiUtils.js";

document.addEventListener('DOMContentLoaded', async function() {
    // const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    // let codiceFiscale="NTRNRC80S15G273K"
    // let startDate="2024-07-01"
    // let endDate="2024-08-25"
    // let test = await APIgetAbsencesSummaryByCodiceFiscale(hostApi, codiceFiscale, startDate, endDate)
    // console.log(test)
    //updateTable()
    showTable()
})
async function showTable(){
    document.getElementById('createTable').addEventListener('click', async function() {
        const startDay=new Date(document.getElementById("startDay").value);
        const endDay=new Date(document.getElementById("endDay").value);
        console.log(startDay,endDay);
         // Confronta le date
    if (endDay < startDay) {
        alert("ATTEZIONE: La data di fine è precedente alla data di inizio")
   
    } else {
        let userCodiceFiscale=""
        
        
        if (document.getElementById("codiceFiscale")){
            userCodiceFiscale=document.getElementById("codiceFiscale").value;
           
        }
        else{ userCodiceFiscale=document.querySelector('script[type="module"]').getAttribute('userCodFisc');}

        const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
         
        let datiAssenze = await APIgetAbsencesSummaryByCodiceFiscale(hostApi, userCodiceFiscale, startDay, endDay)
        updateTable(datiAssenze)
      
    }

       
    })
}
async function updateTable(datiAssenze){
    // Simulazione dell'array di dati ottenuti
    // const datiAssenze = [
    //     { _id: 'CS42', codiceGiustificativo: 'CS42', totale: 3 },
    //     { _id: 'MR', codiceGiustificativo: 'MR', totale: 1 },
    //     { _id: 'Ap', codiceGiustificativo: 'Ap', totale: 1 },
    //     { _id: 'L.104', codiceGiustificativo: 'L.104', totale: 1 },
    //     { _id: 'M', codiceGiustificativo: 'M', totale: 1 },
    //     { _id: 'CO', codiceGiustificativo: 'CO', totale: 1 },
    //     { _id: 'BO', codiceGiustificativo: 'BO', totale: 2 }
    // ];

    // Seleziona il corpo della tabella
    const tbody = document.getElementById('tabellaRiepilogativa').getElementsByTagName('tbody')[0];

    // Pulisci il contenuto esistente
    tbody.innerHTML = '';

    // Popola la tabella con i dati ottenuti
    datiAssenze.forEach((elemento, indice) => {
        // Crea una nuova riga
        const row = document.createElement('tr');

        // Crea la cella per l'indice
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent =elemento.codiceGiustificativo //indice + 1; // 1-based index
        row.appendChild(th);

        // Crea la cella per il codice giustificativo
        const tdCodice = document.createElement('td');
        tdCodice.textContent = listaGiustificativi[elemento.codiceGiustificativo][0];
        row.appendChild(tdCodice);

        // Crea la cella per il totale
        const tdTotale = document.createElement('td');
        tdTotale.textContent = elemento.totale;
        row.appendChild(tdTotale);

        // Aggiungi la riga alla tabella
        tbody.appendChild(row);
    });
}
// Funzione per confrontare due date
function confrontaDate(startDateStr, endDateStr) {
    // Crea oggetti Date a partire dalle stringhe
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Confronta le date
    if (endDate < startDate) {
        console.log('La data di fine è precedente alla data di inizio.');
        return false;
    } else {
        console.log('La data di fine è uguale o successiva alla data di inizio.');
        return true;
    }
}