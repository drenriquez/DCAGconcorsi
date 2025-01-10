import { apiGraphQLgetAllUsers } from "../../utils/apiGraphql.js";
import { generaTabulatiProveMotorie } from "../../utils/proveTabulatiGenerator.js"
import { formatDate } from "../../utils/formatDate.js"

  document.addEventListener("DOMContentLoaded", async () => {
    const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
    const concorsoTipoProva = document.querySelector('script[type="module"]').getAttribute('tipoProva');
    const codiceFiscale =document.querySelector('script[type="module"]').getAttribute('codiceFiscaleCandidato'); // Sostituisci con il CF reale
    const nomeProva = "PROVA MOTORIO-ATTITUDINALE"; // Sostituisci con il nome della prova reale
    console.log(concorsoId,concorsoTipoProva, codiceFiscale)
    document.getElementById("nome-prova").textContent = nomeProva;
    const queryCandidato=`query {
        getCandidatiByCriteria(concorso:"350VVF",codiceFiscale:"${codiceFiscale}") {
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
      } `

    const query = `
    query {
        getStepsByProvaByCandidato(concorso: "${concorsoId}", codiceFiscale: "${codiceFiscale}", tipoProva: "${concorsoTipoProva}")
        {
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
    }
        `
    const responseCandidato = await apiGraphQLgetAllUsers(queryCandidato);
    const candidato=responseCandidato['data']['getCandidatiByCriteria'][0];
    console.log(candidato)
    const dati = await apiGraphQLgetAllUsers(query);
    console.log("***********************",dati['data']['getStepsByProvaByCandidato'])
    popolaDatiCandidato(candidato);
    
   
    popolaSteps(dati['data']['getStepsByProvaByCandidato']);
    
    //console.log(response)
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
      console.log("---------------------",step.esito)
      // Estrai la data e l'ora, formattando correttamente (YYYY-MM-DDTHH:mm)
      const formattedDateTime = new Date(step.dataProva).toISOString().slice(0, 16); // Esclude i secondi e millisecondi

      stepCard.innerHTML = `
        <div class="card-header step-header">Step ${index + 1}</div>
        <div class="card-body">
          <div class="mb-3">
            <label for="data-prova-${index}" class="form-label"><strong>Data e Ora Prova:</strong></label>
            <input type="datetime-local" id="data-prova-${index}" class="form-control" value="${formattedDateTime}" />
          </div>
          <div class="mb-3">
            <label for="esito-${index}" class="form-label"><strong>Esito:</strong></label>
            <input type="text" id="esito-${index}" class="form-control" value="${step.esito.descrizione}" />
          </div>
          <div class="mb-3">
            <label for="note-${index}" class="form-label"><strong>Note:</strong></label>
            <textarea id="note-${index}" class="form-control">${step.note}</textarea>
          </div>
          <button class="btn btn-primary edit-button" onclick="modificaStep(${index})">Modifica Step</button>
        </div>
      `;
      container.appendChild(stepCard);
    });
}

  // Funzione per gestire la modifica di uno step
  function modificaStep(index) {
    const dataProva = document.getElementById(`data-prova-${index}`).value;
    const esito = document.getElementById(`esito-${index}`).value;
    const note = document.getElementById(`note-${index}`).value;

    console.log(`Modifica Step ${index + 1}:`, { dataProva, esito, note });
    // Qui puoi fare una chiamata API per aggiornare i dati nel backend
  }

 