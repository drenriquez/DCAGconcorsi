import { listaGiustificativi } from "../../utils/giustificativiAssenze.js";
import { ricercaPerCognome, ricercaPerUsername } from "../../utils/serviziWauc.js";
import { APIgetUserByCodiceFiscale, APIgetAbsencesSummaryByCodiceFiscale,APIwaucCercaPerCognome } from "../../utils/apiUtils.js";

document.addEventListener('DOMContentLoaded', async function() {
    // const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    // let codiceFiscale="NTRNRC80S15G273K"
    // let startDate="2024-07-01"
    // let endDate="2024-08-25"
    // let test = await APIgetAbsencesSummaryByCodiceFiscale(hostApi, codiceFiscale, startDate, endDate)
   
    
    showTable()
})
async function showTable(){
    document.getElementById('createTable').addEventListener('click', async function() {

        const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
        let cognome=document.getElementById("cognome").value 
        let resultWaucService = await APIwaucCercaPerCognome(hostApi,cognome)
        console.log(resultWaucService)
        /updateTable(resultWaucService)
      
    

       
    })
}
async function updateTable(listaDip){
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
    listaDip.forEach((elemento, indice) => {
        // Crea una nuova riga
        const row = document.createElement('tr');

        // Crea la cella per l'indice
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent =elemento.codiceFiscale //indice + 1; // 1-based index
        row.appendChild(th);

        // Crea la cella per il codice giustificativo
        const tdCognome = document.createElement('td');
        tdCognome.textContent = elemento.cognome;
        row.appendChild(tdCognome);

        // Crea la cella per il totale
        const tdNome = document.createElement('td');
        tdNome.textContent = elemento.nome;
        row.appendChild(tdNome);

        const tdAccount = document.createElement('td');
        tdAccount.textContent = elemento.accountDipvvf;
        row.appendChild(tdAccount);

        const tdEmail = document.createElement('td');
        tdEmail.textContent = elemento.emailVigilfuoco;
        row.appendChild(tdEmail);

        const tdQualifica = document.createElement('td');
        tdQualifica.textContent = elemento["qualifica"]["descrizione"];
        row.appendChild(tdQualifica);

        const tdSede = document.createElement('td');
        tdSede.textContent = elemento["sede"]["descrizione"];
        row.appendChild(tdSede);

        // Aggiungi la riga alla tabella
        tbody.appendChild(row);
    });
}
