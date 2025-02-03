import { formatDate } from "../../utils/formatDate.js";
import { apiGraphQLgetAllUsers } from "../../utils/apiGraphql.js";

document.addEventListener("DOMContentLoaded", () => {
    initTable();
    document.getElementById('aggiorna-dati').addEventListener('click', () => {
      location.reload();
    });
  });
  
  let sortedData = [];
  let sortDirection = {};
  
  async function initTable() {
    const headers = document.querySelectorAll("#documentTable th");
    const columns = [
      "codiceFiscale",
      "nome",
      "cognome",
      "prova",
      "esito",
      "dataProva",
      "giorniCertificati",
      "dataInizioMalattia",
      "dataFineMalattia", 
    ];
  
    // Aggiungi le icone di ordinamento e i listener
    headers.forEach((header, index) => {
      const columnKey = columns[index]; // Assicurati che `columns` sia definito correttamente
      if (!columnKey) {
        console.error("Colonna non definita per l'indice:", index);
        return;
      }
    
      const icon = document.createElement("i");
      icon.className = "fas fa-sort";
      icon.style.cursor = "pointer";
      header.appendChild(icon);
    
      // Aggiungi il listener di ordinamento per ciascuna colonna
      header.addEventListener("click", () => {
       //console.log(`Ordinamento richiesto per la colonna: ${columnKey}`); // Debug
        sortTableByColumn(columnKey);
      });
    });
  
    try {
      await populateTable();  // Recupera e mostra i dati iniziali
    } catch (error) {
      console.error("Errore durante il caricamento della tabella:", error);
    }
    const downloadButton = document.getElementById('exportBtnXlsx');
    downloadButton.addEventListener("click", exportTableToExcel);
        
  }
  
  async function populateTable() {
    const tbody = document.querySelector("#documentTable tbody");
    tbody.innerHTML = "";  // Svuota la tabella prima di aggiungere nuovi dati
  
    const hostApi = document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
    const concorsoTipoProva = document.querySelector('script[type="module"]').getAttribute('tipoProva');
  
    const query = `
    query GetDocumentsByProvaWithEsito {
      getDocumentsByProvaWithEsito(
        concorso: "${concorsoId}",
        provaDescrizione: "${concorsoTipoProva}",
        esitoList: ["ASSENTE GIUSTIFICATO", "PROVA SOSPESA", "INFORTUNATO", "ULTERIORI ACCERTAMENTI", "ANTICIPO/POSTICIPO"]
      ) {
        _id
        codiceFiscale
        nome
        cognome
        ultimoStep {
          idStep
          prova {
            descrizione
          }
          esito {
            descrizione
          }
          dataProva
          assenzaGiustificata {
            giorniCertificati
            dataInizioMalattia
          }
        }
      }
    }`;
  
    const response = await apiGraphQLgetAllUsers(query);
    const data = response?.data?.getDocumentsByProvaWithEsito || []; 
    //console.log("--------  data ",data)           
  
    sortedData = [...data]; // Memorizza i dati per l'ordinamento
    sortedData.sort((a, b) => {
        const valA = a.ultimoStep?.assenzaGiustificata?.dataInizioMalattia;
        const valB = b.ultimoStep?.assenzaGiustificata?.dataInizioMalattia;
        // Controllo se i valori sono validi prima di creare gli oggetti Date
        const dateA = valA ? new Date(valA) : null;
        const dateB = valB ? new Date(valB) : null;
        // Se uno dei due valori è null, metti l'altro prima
        if (dateA === null && dateB === null) return 0;
        if (dateA === null) return 1; // "dateB" viene prima
        if (dateB === null) return -1; // "dateA" viene prima
        // Confronto tra le date
        return dateA - dateB; // Ordinamento crescente
    });
      
      //console.log("-------- sortedData ",sortedData)    
    sortedData.forEach((doc) => {
      const assenza = doc.ultimoStep?.assenzaGiustificata || {};

      console.log("assenza.dataInizioMalattia:",assenza.dataInizioMalattia)

      let dataInizio = safeValue(
        formatDate(parseInt(assenza.dataInizioMalattia, 10), false, false, "yyyy-MM-dd") //TODO
      );
      if(checkISODateFormat(assenza.dataInizioMalattia)){
        dataInizio=formatDate(assenza.dataInizioMalattia,false, false, "yyyy-MM-dd")
      }
      console.log("dataInizio (dopo formatDate) :",dataInizio)
      const giorniCertificati = safeValue(assenza.giorniCertificati);
      let dataFineMalattia = addDaysToDate(dataInizio, giorniCertificati);
      if(!giorniCertificati){
        dataFineMalattia=addDaysToDate(doc.ultimoStep.dataProva,1)
       // console.log("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-",dataInizio)
      }

      //console.log('in populateTable riga 118 dataFineMalattia:' ,dataFineMalattia, 'dataInizio',dataInizio,'giorniCErtificati',giorniCertificati)
  
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${safeValue(doc.codiceFiscale)}</td>
        <td>${safeValue(doc.nome)}</td>
        <td>${safeValue(doc.cognome)}</td>
        <td>${safeValue(doc.ultimoStep?.prova?.descrizione)}</td>
        <td>${safeValue(doc.ultimoStep?.esito?.descrizione)}</td>
        <td>${safeValue(formatDate(doc.ultimoStep?.dataProva, true, false, "yyyy-MM-dd"))}</td>
        <td>${giorniCertificati}</td>
        <td>${dataInizio}</td>
        <td>${dataFineMalattia}</td>
        <td>
          <button id="button-${doc.codiceFiscale}" class="btn btn-secondary shadow-sm btn-custom" data-codiceFiscale="${doc.codiceFiscale}">
            <i class="fas fa-arrow-right"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
  
      const buttonUser = document.getElementById(`button-${doc.codiceFiscale}`);
      buttonUser.addEventListener("click", () => {
        let codiceFiscaleCandidato=buttonUser.getAttribute("data-codiceFiscale")
        //console.log(codiceFiscaleCandidato);
        formCandidato(codiceFiscaleCandidato)
      });
    });
    
  }
  
  // Funzione per ordinare i dati
  function sortTableByColumn(columnKey) {
    sortDirection[columnKey] = sortDirection[columnKey] === "asc" ? "desc" : "asc";

     // Debug: Stampa i valori di "dataFineMalattia" per le prime due righe
 /*  console.log("Valore di dataFineMalattia per l'ordinamento:", {
    valA: getColumnValue(sortedData[0], "dataFineMalattia"),
    valB: getColumnValue(sortedData[1], "dataFineMalattia"),
  }); */
  
    sortedData.sort((a, b) => {
      let valA = getColumnValue(a, columnKey);
      let valB = getColumnValue(b, columnKey);
  
      // Se i valori sono oggetti Date, confrontali come Date
      if (valA instanceof Date && valB instanceof Date) {
        return sortDirection[columnKey] === "asc" ? valA - valB : valB - valA;
      }
  
      // Se uno dei due valori è null, metti l'altro prima
      if (valA === null && valB === null) return 0;
      if (valA === null) return 1; // "valB" viene prima
      if (valB === null) return -1; // "valA" viene prima
  
      // Se sono valori non Date (stringhe, numeri), normalizzali
      valA = valA == null ? "" : valA;
      valB = valB == null ? "" : valB;
  
      // Se sono stringhe, confrontale come stringhe
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection[columnKey] === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
  
      // Se sono numeri, confrontali numericamente
      return sortDirection[columnKey] === "asc" ? valA - valB : valB - valA;
    });
  
    updateTableBody(); // Aggiorna la tabella con i dati ordinati
  }
  
  // Funzione per aggiornare la tabella con i dati ordinati
  function updateTableBody() {
    const tbody = document.querySelector("#documentTable tbody");
    tbody.innerHTML = ""; // Svuota la tabella
  
    sortedData.forEach((doc) => {
      const assenza = doc.ultimoStep?.assenzaGiustificata || {};

      let dataInizio = safeValue(
        formatDate(parseInt(assenza.dataInizioMalattia, 10), false, false, "yyyy-MM-dd")
      );
      if(checkISODateFormat(assenza.dataInizioMalattia)){
        dataInizio= dataInizio=formatDate(assenza.dataInizioMalattia,false, false, "yyyy-MM-dd")
      }
      const giorniCertificati = safeValue(assenza.giorniCertificati);
      let dataFineMalattia = addDaysToDate(dataInizio, giorniCertificati);
      if(!giorniCertificati){
        dataFineMalattia=addDaysToDate(doc.ultimoStep.dataProva,1)
        //console.log("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-",dataInizio)
      }
  
     // console.log("Rendering riga:", { dataInizio, giorniCertificati, dataFineMalattia }); // Debug
  
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${safeValue(doc.codiceFiscale)}</td>
        <td>${safeValue(doc.nome)}</td>
        <td>${safeValue(doc.cognome)}</td>
        <td>${safeValue(doc.ultimoStep?.prova?.descrizione)}</td>
        <td>${safeValue(doc.ultimoStep?.esito?.descrizione)}</td>
        <td>${safeValue(formatDate(doc.ultimoStep?.dataProva, true, false, "yyyy-MM-dd"))}</td>
        <td>${giorniCertificati}</td>
        <td>${dataInizio}</td>
        <td>${dataFineMalattia}</td> <!-- Assicurati che questo valore sia corretto -->
        <td>
          <button id="button-${doc.codiceFiscale}" class="btn btn-secondary shadow-sm btn-custom" data-codiceFiscale="${doc.codiceFiscale}">
            <i class="fas fa-arrow-right"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
  
      const buttonUser = document.getElementById(`button-${doc.codiceFiscale}`);
      buttonUser.addEventListener("click", () => {
        let codiceFiscaleCandidato = buttonUser.getAttribute("data-codiceFiscale");
       // console.log(codiceFiscaleCandidato);
        formCandidato(codiceFiscaleCandidato);
      });
    });
  }
  // Funzione helper per valori sicuri
  function safeValue(value) {
    if (value == null || value === "NaN-NaN-NaN") {
        return "";
    }
    return value;
}
  
  // Funzione per aggiungere giorni a una data
  // Funzione per aggiungere giorni a una data
  function addDaysToDate(dateString, days) {
    if (!dateString || isNaN(Date.parse(dateString))) {
      return "";
    }
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  }
  
  // Funzione per ottenere il valore di una colonna
  function getColumnValue(item, columnKey) {
    switch (columnKey) {
      case "codiceFiscale":
        return safeValue(item.codiceFiscale);
      case "nome":
        return safeValue(item.nome);
      case "cognome":
        return safeValue(item.cognome);
      case "prova":
        return safeValue(item.ultimoStep?.prova?.descrizione);
      case "esito":
        return safeValue(item.ultimoStep?.esito?.descrizione);
      case "dataProva":
        return safeValue(item.ultimoStep?.dataProva);
      case "giorniCertificati":
        return safeValue(item.ultimoStep?.assenzaGiustificata?.giorniCertificati);
      case "dataInizioMalattia":
        return safeValue(item.ultimoStep?.assenzaGiustificata?.dataInizioMalattia);
      case "dataFineMalattia":
        const dataInizio = item.ultimoStep?.assenzaGiustificata?.dataInizioMalattia;
        const giorniCertificati = item.ultimoStep?.assenzaGiustificata?.giorniCertificati;
        
        if (dataInizio && !isNaN(giorniCertificati)) {
          // Se dataInizio è un timestamp, convertilo in una data
          const data = new Date(parseInt(dataInizio, 10));
          if (isNaN(data.getTime())) {
            console.error("Data non valida:", dataInizio);
            return null;
          }
          data.setDate(data.getDate() + parseInt(giorniCertificati, 10));
         // console.log("Calcolo dataFineMalattia:", { dataInizio, giorniCertificati, dataFineMalattia: data }); // Debug
          const timestamp = new Date(data).getTime();
          return timestamp // Restituisce un oggetto Date
        }
        else{

          const data = new Date(parseInt(item.ultimoStep.dataProva, 10));
          data.setDate(data.getDate() + parseInt(1, 10));
         // console.log("Calcolo dataFineMalattia:", { dataInizio, dataFineMalattia: data }); // Debug
          const timestamp = new Date(data).getTime();
          
          
           return timestamp
            //console.log("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-",dataInizio)
          
        }
       // return null; // Restituisce null se i dati non sono validi
      default:
        return "";
    }
  }
  function formCandidato(codiceFiscale){
    const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
    const concorsoTipoProva = document.querySelector('script[type="module"]').getAttribute('tipoProva')
    const url = `/concorsi/gestioneProveCandidato?id=${concorsoId}&tipoProva=${concorsoTipoProva}&codiceFiscaleCandidato=${codiceFiscale}`; // Sostituisci con l'URL desiderato
    const windowFeatures = "width=800,height=1000,resizable,scrollbars";

    window.open(url, "_blank", windowFeatures);

};
function exportTableToExcel() {
  const tableData = [];

  // Recupera i dati dalla tabella
  const table = document.querySelector("#documentTable");
  const headers = Array.from(table.querySelectorAll("thead th"));
  const rows = Array.from(table.querySelectorAll("tbody tr"));

  // Aggiungi le intestazioni
  const headerRow = headers.map((header) => header.textContent.trim());
  tableData.push(headerRow);

  // Aggiungi i dati delle righe
  rows.forEach((row) => {
    const rowData = Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent.trim());
    tableData.push(rowData);
  });

  // Crea il foglio di lavoro e il file Excel
  const worksheet = XLSX.utils.aoa_to_sheet(tableData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tabella");

  // Salva il file Excel
  XLSX.writeFile(workbook, "Tabella.xlsx");
}
function checkTimestamp(value) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
     return true;
  }
  else{
    return false
  }
}
function checkISODateFormat(value) {
  const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  const datePattern = /^\d{4}-\d{1,2}-\d{1,2}$/;
  if (typeof value === "string" && isoPattern.test(value)||"string" && datePattern.test(value)) {
     return true
  }
}
