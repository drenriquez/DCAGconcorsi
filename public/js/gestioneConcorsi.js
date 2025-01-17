import { apiGraphQLgetAllUsers } from "../../utils/apiGraphql.js";

document.addEventListener('DOMContentLoaded', async function() {
   
    // Ottieni gli elementi del DOM
    // document.getElementById('exportBtn').addEventListener('click', exportTableToExcel);
    const hostApi = document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
    document.querySelector('#eseguiBtn').addEventListener('click', function() {
        //let campiSelezionati=getSelectedTest()
      console.log("-----riga 10: ",generateStructuredString(campiRestituiti));
      let campiPerQuery = campiRestituiti.length === 0 ? ["cognome", "nome","codiceFiscale","dataNascita",`   `] : campiRestituiti;
        avvioFunction( `
            query {
                getCandidatiByCriteria(
                    concorso: "${concorsoId}",
                    riserve: ${JSON.stringify(riserve)},
                    titoliPreferenziali: ${JSON.stringify(titoliPreferenziali)},
                    patenti: ${JSON.stringify(patenti)},
                    tipoProve: ${JSON.stringify(tipoProve)},
                    esitiProve: ${JSON.stringify(esitiProve)},
                    dateProve: ${JSON.stringify(dateProve)},
                    statoCandidato: ${JSON.stringify(statoCandidato)},
                    nome: ${JSON.stringify(nome || null)},
                    cognome: ${JSON.stringify(cognome || null)},
                    codiceFiscale: ${JSON.stringify(codiceFiscale || null)},
                    BirthDateGreaterThanOrEqual: ${JSON.stringify(BirthDateGreaterThanOrEqual || null)},
                    BirthDateLessThanOrEqual: ${JSON.stringify(BirthDateLessThanOrEqual || null)}
                ) {
                    ${generateStructuredString(campiPerQuery)}
                }
            }
            `)
        
    });
        const dateInputFrom = document.getElementById('dateFrom');

        // Aggiungi un event listener per rilevare quando l'utente cambia il valore
        dateInputFrom.addEventListener('change', function() {
            // Salva il valore in una variabile
            BirthDateGreaterThanOrEqual = dateInputFrom.value;
        });
        const dateInputTo = document.getElementById('dateTo');

        // Aggiungi un event listener per rilevare quando l'utente cambia il valore
        dateInputTo.addEventListener('change', function() {
            // Salva il valore in una variabile
            BirthDateLessThanOrEqual = dateInputTo.value;   
        });
  
    const query = `
    query {
        getCandidatiByCriteria(concorso: "${concorsoId}") {
            codiceFiscale
            cognome
            nome
            dataNascita
            statoCandidato
        }
    }
    `;
    avvioFunction(query);
    let queryGetAllTitoliPreferenziali=`
    query {
        getAllTitoliPreferenziali(concorso: "${concorsoId}")
    }
    `;
    let queryGetAllRiserve=`
    query {
        getAllRiserve(concorso: "${concorsoId}")
    }
    `;
    let queryGetListaUnicaPatenti=`
    query {
        getListaUnicaPatenti(concorso: "${concorsoId}")
    }
    `;
    let queryGetTipologieProve=`
    query {
        getTipologieProve(concorso: "${concorsoId}")
    }
    `;
    let queryGetStatiCandidato=`
    query {
        getStatiCandidato(concorso: "${concorsoId}")
    }
    `;
    let queryGetAllFields=`
    query {
    getAllFields(concorso: "${concorsoId}")
    }
    `;
    let queryGetSimpleFields=`
    query {
    getSimpleFields(concorso: "${concorsoId}")
    }
    `;
    let queryGetDatiInDomanda=`
    query {
    getAllCampiDomandeConcorso(concorso: "${concorsoId}")
    }
    `;
    //dropd
    //dropdown-titoliPreferenziali
    popolaDropdown(queryGetAllRiserve,'dropdown-riserve',concorsoId);
    popolaDropdown(queryGetAllTitoliPreferenziali,'dropdown-titoliPreferenziali',concorsoId)
    popolaDropdown(queryGetListaUnicaPatenti,'dropdown-patenti',concorsoId)
    popolaDropdown(queryGetTipologieProve,'dropdown-tipoProve',concorsoId)//'dropdown-tipoProve'
    popolaDropdown(queryGetStatiCandidato,'dropdown-domande',concorsoId)//'dropdown-domande'
    popolaDropdown(queryGetAllFields,'dropdown-campiRestituiti',concorsoId)//'dropdown-domande'
    popolaDropdown(queryGetSimpleFields,'dropdown-anagrafica',concorsoId);
    popolaDropdown(queryGetTipologieProve,'dropdown-iterConcorso',concorsoId);
    popolaDropdown(queryGetDatiInDomanda,'dropdown-domanda',concorsoId);

    const queryTipoProve = `
    query {
        getTipologieProve(concorso: "${concorsoId}") 
    }
    `
   //codice per generare button per la gestione prove motorie

    aggiungiPulsanteProve(concorsoId,"PROVA MOTORIO-ATTITUDINALE","PROVE MOTORIE",'filtroAvanzato',`btn btn-danger`)
    aggiungiPulsanteProve(concorsoId,"VISITA MEDICA","VISITA MEDICA",'filtroAvanzato',`btn btn-warning`)
    aggiungiPulsanteProve(concorsoId,"PROVA ORALE","PROVA ORALE",'filtroAvanzato',`btn btn-success`)
    
    
});
    let riserve= []
    let titoliPreferenziali= []
    let patenti= []
    let tipoProve=[]
    let esitiProve=[]
    let dateProve=[]
    let statoCandidato=[]
    let campiRestituiti=[]
    let nome= ""
    let cognome= ""
    let codiceFiscale= ""
    let BirthDateGreaterThanOrEqual=""
    let BirthDateLessThanOrEqual=  ""
