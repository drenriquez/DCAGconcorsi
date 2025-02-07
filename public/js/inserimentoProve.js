import { apiGraphQLgetAllUsers } from "../../utils/apiGraphql.js";

document.addEventListener("DOMContentLoaded", async () => {  
    
    console.log('test inserimento prove');
    let correctedData=[]
    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 0, defval: "" });

                // Corregge le date nei dati JSON
                 correctedData = json.map(row => {
                    Object.keys(row).forEach(key => {
                        if (!isNaN(row[key]) && row[key] > 30000 && row[key] < 50000) {  
                            const date = XLSX.SSF.parse_date_code(row[key]);
                            if (date) {
                                row[key] = `${String(date.y).padStart(2, '0')}-${String(date.m).padStart(2, '0')}-${date.d} ${String(date.H).padStart(2, '0')}:${String(date.M).padStart(2, '0')}:${String(date.S).padStart(2, '0')}`;
                            }
                        }
                    });
                    return row;
                });
                console.log(correctedData)

                displayExcelData(correctedData);
            };
            reader.readAsArrayBuffer(file);
        }
    });
    
    document.getElementById("btnInserimento").addEventListener("click",()=>{
      inviaEsiti(correctedData);  
    })
    document.getElementById("btnReport").addEventListener("click",()=>{
       console.log(report);  
      })
});
let result=[]
async function inviaEsiti(correctedData){
    const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
    const userCodFisc = document.querySelector('script[type="module"]').getAttribute('userCodFisc');  
    
    //console.log(correctedData)
    let categoria="PROVA";
    let statoCandidato="AMMESSO";
    let notaObbligatoria=false;
    let iSassenzaGiustificata=null;
    let dataInizioMalattia=null;
    let giorniCertificati=null;
    let numeroProtocollo=null;
    let dataProtocollo=null;
    let note=null;
   
    
    correctedData.forEach((row)=>{
        let dataProvaUTC = new Date(row.DataProva);
        dataProvaUTC=dataProvaUTC.toISOString(); // Converte la data in formato ISO 8601

        if(row.DescTipoProva==="VISITA MEDICA"){
            categoria=0;
        }
        console.log(row.DataProva, "data convertita", dataProvaUTC);
        result.push(mutationStep(concorsoId,
            row.DescTipoProva,
            row.DescTipoEsito,
            row.CodiceFiscale,
            dataProvaUTC,
            categoria,
            statoCandidato,
            notaObbligatoria,
            iSassenzaGiustificata,
            dataInizioMalattia,
            giorniCertificati,
            numeroProtocollo,
            dataProtocollo,
            row.Punteggio,
            userCodFisc,
            userCodFisc,
            note))
    })
}

function displayExcelData(data) {
    const container = document.getElementById('excelData');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'table table-bordered';

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    if (data.length > 0) {
        const headerRow = document.createElement('tr');
        Object.keys(data[0]).forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    }

    container.appendChild(table);
}
let report=[];
async function mutationStep(concorsoId,concorsoTipoProva,esito,codiceFiscale,dataProva,categoria,statoCandidato,notaObbligatoria,iSassenzaGiustificata,dataInizioMalattia,giorniCertificati,numeroProtocollo,dataProtocollo,punteggio,cFTipoProva,cFTipoEsito,note){
   
    let mutation=""
    if(!iSassenzaGiustificata){ 
      mutation= `mutation {
                      addOrUpdateStepByDataProva(
                        concorso: ${JSON.stringify(concorsoId)}
                        codiceFiscale: ${JSON.stringify(codiceFiscale)}
                        provaDescrizione: ${JSON.stringify(concorsoTipoProva)}
                        dataProva: ${JSON.stringify(dataProva)}
                        stepData: {
                          dataProva:${JSON.stringify(dataProva)}
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
                          punteggio: ${JSON.stringify(punteggio)}
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
                      addOrUpdateStepByDataProva(
                        concorso: ${JSON.stringify(concorsoId)}
                        codiceFiscale:${JSON.stringify(codiceFiscale)}
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
                          punteggio: ${null}
                          linkAllegati: null
                          assenzaGiustificata:{
                            dataInizioMalattia:${JSON.stringify(convertToISO(dataInizioMalattia))||null}
                            giorniCertificati:${giorniCertificati||null}
                            numeroProtocollo:${JSON.stringify(numeroProtocollo)||null}
                            dataProtocollo:${JSON.stringify(dataProtocollo)||null}
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
                  

/*     console.log("----------------------- MUTATION respone: ",response['errors'],
      'dataInizioMAlattia',dataInizioMalattia,
      'dataProva',dataProva
    
    ) *///ASSENTE GIUSTIFICATO
     if(response.errors){
        report.push(`${codiceFiscale}-${response.errors[0].message}-`)
        console.log("----------------------- MUTATION ",report)
        return false
     }
     else{
        console.log("----------------------- MUTATION ",response)
        report.push(`${codiceFiscale}-inserimento prova candidato avvenuto correttamente-`)
        return true
     }
}
