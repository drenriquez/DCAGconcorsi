import { apiGraphQLgetAllUsers } from "../../utils/apiGraphql.js";
import { generaTabulatiProveMotorie } from "../../utils/proveTabulatiGenerator.js"
import { formatDate } from "../../utils/formatDate.js"

document.addEventListener('DOMContentLoaded', async function() {
    const hostApi = document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
    const concorsoTipoProva = document.querySelector('script[type="module"]').getAttribute('tipoProva');
    const datiTest=[
        { cognome: 'Ferracatena', nome: 'Francesco', dataNascita: '08/03/1999', lingua: 'Italiano' },
        { cognome: 'Breci', nome: 'Alfio', dataNascita: '01/07/1996', lingua: 'Francese' },
        { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992', lingua: 'Spagnolo' },
    ]
    // Ottieni gli elementi del DOM
    document.getElementById('exportBtn').addEventListener('click',()=>{ exportTableToExcelFromVisibleTable(concorsoId,concorsoTipoProva)});
    //BUTTON PER GENERARE I TABULATI
    document.getElementById('exportPdfBtn').addEventListener('click',()=>{generatorePDF(concorsoId,concorsoTipoProva)} );
    document.getElementById('exportPdfBtnEsiti').addEventListener('click',()=>{generatorePDF(concorsoId,"ESITI".concat(" ",concorsoTipoProva))} );
    let openedWindow = null; // Variabile per tenere traccia della finestra aperta

    document.getElementById('daRiconvocare').addEventListener('click', () => {
        const url = `/concorsi/tabellaDaRiconvocare?id=${concorsoId}&tipoProva=${concorsoTipoProva}&dataProva=${dateProve[0]}`; 
        const windowFeatures = "width=1200,height=600,resizable,scrollbars";

        if (openedWindow && !openedWindow.closed) {
            // Se la finestra è già aperta e non è chiusa, aggiorniamola
            openedWindow.location.href = url;
            openedWindow.focus(); // Porta la finestra in primo piano
        } else {
            // Altrimenti apriamo una nuova finestra e salviamo il riferimento
            openedWindow = window.open(url, "_blank", windowFeatures);
        }
    });

    document.getElementById('btnTabulatiPersonalizzati').addEventListener('click', () => {
        const url = `/concorsi/tabulatiPersonalizzati?id=${concorsoId}&tipoProva=${concorsoTipoProva}&dataProva=${dateProve[0]}`; 
        const windowFeatures = "width=1200,height=600,resizable,scrollbars";

        if (openedWindow && !openedWindow.closed) {
            // Se la finestra è già aperta e non è chiusa, aggiorniamola
            openedWindow.location.href = url;
            openedWindow.focus(); // Porta la finestra in primo piano
        } else {
            // Altrimenti apriamo una nuova finestra e salviamo il riferimento
            openedWindow = window.open(url, "_blank", windowFeatures);
        }
    });
        
    document.querySelector('#eseguiBtn').addEventListener('click', function() {
        //let campiSelezionati=getSelectedTest()
      //////console.log("-----riga 10: ",campiRestituiti);
      let campiPerQuery = campiRestituiti.length === 0 ? ["cognome", "nome","codiceFiscale","dataNascita"] : campiRestituiti;
      avvioFunction( `
        query {
            getCandidatiByCriteria(
                concorso: "${concorsoId}",
                riserve: ${JSON.stringify(riserve)},
                titoliPreferenziali: ${JSON.stringify(titoliPreferenziali)},
                patenti: ${JSON.stringify(patenti)},
                tipoProve: ${JSON.stringify(concorsoTipoProva)},
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
        let cognomeInputElement= document.getElementById('cognome');
        cognomeInputElement.addEventListener('change',function(){
            cognome=cognomeInputElement.value;
        })
        let nomeInputElement= document.getElementById('nome');
        nomeInputElement.addEventListener('change',function(){
            nome=nomeInputElement.value;
        })
        let codiceFiscaleInputElement= document.getElementById('codiceFiscale');
        codiceFiscaleInputElement.addEventListener('change',function(){
            codiceFiscale=codiceFiscaleInputElement.value;
        })
  
    const query = `
    query {
        getCandidatiByCriteria(concorso: "${concorsoId}",tipoProve:"${concorsoTipoProva}") {
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
    let queryDateConcorsoTipoProva=`
    query {
    getDateProveByTipoProva(concorso: "${concorsoId}",tipoProva:"${concorsoTipoProva}")
    }
    `;
    let queryEsitiConcorsoTipoProva=`
    query {
    getEsitiByProva(concorso: "${concorsoId}",tipoProva:"${concorsoTipoProva}")
    }
    `
    //dropd
    //dropdown-titoliPreferenziali


    popolaDropdown(queryGetAllRiserve,'dropdown-riserve',concorsoId);
    popolaDropdown(queryGetAllTitoliPreferenziali,'dropdown-titoliPreferenziali',concorsoId)
   // popolaDropdown(queryGetListaUnicaPatenti,'dropdown-patenti',concorsoId)
    //popolaDropdown(queryGetTipologieProve,'dropdown-tipoProve',concorsoId)//'dropdown-tipoProve'
    //popolaDropdown(queryGetStatiCandidato,'dropdown-domande',concorsoId)//'dropdown-domande'
    popolaDropdown(queryGetAllFields,'dropdown-campiRestituiti',concorsoId)//'dropdown-domande'
    popolaDropdown(queryGetSimpleFields,'dropdown-anagrafica',concorsoId);
    //popolaDropdown(queryGetTipologieProve,'dropdown-iterConcorso',concorsoId);
    //popolaDropdown(queryGetDatiInDomanda,'dropdown-domanda',concorsoId);
    popolaDropdown(queryDateConcorsoTipoProva,'dropdown-dataConcorsoTipoProva',concorsoId);
    popolaDropdown(queryEsitiConcorsoTipoProva,'dropdown-esitoConcorsoTipoProva',concorsoId);
 
    const queryTipoProve = `
    query {
        getTipologieProve(concorso: "${concorsoId}") 
    }
    `
   //codice per generare button per la gestione prove motorie

    //aggiungiPulsanteProve(concorsoId,"PROVA MOTORIO-ATTITUDINALE","PROVE MOTORIE")
    
    
}); 
    let usersData=[];
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
    ////console.log(query)
    const users = response["data"]["getCandidatiByCriteria"];
    usersData=users;
    //document.getElementById('exportBtn').addEventListener('click', exportTableToExcel(users));
    console.log(users)

    // Numero di record per pagina
    const recordsPerPage = 2000;
    let currentPage = 1; // Pagina iniziale
    let sortDirection = {}; // Stato di ordinamento

    if (users.length > 0) {
        console.log("____________________________",users[0])
        generateTableHeader(users[0]);
        generateTableRows(users, currentPage, recordsPerPage);
        generatePagination(users.length, recordsPerPage);
    }
    else{
        console.log("____________VUOTO________________")
        let userNull=[{'codiceFiscale': '-', 'cognome': '-', 'nome': '-', 'dataNascita': '-', 'statoCandidato': '-'}]
        generateTableHeader(userNull[0]);
        generateTableRows(userNull, currentPage, recordsPerPage);
        generatePagination(userNull.length, recordsPerPage);
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
        //////console.log("*******************",keys)
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
        //////console.log("----------------",nestedKeys)
        // Genera le colonne per i nomi dei campi
        nestedKeys.forEach(key => {
            const th = document.createElement('th');
            th.innerHTML = `${key} <i class="fas fa-sort"></i>`;
            th.style.cursor = 'pointer';

            // Aggiungi il gestore di eventi per ordinare quando si clicca sull'intestazione
            th.addEventListener('click', () => sortTableByColumn(key));
            headerRow.appendChild(th);
        });
        let isChecked = document.getElementById("myCheckbox").checked;
        if(isChecked){
        const thDataFirstStep = document.createElement('th');
        thDataFirstStep.innerText = 'dataFirstStep';
        headerRow.appendChild(thDataFirstStep);
        }
        const thStepCandidato = document.createElement('th');
        thStepCandidato.innerText = 'schedaCandidato';
        headerRow.appendChild(thStepCandidato); 
    }
   // Funzione per popolare le righe della tabella, in base alla pagina corrente
   async function generateTableRows(users, currentPage, recordsPerPage) {
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
            let value = getNestedValue(user, key); // Ottieni il valore con la notazione puntata

            // Controlla se il valore è una data nel formato ISO
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
                value = formatDate(value, false, false); // Formatta la data
            }

            td.innerText = value !== null && value !== undefined ? value : ''; // Mostra il valore o stringa vuota
            row.appendChild(td);
        });
        let isChecked = document.getElementById("myCheckbox").checked;
        if(isChecked){
        //casella test
         let queryStep=`query{
            getFirstStepDateByProva(concorso:"350VVF",codiceFiscale:"${user.codiceFiscale}",provaDescrizione:"PROVA MOTORIO-ATTITUDINALE")
        }`
        const dataFirstStep = await apiGraphQLgetAllUsers(queryStep);
        console.log(dataFirstStep['data']['getFirstStepDateByProva'])
        const tdDataFirstStep=document.createElement('td');
        const h1Test = document.createElement('h4');
        h1Test.innerHTML=dataFirstStep['data']['getFirstStepDateByProva']
        tdDataFirstStep.appendChild(h1Test)
        
        row.appendChild(tdDataFirstStep) 
        }
        // Aggiungi la colonna con il pulsante alla fine della riga
        const tdButton = document.createElement('td');
        const button = document.createElement('button');
        button.className = 'btn btn-secondary shadow-sm btn-custom'; // Stile del pulsante
        button.innerHTML = '<i class="fas fa-arrow-right"></i>'; // Icona "arrow-right"

        // Imposta l'attributo data-codiceFiscale al codice fiscale dell'utente
        button.setAttribute('data-codiceFiscale', user.codiceFiscale);

        // Aggiungi un gestore di eventi al pulsante
        button.addEventListener('click', function() {
            const codiceFiscale = this.getAttribute('data-codiceFiscale');
            //console.log('Pulsante cliccato per codice fiscale:', codiceFiscale);
            formCandidato(codiceFiscale);

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
   
    
   
}//avvioFunction
 
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
    ////console.log("+++++++++++++++++response",response)
    //dropdownElement.innerHTML = `<label><input type="checkbox" name="codiceFiscale" value="codiceFiscale"> Codice Fiscale</label>`;
    // Cicla su tutte le proprietà di "data"
     for (let key in response.data) {
        // Controlla se la proprietà è un array
        
        let arrayResult=response.data[key]
        if(key==='getDateProveByTipoProva'){
            //////console.log("+**********++++key",arrayResult)
           /*  arrayResult.sort((a, b) => {
                // Estrarre solo la parte data dalla stringa "YYYY-MM-DDTHH:MM|TipoProva"
                const dateA = new Date(a.split('|')[0]); // Prende solo la parte della data e la converte in oggetto Date
                const dateB = new Date(b.split('|')[0]);
            
                return dateA - dateB; // Ordina prima per giorno, poi per ora
            }); */
            const uniqueDates = new Set();

            // Ordinare e rimuovere duplicati
             arrayResult = arrayResult
            .sort((a, b) => {
                const dateA = new Date(a.split('|')[0]); // Estrarre la data e convertirla
                const dateB = new Date(b.split('|')[0]);
                return dateA - dateB;
            })
            .filter(dateString => {
                if (uniqueDates.has(dateString)) {
                    return false; // Scarta i duplicati
                }
                uniqueDates.add(dateString);
                return true;
            });

            //////console.log("arrayResult unicizzato",arrayResult);
        }
        if (Array.isArray(arrayResult)) {
            // Se è un array, cicla e stampa il contenuto

            
            arrayResult.forEach((titolo, index) => {
               // ////////console.log(`${index + 1}. ${titolo}`);
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
       //////////console.log("////////////  ",idDropdown,"---  ",selected);
        switch(idDropdown) {
            case "dropdown-riserve":
              riserve=selected;
              ////////console.log(selected)
            break;
            case "dropdown-titoliPreferenziali":
              titoliPreferenziali=selected
              ////////console.log(titoliPreferenziali)
            break;
            case "dropdown-patenti":
                patenti=selected
               // //////console.log(patenti)
            break;
            case "dropdown-tipoProve":
                tipoProve=selected
               // //////console.log(tipoProve)
            break;
            case "dropdown-esitoProva":
                esitiProve=selected
              //  //////console.log(esitiProve)
            break;
            case "dropdown-dataConcorsoTipoProva":
                dateProve=selected
               // //////console.log(dateProve)
            break;
            case "dropdown-esitoConcorsoTipoProva":
                esitiProve=selected
               // //////console.log(dateProve)
            break;
            case "dropdown-domande":
                statoCandidato=selected
               // //////console.log(statoCandidato)
            break;
            case "dropdown-campiRestituiti":
                campiRestituiti=selected
               //////console.log("riga 455:",campiRestituiti)
            break;
            default:
              // code block
          }
          //////console.log("////////////riga 377  ",idDropdown,"---  ",selected)
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
           // //////console.log('----------',selected)
            if(selected.length){
                for (const elemento of selected) {
                   // //////console.log(elemento);
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
 function exportTableToExcelFromVisibleTable(concorsoId,concorsoTipoProva) {
    let dataP=""
    if(dateProve.length===1){
        dataP =  formatDate(dateProve[0].split('|')[0],true, true);//.// Restituisce la parte della data in -> gg-mm-aaaa hh:mm
    }
    // Ottieni la tabella dal DOM
    ////console.log('exportBtn------------------------------------')
    let table = document.getElementById('concorsiTable');
    if (!table) return;

    let rows = [];

    // Aggiungi una riga con il titolo che occupa 5 colonne
    let titleRow =[`${concorsoTipoProva}_${concorsoId}__${dataP}`]; // Personalizza il titolo
    rows.push([titleRow[0], '', '', '', '']);

    // Aggiungi una riga vuota come separatore
    rows.push([]);

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

    // Imposta la larghezza delle colonne in base ai dati
    let colWidths = headerRow.map((header, i) => {
        let maxLength = Math.max(
            header.length,
            ...rows.slice(3).map(row => (row[i] ? row[i].toString().length : 0))
        );
        return { wch: maxLength + 2 }; // Aggiungi un po' di spazio extra
    });
    worksheet['!cols'] = colWidths;

    // Aggiungi lo stile alle intestazioni (sfondo grigio chiaro e bordi)
    let headerRange = XLSX.utils.encode_range({ s: { c: 0, r: 2 }, e: { c: headerRow.length - 1, r: 2 } });
    for (let cellAddress in worksheet) {
        if (worksheet[cellAddress] && cellAddress >= 'A3' && cellAddress <= 'Z3') {
            worksheet[cellAddress].s = {
                fill: { fgColor: { rgb: "D3D3D3" } },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                },
                font: { bold: true }
            };
        }
    }

    // Aggiungi i bordi a tutte le celle della tabella
    Object.keys(worksheet).forEach(cell => {
        if (cell[0] !== "!") {
            worksheet[cell].s = worksheet[cell].s || {};
            worksheet[cell].s.border = {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            };
        }
    });

    // Crea una nuova cartella di lavoro
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dati");

    // Esporta il file Excel
    XLSX.writeFile(workbook, `${concorsoTipoProva}_${concorsoId}_${dataP}.xlsx`);
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
async function aggiungiPulsanteProve(concorsoId,nomeProva,nomeButton) {
    const queryTipoProve = `
    query {
        getTipologieProve(concorso: "${concorsoId}") 
    }
    `
   //codice per generare button per la gestione prove motorie
    let tipoProveLista= await apiGraphQLgetAllUsers(queryTipoProve)
    let listaProve=JSON.stringify(tipoProveLista["data"]["getTipologieProve"]);
    let presenzaProvaMotoria=listaProve.includes(nomeProva);
    if(presenzaProvaMotoria){
        const targetElement = document.getElementById('filtroAvanzato');
        // Crea un nuovo elemento button
        const newButton = document.createElement('button');
        newButton.className = 'btn btn-danger'; // Aggiungi classi per lo stile
        newButton.style.marginLeft = '10px';
        newButton.textContent = nomeButton; // Testo del pulsante
        newButton.type = 'button';
        // Inserisci il pulsante subito dopo l'elemento con id "filtroAvanzato"
        targetElement.insertAdjacentElement('afterend', newButton);
        newButton.addEventListener('click', function () {
            window.location.href = `/concorsi/gestioneProveConcorsuali?id=${concorsoId}&tipoProva=${nomeProva}`;//?id=${concorsoId}
        });
    }
};
function hasKeys(obj, keys) {
    // Verifica che tutte le chiavi siano presenti nell'oggetto
    return keys.every(key => obj.hasOwnProperty(key));
};
function filterFields(objList, allowedFields) {
    return objList.map(obj => {
        // Crea un nuovo oggetto includendo solo i campi permessi
        return Object.keys(obj)
            .filter(key => allowedFields.includes(key))
            .reduce((filteredObj, key) => {
                filteredObj[key] = obj[key];
                return filteredObj;
            }, {});
    });
}
function formatDatesInObjects(objectList, keyToFormat) {
    return objectList.map(obj => {
        // Crea una copia dell'oggetto per evitare modifiche all'originale
        const newObj = { ...obj };
        if (newObj[keyToFormat]) {
            // Controlla se la chiave esiste e formatta il valore
            newObj[keyToFormat] = formatDate(newObj[keyToFormat]);
        }
        return newObj;
    });
}
function flattenAndFormatDates(objectList) {
    return objectList.map(obj => {
        // Funzione ricorsiva per appianare l'oggetto e gestire le date
        function flattenObject(subObj, prefix = '') {
            let result = {};

            for (const key in subObj) {
                if (subObj.hasOwnProperty(key)) {
                    const newKey = prefix ? `${prefix}.${key}` : key;

                    if (Array.isArray(subObj[key])) {
                        // Se la proprietà è un array, appiana ogni elemento dell'array
                        subObj[key].forEach((item, index) => {
                            result = { ...result, ...flattenObject(item, `${newKey}.${index}`) };
                        });
                    } else if (typeof subObj[key] === 'object' && subObj[key] !== null) {
                        // Se la proprietà è un oggetto, chiamata ricorsiva
                        result = { ...result, ...flattenObject(subObj[key], newKey) };
                    } else {
                        // Se la proprietà è una data, la formatta
                        result[newKey] = (key === 'dataNascita') ? formatDate(subObj[key]) : subObj[key];
                    }
                }
            }

            return result;
        }

        // Restituisce l'oggetto appiattito e con le date formattate
        return flattenObject(obj);
    });
}
function generatorePDF(concorsoId,concorsoTipoProva){
    const requiredKeys = ['cognome', 'nome', 'dataNascita'];
    if(hasKeys(usersData[0], requiredKeys)){
        if(dateProve.length===1){

            console.log('******************--userData--prima della trasf',usersData)
            const testDati=flattenAndFormatDates(usersData);
            console.log('******************--testDati',testDati)
            const filteredList = filterFields(usersData, requiredKeys);//non serve più, TODO
            const filterListFormattedDate= formatDatesInObjects(filteredList, "dataNascita")
          //  ////console.log("///////////////////////", testDati)
            
            //////console.log('prova dati formattati:',testDati);
            let dataP =  formatDate(dateProve[0].split('|')[0],true, true);//.// Restituisce la parte della data in -> gg-mm-aaaa hh:mm
            switch (concorsoTipoProva) {
                case 'PROVA MOTORIO-ATTITUDINALE':
                    generaTabulatiProveMotorie(
                        concorsoId,
                        concorsoTipoProva,
                        "Identificazione",
                        dataP,
                        ['N', 'Cognome', 'Nome', 'Data Nascita', 'DOCUMENTO', 'PROVA 1', 'PROVA 2', 'PROVA 3'],
                        [15, 40, 40, 40, 50, 30, 30, 30],
                        [125, 170, 205, 240, 277],
                        filterListFormattedDate,
                        ['cognome','nome','dataNascita']
                    );
                    break;
                
                case 'PROVA ORALE':
                    generaTabulatiProveMotorie(
                        concorsoId,
                        concorsoTipoProva,
                        "Identitficazione",
                        dataP,
                        ['N', 'Cognome', 'Nome', 'Data Nascita', 'Lingua', 'DOCUMENTO', 'FIRMA'],// N resta vuoto, il primo campo non viene popolato
                        [15, 40, 40, 40, 40, 60, 30],
                        [125, 160, 215, 277],
                       testDati,
                        ['cognome','nome','dataNascita','domandeConcorso.0.lingua.descrizione']//popola i campi a partire dal secondo passato come parametro in 'intestazioneColonne'
                    );
                    break;
                    case 'ESITI PROVA ORALE':
                        generaTabulatiProveMotorie(
                            concorsoId,
                            concorsoTipoProva.slice(6),
                            "Esiti",
                            dataP,
                            ['N', 'Cognome', 'Nome', 'Data Nascita', 'Voto', 'Esito'],// N resta vuoto, il primo campo non viene popolato
                            [15, 60, 60, 40, 40, 60, 30],
                            [125, 165, 195, 277],
                        testDati,
                            ['cognome','nome','dataNascita','codiceFiscale']//popola i campi a partire dal secondo passato come parametro in 'intestazioneColonne'
                        );
                        break;
        
                default:
                    ////console.error('Tipo di prova non riconosciuto:', concorsoTipoProva);
                    break;
            }
            //////console.log(filterListFormattedDate,dateProve)
        }
       else(
        alert("SELEZIONARE UNA DATA PROVA")
       )
    }
    else(
        alert("SELEZIONARE i campi: COGNOME, NOME, DATA DI NASCITA")
    )
} 
function formCandidato(codiceFiscale){
        const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
        const concorsoTipoProva = document.querySelector('script[type="module"]').getAttribute('tipoProva')
        const url = `/concorsi/gestioneProveCandidato?id=${concorsoId}&tipoProva=${concorsoTipoProva}&codiceFiscaleCandidato=${codiceFiscale}`; // Sostituisci con l'URL desiderato
        const windowFeatures = "width=800,height=600,resizable,scrollbars";
    
        window.open(url, "_blank", windowFeatures);
   
};
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
   // ////console.log('/////////////////// ', result);
    return result;
}

   