async function avvioFunction(query){
   
    const spinner = document.getElementById('loadingSpinner');
    const tableContainer = document.getElementById('tableContainer');
    
    // Verifica che gli elementi esistano prima di accedere a 'style'
    if (spinner && tableContainer) {
        // Mostra lo spinner e nascondi la tabella all'inizio
        spinner.style.display = 'block';
        tableContainer.style.display = 'none';
    }
   
    // Mostra lo spinner e nascondi la tabella all'inizio
  
    const response = await apiGraphQLgetAllUsers(query);
    //console.log(response)
    const users = response["data"]["getCandidatiByCriteria"];
    //document.getElementById('exportBtn').addEventListener('click', exportTableToExcel(users));
    console.log(users)

    // Numero di record per pagina
    const recordsPerPage = 2000;
    let currentPage = 1; // Pagina iniziale
    let sortDirection = {}; // Stato di ordinamento

    if (users.length > 0) {
        //console.log("____________________________",users[0])
        generateTableHeader(users[0]);
        generateTableRows(users, currentPage, recordsPerPage);
        generatePagination(users.length, recordsPerPage);
    }
    // Nascondi lo spinner e mostra la tabella dopo il caricamento
    spinner.style.display = 'none';
    

    // Funzione per ordinare la tabella quando si clicca su un'intestazione
    function sortTableByColumn(columnKey) {
        if (!sortDirection[columnKey]) {
            sortDirection[columnKey] = 'asc'; // Ordine crescente per default
        } else {
            sortDirection[columnKey] = sortDirection[columnKey] === 'asc' ? 'desc' : 'asc';
        }

        // Ordina i dati basandosi sulla colonna selezionata
        users.sort((a, b) => {
            let valA = a[columnKey];
            let valB = b[columnKey];

            // Convertiamo date o numeri se necessario per l'ordinamento
            if (typeof valA === 'string' && !isNaN(Date.parse(valA))) {
                valA = new Date(valA);
                valB = new Date(valB);
            }

            return sortDirection[columnKey] === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        // Rigeneriamo le righe ordinate solo per la pagina corrente
        generateTableRows(users, currentPage, recordsPerPage);
    }

    // Funzione per ottenere le chiavi dei campi annidati con la notazione puntata, inclusi gli array
    function getNestedKeys(obj, parentKey = '') {
        let keys = [];

        if (Array.isArray(obj)) {
            // Se l'oggetto è un array, esplora ogni elemento dell'array
            obj.forEach((item, index) => {
                keys = keys.concat(getNestedKeys(item, `${parentKey}[${index}]`));
            });
        } else if (typeof obj === 'object' && obj !== null) {
            // Se l'oggetto è un oggetto, esplora le sue chiavi
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const fullKey = parentKey ? `${parentKey}.${key}` : key;
                    keys = keys.concat(getNestedKeys(obj[key], fullKey));
                }
            }
        } else {
            // Se è un valore puro, aggiungi la chiave
            keys.push(parentKey);
        }
        //console.log("*******************",keys)
        return keys;
    }


    // Funzione per generare l'intestazione della tabella
    function generateTableHeader(user) {
        const headerRow = document.getElementById('tableHeader');
        headerRow.innerHTML = ''; // Pulisci l'intestazione prima di rigenerarla

        // Colonna per il numero progressivo
        const thNumber = document.createElement('th');
        thNumber.innerText = '#';
        headerRow.appendChild(thNumber);

        // Ottieni tutte le chiavi (compresi i campi annidati)
        const nestedKeys = getNestedKeys(user);
        //console.log("----------------",nestedKeys)
        // Genera le colonne per i nomi dei campi
        nestedKeys.forEach(key => {
            const th = document.createElement('th');
            th.innerHTML = `${key} <i class="fas fa-sort"></i>`;
            th.style.cursor = 'pointer';

            // Aggiungi il gestore di eventi per ordinare quando si clicca sull'intestazione
            th.addEventListener('click', () => sortTableByColumn(key));
            headerRow.appendChild(th);
        });
    }


   // Funzione per popolare le righe della tabella, in base alla pagina corrente
    function generateTableRows(users, currentPage, recordsPerPage) {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = ''; // Pulisci il corpo della tabella prima di rigenerarla

        // Calcola l'indice dei record da visualizzare
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = Math.min(startIndex + recordsPerPage, users.length);

        // Ottieni tutte le chiavi (compresi i campi annidati)
        const nestedKeys = getNestedKeys(users[0]);

        // Visualizza solo i record per la pagina corrente
        for (let i = startIndex; i < endIndex; i++) {
            const user = users[i];
            const row = document.createElement('tr');

            // Colonna per il numero progressivo
            const tdNumber = document.createElement('td');
            tdNumber.innerText = i + 1;
            row.appendChild(tdNumber);

            // Popola le celle della riga con i dati
            nestedKeys.forEach(key => {
                const td = document.createElement('td');
                const value = getNestedValue(user, key); // Ottieni il valore con la notazione puntata
                td.innerText = value !== null && value !== undefined ? value : ''; // Mostra il valore o stringa vuota
                row.appendChild(td);
            });
            // Aggiungi la colonna con il pulsante alla fine della riga
            const tdButton = document.createElement('td');
            const button = document.createElement('button');
            button.className = 'btn btn-secondary shadow-sm  btn-custom'; // Stile del pulsante
            //button.innerText = '=>'; // Testo del pulsante
            button.innerHTML = '<i class="fas fa-arrow-right"></i>'; // Icona "arrow-right"
    
            // Imposta l'attributo data-codiceFiscale al codice fiscale dell'utente
            button.setAttribute('data-codiceFiscale', user.codiceFiscale);
    
            // Aggiungi un gestore di eventi al pulsante
            button.addEventListener('click', function() {
                const codiceFiscale = this.getAttribute('data-codiceFiscale');
                //console.log('Pulsante cliccato per codice fiscale:', codiceFiscale);
    
                // Inserisci qui la logica da eseguire quando viene cliccato il pulsante
            });
    
            // Aggiungi il pulsante alla cella e la cella alla riga
            tdButton.appendChild(button);
            row.appendChild(tdButton);
            // Aggiungi la riga completa alla tabella
            tableBody.appendChild(row);
        }
    }


    // Funzione per generare la navigazione delle pagine
    function generatePagination(totalRecords, recordsPerPage) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = ''; // Pulisci la navigazione prima di rigenerarla

        const totalPages = Math.ceil(totalRecords / recordsPerPage);

        // Pulsante "Precedente"
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.className = 'btn btn-danger mx-1';
            prevButton.innerText = 'Precedente';
            prevButton.addEventListener('click', () => {
                currentPage--;
                generateTableRows(users, currentPage, recordsPerPage);
                generatePagination(totalRecords, recordsPerPage);
            });
            paginationContainer.appendChild(prevButton);
        }

        // Crea i pulsanti di navigazione
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'btn btn-danger mx-1';
            pageButton.innerText = i;

            // Aggiungi un listener per il cambio di pagina
            pageButton.addEventListener('click', () => {
                currentPage = i;
                generateTableRows(users, currentPage, recordsPerPage);
                highlightCurrentPage(i);
            });

            paginationContainer.appendChild(pageButton);
        }

        // Pulsante "Successivo"
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.className = 'btn btn-danger mx-1';
            nextButton.innerText = 'Successivo';
            nextButton.addEventListener('click', () => {
                currentPage++;
                generateTableRows(users, currentPage, recordsPerPage);
                generatePagination(totalRecords, recordsPerPage);
            });
            paginationContainer.appendChild(nextButton);
        }

        // Evidenzia la pagina corrente
        highlightCurrentPage(currentPage);
    }

    // Funzione per evidenziare la pagina corrente
    function highlightCurrentPage(currentPage) {
        const paginationButtons = document.querySelectorAll('#pagination button');
        paginationButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Aggiungi la classe "active" al pulsante della pagina corrente
        paginationButtons[currentPage - 1].classList.add('active');
    }
    
   // Funzione per ottenere il valore di un campo annidato con la notazione puntata
    function getNestedValue(obj, key) {
        return key.split('.').reduce((o, k) => {
            if (k.includes('[')) {
                // Gestisce l'accesso agli array (es: 'domandeConcorso[0]')
                const [arrayKey, index] = k.split(/\[|\]/).filter(Boolean);
                return (o && o[arrayKey] && o[arrayKey][index]) ? o[arrayKey][index] : null;
            }
            return o ? o[k] : null;
        }, obj);
    }
   
    
   
}
 
 function getSelectedTest() {
    var checkboxes = document.querySelectorAll('.dropdown-campiRestituiti input[type="checkbox"]');
    var selectedFruits = [];
    checkboxes.forEach(function(checkbox) {
      if (checkbox.checked) {
        selectedFruits.push(checkbox.value);
      }
    });
    return selectedFruits;
  }
 async function popolaDropdown(query,idDropdown,concorsoId){
    let dropdownElement=document.getElementById(idDropdown);
    const response = await apiGraphQLgetAllUsers(query);
    //console.log("+++++++++++++++++",idDropdown)
    //dropdownElement.innerHTML = `<label><input type="checkbox" name="codiceFiscale" value="codiceFiscale"> Codice Fiscale</label>`;
    // Cicla su tutte le proprietà di "data"
     for (let key in response.data) {
        // Controlla se la proprietà è un array
        if (Array.isArray(response.data[key])) {
            // Se è un array, cicla e stampa il contenuto
            response.data[key].forEach((titolo, index) => {
               // console.log(`${index + 1}. ${titolo}`);
                dropdownElement.innerHTML += `<label><input type="checkbox" name="${titolo}" value="${titolo}"> ${titolo}</label>`;
            });
            break; // Esci dal ciclo dopo aver trovato l'array
        }
    }

    const selectedOptionsInput = document.getElementById(`selectedOptions-${idDropdown}`);
    // Seleziona tutte le checkbox all'interno del div con id "dropdown-titoliPreferenziali"
    const checkboxes = document.querySelectorAll(`#${idDropdown} input[type="checkbox"]`);

    function updateSelectedOptions(selectedOptionsInput,checkboxes) {
        const selected = Array.from(checkboxes)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => checkbox.value); // Raccoglie i valori selezionati
        selectedOptionsInput.value = selected.length ? selected.join(', ') : 'Seleziona opzioni...';
       //console.log("////////////  ",idDropdown,"---  ",selected);
        switch(idDropdown) {
            case "dropdown-riserve":
              riserve=selected;
              //console.log(selected)
            break;
            case "dropdown-titoliPreferenziali":
              titoliPreferenziali=selected
              //console.log(titoliPreferenziali)
            break;
            case "dropdown-patenti":
                patenti=selected
               // console.log(patenti)
            break;
            case "dropdown-tipoProve":
                tipoProve=selected
               // console.log(tipoProve)
            break;
            case "dropdown-esitoProva":
                esitiProve=selected
              //  console.log(esitiProve)
            break;
            case "dropdown-dataProva":
                dateProve=selected
               // console.log(dateProve)
            break;
            case "dropdown-domande":
                statoCandidato=selected
               // console.log(statoCandidato)
            break;
            case "dropdown-campiRestituiti":
                campiRestituiti=selected
               console.log("riga 455:",campiRestituiti)
            break;
            default:
              // code block
          }
          console.log("////////////riga 377  ",idDropdown,"---  ",selected)
        if(idDropdown==="dropdown-tipoProve"){
            let dropdownElementEsiti=document.getElementById('dropdown-esitoProva');
            let dropdownElementDataProva=document.getElementById('dropdown-dataProva');
            dropdownElementDataProva.innerHTML='';
            dropdownElementEsiti.innerHTML='';
            const selectedOptionsInputEsiti = document.getElementById(`selectedOptions-dropdown-esitoProva`);
            const checkboxesEsiti = document.querySelectorAll(`#dropdown-esitoProva input[type="checkbox"]`);
            const selectedEsiti = Array.from(checkboxesEsiti)
            .filter(checkboxesEsiti => checkboxesEsiti.checked)
            .map(checkboxesEsiti => checkboxesEsiti.value); // Raccoglie i valori selezionati
            selectedOptionsInputEsiti.value = selectedEsiti.length ? selectedEsiti.join(', ') : 'Seleziona opzioni...';
            
            //popolaDropdown(queryGetEsitiProve,"dropdown-esitoProva",concorsoId)
           // console.log('----------',selected)
            if(selected.length){
                for (const elemento of selected) {
                   // console.log(elemento);
                    let queryGetEsitiProve=`
                        query {
                            getEsitiByProva(concorso: "${concorsoId}",tipoProva:"${elemento}")
                        }
                        `;
                    popolaDropdown(queryGetEsitiProve,"dropdown-esitoProva",concorsoId);
                    let queryGetEsitiProveData=`
                        query {
                            getDateProveByTipoProva(concorso: "${concorsoId}",tipoProva:"${elemento}")
                        }
                        `;
                    popolaDropdown(queryGetEsitiProveData,"dropdown-dataProva",concorsoId)
                }
                
            }
         }

      }
     // Aggiungi un listener di evento a ogni checkbox
     
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateSelectedOptions(selectedOptionsInput,checkboxes);
            // altraFunzione();        
            });
        });
    
 }
 function exportTableToExcelFromVisibleTable() {
    // Ottieni la tabella dal DOM
    let table = document.getElementById('concorsiTable');  
    if (!table) return;

    let rows = [];
    
    // Ottieni le righe dell'intestazione
    let headerRow = [];
    table.querySelectorAll('thead tr th').forEach(th => {
        headerRow.push(th.innerText.trim());
    });
    rows.push(headerRow); // Aggiungi l'intestazione all'array 'rows'

    // Ottieni i dati di ogni riga del corpo della tabella
    table.querySelectorAll('tbody tr').forEach(tr => {
        let row = [];
        tr.querySelectorAll('td').forEach(td => {
            row.push(td.innerText.trim());  // Ottieni il testo di ogni cella
        });
        rows.push(row); // Aggiungi ogni riga all'array 'rows'
    });

    // Crea un foglio di lavoro Excel con i dati della tabella
    let worksheet = XLSX.utils.aoa_to_sheet(rows);

    // Crea una nuova cartella di lavoro
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dati");

    // Esporta il file Excel
    XLSX.writeFile(workbook, 'dati_tabella.xlsx');
}
function exportTableToExcel(data) {
    if (!data || data.length === 0) return; // Controlla che ci siano dati

    // Estrai dinamicamente le chiavi dall'oggetto per creare l'intestazione
    let header = Object.keys(data[0]);

    // Crea un foglio di lavoro Excel dal tuo array di oggetti con intestazione dinamica
    let worksheet = XLSX.utils.json_to_sheet(data, { 
        header: header, // Usa le chiavi degli oggetti per l'intestazione
        skipHeader: false // Include l'intestazione
    });

    // Crea una nuova cartella di lavoro
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dati Candidati");

    // Esporta il file Excel
    XLSX.writeFile(workbook, 'dati_candidati.xlsx');
}

