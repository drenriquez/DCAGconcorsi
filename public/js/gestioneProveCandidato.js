import { apiGraphQLgetAllUsers } from "../../utils/apiGraphql.js";
import { generaTabulatiProveMotorie } from "../../utils/proveTabulatiGenerator.js"
import { formatDate } from "../../utils/formatDate.js"
import  esitiProveList  from "../../utils/esitiProveList.js"
//import flatpickr from "flatpickr";

document.addEventListener("DOMContentLoaded", async () => {
  const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
  const concorsoTipoProva = document.querySelector('script[type="module"]').getAttribute('tipoProva');
  const codiceFiscale = document.querySelector('script[type="module"]').getAttribute('codiceFiscaleCandidato');
  
  const nomeProva = `${concorsoTipoProva}`;
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
let notExistLastStep=true;
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
  const userCodFisc = document.querySelector('script[type="module"]').getAttribute('userCodFisc');
  const livelloUser = document.querySelector('script[type="module"]').getAttribute('livelloUser');
 // console.log('---------- ',userCodFisc,livelloUser)
  const container = document.getElementById("steps-container");
  container.innerHTML = ""; // Svuota il contenitore

  steps.forEach((step, index) => {
      const stepCard = document.createElement("div");
      stepCard.className = "card card-relative";
      let formattedDateMalattia=""
      let formattedDataProtocollo=""
      let numeroProtocollo=""
      let note=""
      if(step?.note){
       note=step.note
      }
      if(step?.assenzaGiustificata?.numeroProtocollo){
        numeroProtocollo=step?.assenzaGiustificata?.numeroProtocollo
      }
      //const dataMal=new Date( parseInt(step.assenzaGiustificata?.dataInizioMalattia, 10));
      if(step?.assenzaGiustificata?.dataInizioMalattia){
        formattedDateMalattia=formatDate(parseInt(step.assenzaGiustificata?.dataInizioMalattia, 10),false, false,"yyyy-MM-dd");
      }
      if(step?.assenzaGiustificata?.dataProtocollo){
        formattedDataProtocollo=formatDate(parseInt(step.assenzaGiustificata?.dataProtocollo, 10),false, false,"yyyy-MM-dd");
      }
      const formattedDateProva = formatDate( step.dataProva,true, false,"yyyy-MM-dd");
      const isAssenzaGiustificata = step.esito.descrizione === "ASSENTE GIUSTIFICATO";
      const showExtraStepButton = ["ANTICIPO/POSTICIPO", "ASSENTE GIUSTIFICATO", "PROVA SOSPESA", "INFORTUNATO", "ULTERIORI ACCERTAMENTI"].includes(step.esito.descrizione);
      const showPunteggio = ["SUPERATA","NON SUPERATA"].includes(step.esito.descrizione);
      const isLastStep= ((index+1)===steps.length )?true:false;
      //if(((index+1)===steps[steps.length - 1]['idStep'])){}
      console.log('steps',steps, 'steps.length: ',steps.length)//TODO
      //console.log('steps.length: ',steps[steps.lenght - 1]['idStep'],' index+1: ',index+1)
      console.log('isLastStep: ',isLastStep,'  showExtraStepButton:',showExtraStepButton)
      
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
    <div class="mb-3" id="punteggio-fields-${index}" style="display:${showPunteggio  ? "block" : "none"};">
      <label class="form-label"><strong>Punteggio:</strong></label>
      <div class="d-flex gap-2">
        <input 
          type="number" 
          id="punteggio-intero-${index}" 
          class="form-control" 
          placeholder="Intero" 
          value="${step.punteggio ? Math.floor(step.punteggio) : ""}" 
        />
        <input 
          type="number" 
          id="punteggio-decimale-${index}" 
          class="form-control" 
          placeholder="Decimali" 
          value="${step.punteggio ? Math.round((step.punteggio % 1) * 100) : ""}" 
        />
      </div>
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
      <div class="mb-3">
        <label for="numeroProtocollo-${index}" class="form-label"><strong>Numero Protocollo:</strong></label>
        <textarea id="numeroProtocollo-${index}" class="form-control">${numeroProtocollo}</textarea>
      </div>
      <div class="mb-3">
        <label for="data-dataProtocollo-${index}" class="form-label"><strong>Data Protocollo:</strong></label>
        <input type="date" id="data-dataProtocollo-${index}" class="form-control" value="${formattedDataProtocollo || ""}" />
      </div>
    </div>
    <div class="mb-3">
      <label for="note-${index}" class="form-label"><strong>Note:</strong></label>
      <textarea id="note-${index}" class="form-control">${step.note}</textarea>
    </div>
    <button class="btn btn-secondary" id="buttonAddStep-${index}" style="display:${showExtraStepButton && isLastStep ? "block" : "none"};">Aggiungi Step Successivo</button>
    <button class="btn btn-danger edit-button" id="buttonModificaStep-${index}" style="display:${isLastStep ? "block" : "none"};">Modifica Step</button>
  </div>
`;

      container.appendChild(stepCard);
      
      const buttonAddStep = document.getElementById(`buttonAddStep-${index}`);
      buttonAddStep.addEventListener('click', () => {
        aggiungiStep(index,step);
        buttonAddStep.style.display = "none"
      })
      const buttonModificaStep = document.getElementById(`buttonModificaStep-${index}`);
      buttonModificaStep.addEventListener('click', () => {
        modificaStep(index,step);
      })

      // Event listener per mostrare/nascondere i campi aggiuntivi
      document.getElementById(`esito-${index}`).addEventListener("change", (event) => {
          const value = event.target.value;
          const showExtraStepButton = ["ANTICIPO/POSTICIPO", "ASSENTE GIUSTIFICATO", "PROVA SOSPESA", "INFORTUNATO", "ULTERIORI ACCERTAMENTI"].includes(event.target.value);
          const showPunteggio = ["SUPERATA","NON SUPERATA"].includes(event.target.value);
          //const isLastStep= index+1===steps[steps.length - 1]['idStep']?true:false;
          const isLastStep= ((index+1)===steps.length )?true:false;
          //console.log('----------',isLastStep, index, isLastStep)
          const extraFields = document.getElementById(`assenza-giustificata-fields-${index}`);
          //punteggio-fields-${index}
          const punteggioFields = document.getElementById(`punteggio-fields-${index}`);
          console.log('addEventListener in isLastStep: ',isLastStep,'  showExtraStepButton:',showExtraStepButton)
          if (value === "ASSENTE GIUSTIFICATO") {
              extraFields.style.display = "block";
          } else {
              extraFields.style.display = "none";
          }
          if(showExtraStepButton && isLastStep && notExistLastStep){
            buttonAddStep.style.display= "block"
            
              
          }
          else{
            buttonAddStep.style.display= "none"
          }
          if(showPunteggio){
            punteggioFields.style.display="block"
          }
          else{
            punteggioFields.style.display="none"
          }

          
      });
  });
}

// Funzione per gestire la modifica di uno step
function modificaStep(index,step) {
  const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
  const concorsoTipoProva = document.querySelector('script[type="module"]').getAttribute('tipoProva');
  console.log('stampa step dentro function modificaStep, step prima della modifica',step)
  const dataProva = document.getElementById(`data-prova-${index}`).value;
  const esito = document.getElementById(`esito-${index}`).value;
  let note = null
  let statoCandidato=step.esito.statoCandidato;
  let categoria=null;
  let notaObbligatoria=step.esito.notaObbligatoria;
  let iSassenzaGiustificata=null;
  let punteggio=getPunteggio(index)
  let cFTipoProva=step.cFTipoProva;
  let cFTipoEsito=document.querySelector('script[type="module"]').getAttribute('userCodFisc');
  if(step?.esito?.categoria){
    categoria=step.esito.categoria
  }


  let dataProvaUTC = new Date(dataProva);
    
  // Regola il fuso orario 
 
  //const localOffset = dateProvaUTC.getTimezoneOffset() * 60000; // Offset in millisecondi
 // dateProvaUTC = new Date(dateProvaUTC.getTime() + localOffset); // Regola la data
  //dateProvaUTC=formatDate(dateProvaUTC,true,false,'dd-MM-yyyy')
  dataProvaUTC=dataProvaUTC.toISOString(); // Converte la data in formato ISO 8601


  const extraFields = document.getElementById(`assenza-giustificata-fields-${index}`);
  let dataInizioMalattia = null;
  let giorniCertificati = null;
  let numeroProtocollo=null
  let dataProtocollo=null

  if (esito === "ASSENTE GIUSTIFICATO") {
      dataInizioMalattia = document.getElementById(`data-inizio-malattia-${index}`).value;
      giorniCertificati = document.getElementById(`giorni-certificati-${index}`).value;
      numeroProtocollo=document.getElementById(`numeroProtocollo-${index}`).value;
      dataProtocollo=document.getElementById(`data-dataProtocollo-${index}`).value
      iSassenzaGiustificata=true
      note = document.getElementById(`note-${index}`).value;
  }

  console.log(`Modifica Step ${step.idStep}, indice nel frontEnd (indexStep) ${index}:`, { dataProvaUTC, esito, note, dataInizioMalattia, giorniCertificati,numeroProtocollo,dataProtocollo,categoria });
  mutationStep(concorsoId,concorsoTipoProva,esito,step.idStep,dataProvaUTC,categoria,statoCandidato,notaObbligatoria,iSassenzaGiustificata,dataInizioMalattia,giorniCertificati,numeroProtocollo,dataProtocollo,punteggio,cFTipoProva,cFTipoEsito,note)//.then(()=>{window.location.reload()});
  // Qui puoi fare una chiamata API per aggiornare i dati nel backend
}
async function mutationStep(concorsoId,concorsoTipoProva,esito,idStep,dataProva,categoria,statoCandidato,notaObbligatoria,iSassenzaGiustificata,dataInizioMalattia,giorniCertificati,numeroProtocollo,dataProtocollo,punteggio,cFTipoProva,cFTipoEsito,note){
  let mutation=""
  if(!iSassenzaGiustificata){ 
    mutation= `mutation {
                    addOrUpdateStep(
                      concorso: ${JSON.stringify(concorsoId)}
                      codiceFiscale: "BTAPTR04M18C421S-------"
                      provaDescrizione: ${JSON.stringify(concorsoTipoProva)}
                      idStep: ${JSON.stringify(idStep)}
                      stepData: {
                        dataProva: ${JSON.stringify(dataProva)}
                        prova: {
                          descrizione:${JSON.stringify(concorsoTipoProva)}
                          categoria:${JSON.stringify(categoria)}
                        }
                        esito: {
                          descrizione:${JSON.stringify(esito)}
                          categoria: ${JSON.stringify(categoria)}
                          statoCandidato: ${JSON.stringify(statoCandidato)}
                          notaObbligatoria: ${JSON.stringify(notaObbligatoria)}
                        }
                        punteggio: ${punteggio}
                        linkAllegati: null
                        assenzaGiustificata:${iSassenzaGiustificata}
                        cFTipoProva:  ${JSON.stringify(cFTipoProva)}
                        cFTipoEsito:${JSON.stringify(cFTipoEsito)}
                        note: ${JSON.stringify(note)}
                      }
                    ) {
                      idStep
                      dataProva
                      punteggio
                      linkAllegati
                      cFTipoProva
                      cFTipoEsito
                      note
                    }
                  }`
  }
  else{
    mutation=
    `mutation {
                    addOrUpdateStep(
                      concorso: ${JSON.stringify(concorsoId)}
                      codiceFiscale: "BTAPTR04M18C421S-------"
                      provaDescrizione: ${JSON.stringify(concorsoTipoProva)}
                      idStep: ${JSON.stringify(idStep)}
                      stepData: {
                        dataProva: ${JSON.stringify(dataProva)}
                        prova: {
                          descrizione:${JSON.stringify(concorsoTipoProva)}
                          categoria:${JSON.stringify(categoria)}
                        }
                        esito: {
                          descrizione:${JSON.stringify(esito)}
                          categoria: ${JSON.stringify(categoria)}
                          statoCandidato: ${JSON.stringify(statoCandidato)}
                          notaObbligatoria: ${JSON.stringify(notaObbligatoria)}
                        }
                        punteggio: ${punteggio}
                        linkAllegati: null
                        assenzaGiustificata:{
                          dataInizioMalattia:${JSON.stringify(dataInizioMalattia)}
                          giorniCertificati:${giorniCertificati}
                          numeroProtocollo:${JSON.stringify(numeroProtocollo)}
                          dataProtocollo:${JSON.stringify(dataProtocollo)}
                        }
                        cFTipoProva:  ${JSON.stringify(cFTipoProva)}
                        cFTipoEsito:${JSON.stringify(cFTipoEsito)}
                        note: ${JSON.stringify(note)}
                      }
                    ) {
                      idStep
                      dataProva
                      punteggio
                      linkAllegati
                      cFTipoProva
                      cFTipoEsito
                      note
                    }
                  }`

  }
                  const response = await apiGraphQLgetAllUsers(mutation);
                  console.log("----------------------- MUTATION ",mutation)
                  console.log("----------------------- MUTATION RESULT",response)//ASSENTE GIUSTIFICATO
}

// Funzione per aggiungere uno step successivo
async function aggiungiStep(index,step) {
  const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
  const concorsoTipoProva = document.querySelector('script[type="module"]').getAttribute('tipoProva');
  let queryGetEsitiProveData=`
      query {
          getDateProveByTipoProva(concorso: "${concorsoId}",tipoProva:"${concorsoTipoProva}")
      }
      `;
      const responseDateProva = await apiGraphQLgetAllUsers(queryGetEsitiProveData);
      let listaDateProve=responseDateProva['data']['getDateProveByTipoProva'].map((res)=>{
        return  formatDate( res.split('|')[0],true, true,"yyyy-MM-dd");
      })
      console.log(listaDateProve)
 
 notExistLastStep=false;
  console.log('dentro la aggiungiStep, step :',step)
  modificaStep(index,step);
  const buttonModificaStep = document.getElementById(`buttonModificaStep-${index}`);
  buttonModificaStep.style.display = "none"
    const container = document.getElementById("steps-container");

    // Calcola il numero del nuovo step basato sugli step esistenti
    const currentSteps = container.querySelectorAll(".card");
    const newStepNumber = currentSteps.length + 1;//${newStepNumber}

    const newStepCard = document.createElement("div");
    newStepCard.className = "card card-relative";

    newStepCard.innerHTML = `
      <div class="card-header step-header">Step ${newStepNumber}</div>
      <div class="card-body">

    <div class="mb-3">
      <label for="data-prova-${newStepNumber}" class="form-label"><strong>Data e Ora Prova (fra le prove già calendarizzate da data Fine Malattia):</strong></label>
      <input type="datetime-local" id="data-prova-${newStepNumber}" class="form-control" />
      <div class="mb-3">
            <label for="timeSelect" class="form-label">Seleziona un orario</label>
            <select id="timeSelect" class="form-select">
                
            </select>
        </div>
    </div>    

    <div class="mb-3">
      <input type="checkbox" id="toggle-input-${newStepNumber}" />
      <label for="toggle-input-${newStepNumber}">Mostra tutti giorni</label>
    </div>
        <div class="mb-3">
          <label for="esito-${newStepNumber}" class="form-label"><strong>Esito:</strong></label>
          <select id="esito-${newStepNumber}" class="form-control">
            ${esitiProveList.map(option => `<option value="${option}">${option}</option>`)
              .join("")}
          </select>
        </div>
        <div id="assenza-giustificata-fields-${newStepNumber}" style="display: none;">
          <div class="mb-3">
            <label for="data-inizio-malattia-${newStepNumber}" class="form-label"><strong>Data Inizio Malattia:</strong></label>
            <input type="date" id="data-inizio-malattia-${newStepNumber}" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="giorni-certificati-${newStepNumber}" class="form-label"><strong>Giorni Certificati:</strong></label>
            <input type="number" id="giorni-certificati-${newStepNumber}" class="form-control" />
          </div>
          <div class="mb-3">
        <label for="numeroProtocollo-${newStepNumber}" class="form-label"><strong>Numero Protocollo:</strong></label>
        <textarea id="numeroProtocollo-${newStepNumber}" class="form-control"></textarea>
      </div>
      <div class="mb-3">
        <label for="data-dataProtocollo-${newStepNumber}" class="form-label"><strong>Data Protocollo:</strong></label>
        <input type="date" id="data-dataProtocollo-${newStepNumber}" class="form-control" value=""}" />
      </div>
        </div>
        <div class="mb-3">
          <label for="note-${newStepNumber}" class="form-label"><strong>Note:</strong></label>
          <textarea id="note-${newStepNumber}" class="form-control"></textarea>
        </div>
        <button class="btn customC-btn"  id="buttonSalvaStep-${newStepNumber}">Salva Step</button>
      </div>
    `;
  //   <div class="mb-3">
  //   <label for="data-prova" class="form-label"><strong>Data e Ora Prova:</strong></label>
  //   <input type="text" id="data-prova" class="form-control" />
  // </div>    
    container.appendChild(newStepCard);
    const buttonSalvaStep = document.getElementById(`buttonSalvaStep-${newStepNumber}`);
    buttonSalvaStep.addEventListener('click', () => {
     console.log("button salvaStep step n: ",newStepNumber);
    });

    let formattedDataMalattia=formatDate(parseInt(step.assenzaGiustificata?.dataInizioMalattia, 10),false, false,"yyyy-MM-dd");
    //console.log("-*-*-*-*-*-*-*-*-",formattedDataMalattia,step.assenzaGiustificata.giorniCertificati)
    if (formattedDataMalattia == null || formattedDataMalattia === "NaN-NaN-NaN") {
      formattedDataMalattia=step.dataProva;
  }
    let giorniCertificati=step.assenzaGiustificata?step.assenzaGiustificata.giorniCertificati:1
    //console.log("-*-*-*-*-*-*-*-*-",formattedDataMalattia,giorniCertificati)
    let formattedDataFineMalattia=addDaysToDate(formattedDataMalattia,giorniCertificati)
    // Gestione del cambio del campo "Data e Ora Prova"
    let dataMinima=formattedDataFineMalattia||step.dataProva
    document.querySelector(`#toggle-input-${newStepNumber}`).addEventListener('change', function (event) {
      const parent = document.querySelector(`#data-prova-${newStepNumber}`).parentElement;
      //let dataMinima=formattedDataFineMalattia||step.dataProva
      console.log('-*********---****',dataMinima)
      if (event.target.checked) {
        // Sostituisci con un campo di testo
        parent.innerHTML = `
        <label for="data-prova-${newStepNumber}" class="form-label"><strong>Data e Ora Prova da Data Fine Malattia:</strong></label>
        <input type="datetime-local" id="data-prova-${newStepNumber}" class="form-control" />
       <div class="mb-3">
            <label for="timeSelect" class="form-label">Seleziona un orario</label>
            <select id="timeSelect" class="form-select" defoult="08:00">
                
            </select>
        </div>
      `;
        // Array di orari predefiniti
        const predefinedTimes = [
          "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", 
          "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", 
          "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
          "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", 
          "19:00", "19:30", "20:00"
      ];

      // Seleziona l'elemento <select>
      const timeSelect = document.getElementById("timeSelect");

      // Genera le opzioni dinamicamente
      predefinedTimes.forEach(time => {
          const option = document.createElement("option");
          option.value = time;
          option.textContent = time;
          timeSelect.appendChild(option);
      });
      // Riapplica Flatpickr al nuovo input
      flatpickr(`#data-prova-${newStepNumber}`, {
        //enable: ["2025-01-29", "2025-02-05", "2025-02-12"], // Date evidenziate
        minDate: dataMinima,
        dateFormat: "Y-m-d", // Formato della data con ora e minuti
        //enableTime: true, // Abilita la selezione dell'ora
        noCalendar: false, // Mostra il calendario
        //time_24hr: true, // Usa il formato 24 ore
        //defaultDate: dataMinima // Imposta la data e ora predefiniti (esempio: 29 gennaio 2025 alle 14:30)
      
      });
      
      } else {
        // Ripristina il campo datetime-local
        parent.innerHTML = `
          <label for="data-prova-${newStepNumber}" class="form-label"><strong>Data e Ora Prova (fra le prove già calendarizzate da data Fine Malattia):</strong></label>
          <input type="datetime-local" id="data-prova-${newStepNumber}" class="form-control" />
          <div class="mb-3">
            <label for="timeSelect" class="form-label">Seleziona un orario</label>
            <select id="timeSelect" class="form-select">
                
            </select>
        </div>
        `;
       
        //dateInputRinvio.addEventListener("change", handleDateSelection);
        // Riapplica Flatpickr al nuovo input
        flatpickr(`#data-prova-${newStepNumber}`, {
          dateFormat: "Y-m-d", // Formato della data con ora e minuti
          //enableTime: true, // Abilita la selezione dell'ora
          noCalendar: false, // Mostra il calendario
          //time_24hr: true, // Usa il formato 24 ore
          //defaultDate: dataMinima,// Imposta data e ora predefiniti con orario
          // Imposta la data e ora predefiniti (esempio: 29 gennaio 2025 alle 14:30)
          minDate: dataMinima,
          enable: listaDateProve,//["2025-01-29", "2025-02-05", "2025-02-12"], // Date evidenziate
        });
        let dateInputRinvio = document.getElementById(`data-prova-${newStepNumber}`);
        dateInputRinvio.addEventListener("change", (event)=>{
          let predefinedTimes=handleDateSelection(event,event.target.value,listaDateProve,)
          /* const predefinedTimes = [
            "08:00",
            "09:30",
            "11:00",
            "13:00",
            "15:30",
            "18:00"
        ]; */
        // Seleziona l'elemento <select>
          const timeSelect = document.getElementById("timeSelect");
          timeSelect.innerHTML = "";
          // Genera le opzioni dinamicamente
          predefinedTimes.forEach(time => {
              const option = document.createElement("option");
              option.value = time;
              option.textContent = time;
              timeSelect.appendChild(option);
          });
        });
        // Array di orari predefiniti
      }
    });
    // Event listener per mostrare/nascondere i campi aggiuntivi
    document.getElementById(`esito-${newStepNumber}`).addEventListener("change", (event) => {
        const value = event.target.value;
        const extraFields = document.getElementById(`assenza-giustificata-fields-${newStepNumber}`);
        if (["ANTICIPO/POSTICIPO", "ASSENTE GIUSTIFICATO", "PROVA SOSPESA", "INFORTUNATO", "ULTERIORI ACCERTAMENTI"].includes(value)) {
            extraFields.style.display = "block";
        } else {
            extraFields.style.display = "none";
        }
    });

    
  flatpickr(`#data-prova-${newStepNumber}`, {
     
      dateFormat: "Y-m-d", // Formato della data con ora e minuti
      //enableTime: true, // Abilita la selezione dell'ora
      noCalendar: false, // Mostra il calendario
      //time_24hr: true, // Usa il formato 24 ore
      //defaultDate: dataMinima,// Imposta data e ora predefiniti con orario
      // Imposta la data e ora predefiniti (esempio: 29 gennaio 2025 alle 14:30)
      minDate: dataMinima,
      enable: listaDateProve,//["2025-01-29", "2025-02-05", "2025-02-12"], // Date evidenziate
    });

    let dateInputRinvio = document.getElementById(`data-prova-${newStepNumber}`);
    dateInputRinvio.addEventListener("change", (event)=>{
      let predefinedTimes=handleDateSelection(event,event.target.value,listaDateProve,)
      /* const predefinedTimes = [
        "08:00",
        "09:30",
        "11:00",
        "13:00",
        "15:30",
        "18:00"
    ]; */
    // Seleziona l'elemento <select>
      const timeSelect = document.getElementById("timeSelect");
      timeSelect.innerHTML = "";
      // Genera le opzioni dinamicamente
      predefinedTimes.forEach(time => {
          const option = document.createElement("option");
          option.value = time;
          option.textContent = time;
          timeSelect.appendChild(option);
      });
    });
    // Array di orari predefiniti
    
  //console.log('lista delle prove',listaDateProve)
  
}
function handleDateSelection(event,dataSelected,dataList) {
  const selectedDate = event.target.value; // Ottieni il valore della data selezionata
  let resultList=getTimesForDate(dataList,dataSelected)
  console.log("Data selezionata:", selectedDate, "lista orari",resultList);
  return resultList
  // Esegui qui ulteriori azioni (esempio: aggiornare un altro campo o fare una richiesta API)
}
function getTimesForDate(dataList, targetDate) {
  // Filtra la lista per ottenere solo gli orari della data specificata
  return dataList
      .filter(entry => entry.startsWith(targetDate)) // Filtra per la data
      .map(entry => entry.split(" ")[1]); // Estrai solo l'orario
}
function getPunteggio(index) {
  const intero = document.getElementById(`punteggio-intero-${index}`).value;
  const decimale = document.getElementById(`punteggio-decimale-${index}`).value;

  // Verifica se entrambi i campi sono riempiti
  if (!intero && !decimale) {
    return null;
  }

  const interoVal = parseInt(intero) || 0;
  const decimaleVal = parseInt(decimale) || 0;

  // Assembla il punteggio come numero con due decimali
  const punteggio = interoVal + decimaleVal / 100;
  return parseFloat(punteggio.toFixed(2));
};
// Funzione per aggiungere giorni a una data
function addDaysToDate(dateString, days) {
  if (!dateString || isNaN(Date.parse(dateString))) {
    return "";
  }
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}
