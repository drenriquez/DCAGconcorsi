import { apiGraphQLgetAllUsers } from "../../utils/apiGraphql.js";
import { generaTabulatiProveMotorie } from "../../utils/proveTabulatiGenerator.js"
import { formatDate } from "../../utils/formatDate.js"
import  esitiProveList  from "../../utils/esitiProveList.js"

document.addEventListener("DOMContentLoaded", async () => {
  const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
  const concorsoTipoProva = document.querySelector('script[type="module"]').getAttribute('tipoProva');
  const codiceFiscale = document.querySelector('script[type="module"]').getAttribute('codiceFiscaleCandidato');
  const nomeProva = "PROVA MOTORIO-ATTITUDINALE";
  document.getElementById("nome-prova").textContent = nomeProva;

  const queryCandidato = `query {
      getCandidatiByCriteria(concorso:"${concorsoId}", codiceFiscale:"${codiceFiscale}") {
        _id
        codiceFiscale
        cognome
        nome
        dataNascita
        statoDomanda
        statoCandidato
        dataUltInvioDomanda
        annullaDomanda
      }
    }`;

  const query = `
  query {
      getStepsByProvaByCandidato(concorso: "${concorsoId}", codiceFiscale: "${codiceFiscale}", tipoProva: "${concorsoTipoProva}") {
          idStep
          dataProva
          esito {
              categoria
              descrizione
              statoCandidato
              notaObbligatoria
          }
          punteggio
          linkAllegati
          assenzaGiustificata {
              dataInizioMalattia
              giorniCertificati
              numeroProtocollo
              dataProtocollo
              note
          }
          cFTipoProva
          cFTipoEsito
          note
      }
  }`;

  const responseCandidato = await apiGraphQLgetAllUsers(queryCandidato);
  console.log(responseCandidato)
  const candidato = responseCandidato['data']['getCandidatiByCriteria'][0];

  const dati = await apiGraphQLgetAllUsers(query);
  console.log(candidato)
  popolaDatiCandidato(candidato);
  popolaSteps(dati['data']['getStepsByProvaByCandidato']);
});

// Funzione per popolare i dati del candidato
function popolaDatiCandidato(candidato) {
  const container = document.getElementById("candidato-info");
  container.innerHTML = `
    <p><strong>Nome:</strong> ${candidato.nome}</p>
    <p><strong>Cognome:</strong> ${candidato.cognome}</p>
    <p><strong>Codice Fiscale:</strong> ${candidato.codiceFiscale}</p>
  `;
}

// Funzione per popolare i dati degli step
function popolaSteps(steps) {
  const container = document.getElementById("steps-container");
  container.innerHTML = ""; // Svuota il contenitore

  steps.forEach((step, index) => {
      const stepCard = document.createElement("div");
      stepCard.className = "card card-relative";
      let formattedDateMalattia=""
      //const dataMal=new Date( parseInt(step.assenzaGiustificata?.dataInizioMalattia, 10));
      if(step?.assenzaGiustificata?.dataInizioMalattia){
        formattedDateMalattia=formatDate(parseInt(step.assenzaGiustificata?.dataInizioMalattia, 10),false, false,"yyyy-MM-dd");
      }
      const formattedDateProva = formatDate( step.dataProva,true, false,"yyyy-MM-dd");
      const isAssenzaGiustificata = step.esito.descrizione === "ASSENTE GIUSTIFICATO";
      stepCard.innerHTML = `
        <div class="card-header step-header">Step ${index + 1}</div>
        <div class="card-body">
          <div class="mb-3">
            <label for="data-prova-${index}" class="form-label"><strong>Data e Ora Prova:</strong></label>
            <input type="datetime-local" id="data-prova-${index}" class="form-control" value="${formattedDateProva}" />
          </div>
          <div class="mb-3">
            <label for="esito-${index}" class="form-label"><strong>Esito:</strong></label>
            <select id="esito-${index}" class="form-control">
              ${esitiProveList.map(option => `<option value="${option}" ${option === step.esito.descrizione ? "selected" : ""}>${option}</option>`).join("")}
            </select>
          </div>
          <div id="assenza-giustificata-fields-${index}" style="display: ${isAssenzaGiustificata ? "block" : "none"};">
            <div class="mb-3">
              <label for="data-inizio-malattia-${index}" class="form-label"><strong>Data Inizio Malattia:</strong></label>
              <input type="date" id="data-inizio-malattia-${index}" class="form-control" value="${formattedDateMalattia || ""}" />
            </div>
            <div class="mb-3">
              <label for="giorni-certificati-${index}" class="form-label"><strong>Giorni Certificati:</strong></label>
              <input type="number" id="giorni-certificati-${index}" class="form-control" value="${step.assenzaGiustificata?.giorniCertificati || ""}" />
            </div>
          </div>
          <div class="mb-3">
            <label for="note-${index}" class="form-label"><strong>Note:</strong></label>
            <textarea id="note-${index}" class="form-control">${step.note}</textarea>
          </div>
          <button class="btn btn-primary edit-button" onclick="modificaStep(${index})">Modifica Step</button>
        </div>
      `;

      container.appendChild(stepCard);

      // Event listener per mostrare/nascondere i campi aggiuntivi
      document.getElementById(`esito-${index}`).addEventListener("change", (event) => {
          const value = event.target.value;
          const extraFields = document.getElementById(`assenza-giustificata-fields-${index}`);
          if (value === "ASSENTE GIUSTIFICATO") {
              extraFields.style.display = "block";
          } else {
              extraFields.style.display = "none";
          }
      });
  });
}

// Funzione per gestire la modifica di uno step
function modificaStep(index) {
  const dataProva = document.getElementById(`data-prova-${index}`).value;
  const esito = document.getElementById(`esito-${index}`).value;
  const note = document.getElementById(`note-${index}`).value;

  const extraFields = document.getElementById(`assenza-giustificata-fields-${index}`);
  let dataInizioMalattia = "";
  let giorniCertificati = "";

  if (esito === "ASSENTE GIUSTIFICATO") {
      dataInizioMalattia = document.getElementById(`data-inizio-malattia-${index}`).value;
      giorniCertificati = document.getElementById(`giorni-certificati-${index}`).value;
  }

  console.log(`Modifica Step ${index + 1}:`, { dataProva, esito, note, dataInizioMalattia, giorniCertificati });
  // Qui puoi fare una chiamata API per aggiornare i dati nel backend
}