//funzione per generare button per la gestione prove motorie e visite mediche
async function aggiungiPulsanteProve(concorsoId, nomeProva, nomeButton, idButtonPrecedente,classButton) {
    const queryTipoProve = `
    query {
        getTipologieProve(concorso: "${concorsoId}") 
    }
    `;

    try {
        const tipoProveLista = await apiGraphQLgetAllUsers(queryTipoProve);
        const listaProve = JSON.stringify(tipoProveLista["data"]["getTipologieProve"]);
        const presenzaProva = listaProve.includes(nomeProva);

        if (presenzaProva) {
            const targetElement = document.getElementById(idButtonPrecedente);
            if (!targetElement) {
                console.error(`Elemento con ID "${idButtonPrecedente}" non trovato.`);
                return;
            }

            const newButton = document.createElement('button');
            newButton.className = classButton;
            newButton.style.marginLeft = '10px';
            newButton.textContent = nomeButton;
            newButton.type = 'button';

            targetElement.insertAdjacentElement('afterend', newButton);

            newButton.addEventListener('click', function () {
                window.location.href = `/gestioneProveConcorsuali?id=${concorsoId}&tipoProva=${nomeProva}`;
            });
        }
    } catch (error) {
        console.error("Errore durante l'aggiunta del pulsante:", error);
    }
}
function generateStructuredString(inputList) {
    let result = '';
    const processPath = (path) => {
        // Rimuovi il punto iniziale, se presente
        if (path.startsWith('.')) {
            path = path.slice(1);
        }
        const parts = path.split('.');
        let structured = parts.shift();
        for (const part of parts) {
            structured += ` {
                ${part}`;
        }
        for (let i = 0; i < parts.length; i++) {
            structured += ' }';
        }
        return structured;
    };
    for (let i = 0; i < inputList.length; i++) {
        const item = inputList[i];
        if (item.includes('{')) {
            // Preserva i blocchi annidati già completi
            result += item.trim();
        } else if (item.includes('.')) {
            result += processPath(item);
        } else {
            result += item;
        }
        if (i < inputList.length - 1) {
            result += '\n';
        }
    }
    console.log('/////////////////// ', result);
    return result;
}

   