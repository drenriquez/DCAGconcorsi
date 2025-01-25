import { formatDate } from "../../utils/formatDate.js";
import { apiGraphQLgetAllUsers } from "../../utils/apiGraphql.js";

document.addEventListener("DOMContentLoaded", () => {
    initTable();
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
    ];
  
    // Aggiungi le icone di ordinamento e i listener
    headers.forEach((header, index) => {
      const columnKey = columns[index];
      const icon = document.createElement("i");
      icon.className = "fas fa-sort";
      icon.style.cursor = "pointer";
      header.appendChild(icon);
  
      // Aggiungi il listener di ordinamento per ciascuna colonna
      header.addEventListener("click", () => {
        sortTableByColumn(columnKey);
      });
    });
  
    try {
      await populateTable();  // Recupera e mostra i dati iniziali
    } catch (error) {
      console.error("Errore durante il caricamento della tabella:", error);
    }
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
    console.log("--------  data ",data)           
  
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
      
      console.log("-------- sortedData ",sortedData)    
    sortedData.forEach((doc) => {
      const assenza = doc.ultimoStep?.assenzaGiustificata || {};
      const dataInizio = safeValue(
        formatDate(parseInt(assenza.dataInizioMalattia, 10), false, false, "yyyy-MM-dd")
      );
      const giorniCertificati = safeValue(assenza.giorniCertificati);
      const dataFineMalattia = addDaysToDate(dataInizio, giorniCertificati);
  
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
        console.log(codiceFiscaleCandidato);
        formCandidato(codiceFiscaleCandidato)
      });
    });
  }
  
  // Funzione per ordinare i dati
  function sortTableByColumn(columnKey) {
    sortDirection[columnKey] = sortDirection[columnKey] === "asc" ? "desc" : "asc";
  
    sortedData.sort((a, b) => {
      let valA = getColumnValue(a, columnKey);
      let valB = getColumnValue(b, columnKey);
  
      // Se i valori sono oggetti Date, confrontali come Date
      if (valA instanceof Date && valB instanceof Date) {
        return sortDirection[columnKey] === "asc" ? valA - valB : valB - valA;
      }
  
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
  
    updateTableBody();  // aggiorna la tabella con i dati ordinati
  }
  
  // Funzione per aggiornare la tabella con i dati ordinati
  function updateTableBody() {
    const tbody = document.querySelector("#documentTable tbody");
    tbody.innerHTML = "";  // Svuota la tabella
  
    sortedData.forEach((doc) => {
      const assenza = doc.ultimoStep?.assenzaGiustificata || {};
      const dataInizio = safeValue(
        formatDate(parseInt(assenza.dataInizioMalattia, 10), false, false, "yyyy-MM-dd")
      );
      const giorniCertificati = safeValue(assenza.giorniCertificati);
      const dataFineMalattia = addDaysToDate(dataInizio, giorniCertificati);
  
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
        console.log(codiceFiscaleCandidato);
        formCandidato(codiceFiscaleCandidato)

      });
    });
  }
  
  // Funzione helper per valori sicuri
  function safeValue(value) {
    return value == null ? "" : value;
  }
  
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
        // Calcolare dataFineMalattia come oggetto Date
        const dataInizio = item.ultimoStep?.assenzaGiustificata?.dataInizioMalattia;
        const giorniCertificati = item.ultimoStep?.assenzaGiustificata?.giorniCertificati;
        if (dataInizio && !isNaN(giorniCertificati)) {
          const data = new Date(dataInizio);  // crea una data a partire dalla dataInizio
          data.setDate(data.getDate() + giorniCertificati);  // aggiungi i giorni certificati
          console.log(`dataFineMalattia: ${data}`);  // Aggiungi log per debug
          return data;  // ritorna un oggetto Date
        }
        return null;  // ritorna null se i dati non sono validi
      default:
        return "";
    }
  }
  function formCandidato(codiceFiscale){
    const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
    const concorsoTipoProva = document.querySelector('script[type="module"]').getAttribute('tipoProva')
    const url = `/gestioneProveCandidato?id=${concorsoId}&tipoProva=${concorsoTipoProva}&codiceFiscaleCandidato=${codiceFiscale}`; // Sostituisci con l'URL desiderato
    const windowFeatures = "width=800,height=600,resizable,scrollbars";

    window.open(url, "_blank", windowFeatures);

};