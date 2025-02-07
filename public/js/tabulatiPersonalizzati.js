import { formatDate } from "../../utils/formatDate.js"
import { generaTabulatiProveMotorie } from "../../utils/proveTabulatiGenerator.js"
document.addEventListener("DOMContentLoaded", async () => {  
    
    

    const concorsoId = document.querySelector('script[type="module"]').getAttribute('concorsoId');
    const concorsoTipoProva = document.querySelector('script[type="module"]').getAttribute('tipoProva');
    const concorsoDataProva = document.querySelector('script[type="module"]').getAttribute('dataProva');


    document.getElementById('exportPdfBtn').addEventListener('click',()=>{
        generatorePDF(concorsoId,concorsoTipoProva)
        console.log('test exportPdfBtn')
    } ); 


    console.log('-----test inserimento prove------')
    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                usersData=jsonToObject(json)

                displayExcelData(json);
            };
            reader.readAsArrayBuffer(file);
        }
    });
});
let usersData=['null']
function displayExcelData(data) {
    const container = document.getElementById('excelData');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'table table-bordered';

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    if (data.length > 0) {
        const headerRow = document.createElement('tr');
        data[0].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        for (let i = 1; i < data.length; i++) {
            const row = document.createElement('tr');
            data[i].forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
    }

    container.appendChild(table);

   
}

function jsonToObject(dati){
   /*  const dati = [
        ['PROVA MOTORIO-ATTITUDINALE_350VVF__05-02-2025 08:00', '', '', '', ''],
        [],
        ['#', 'cognome', 'nome', 'codiceFiscale', 'dataNascita'],
        ['1', 'ABBATIELLO', 'LORENZO', 'BBTLNZ04S14F839Q', '14-11-2004', ''],
        ['2', 'AGNUZZI', 'ANGELO', 'GNZNGL01R11H501R', '11-10-2001', ''],
        ['3', 'ALBANESE', 'FEDERICA', 'LBNFRC05R71A662J', '31-10-2005', ''],
        ['4', 'ALEO NERO', 'ANTONIO', 'LNRNTN04L13G273D', '13-07-2004', ''],
        ['5', 'ALIMENTI', 'TOMMASO', 'LMNTMS04L21G478N', '21-07-2004', ''],
        ['6', 'AMATI', 'ALESSANDRO', 'MTALSN99R14G942C', '14-10-1999', ''],
        ['7', 'AMMOSCATO', 'ALESSANDRO', 'MMSLSN03A15A176P', '15-01-2003', ''],
        ['8', 'ANDRIOLO', 'ANTONINO', 'NDRNNN98S26G348P', '26-11-1998', ''],
        ['9', 'BALDINI', 'SARA', 'BLDSRA92H69A940H', '29-06-1992', ''],
        ['10', 'BALDISSEROTTO', 'MARCO', 'BLDMRC98P27A459W', '27-09-1998', ''],
        ['11', 'CARADONNA', 'SAMUELE', 'CRDSML99H21H700U', '21-06-1999']
    ]; */
    
    // Estrai le chiavi
    const chiavi = dati[2].slice(1); // Ignora il primo elemento '#'
    
    // Crea l'array di oggetti
    const risultato = dati.slice(3).map(riga => {
        const oggetto = {};
        chiavi.forEach((chiave, index) => {
            oggetto[chiave] = riga[index + 1]; // +1 per saltare il primo elemento (l'indice)
        });
        return oggetto;
    });
    
    return risultato;
}

function generatorePDF(concorsoId,concorsoTipoProva){


 let dataProva = document.querySelector('script[type="module"]').getAttribute('dataProva');
 let dateProve=[dataProva]

    const requiredKeys = ['cognome', 'nome', 'dataNascita'];
    if(hasKeys(usersData[0], requiredKeys)){
        console.log('hasKeys(usersData[0], requiredKeys ) true')
        if(dateProve.length===1){
            console.log('dateProve lunghezza 1')
            
            const testDati=flattenAndFormatDates(usersData);
            const filteredList = filterFields(usersData, requiredKeys);//non serve più, TODO
            const filterListFormattedDate= formatDatesInObjects(filteredList, "")
          //  ////console.log("///////////////////////", testDati)
            console.log('---**-*-*-*testDati-*-*-dopo flattenAndFormatDates',testDati)
            //////console.log('prova dati formattati:',testDati);
            let dataP =  formatDate(dateProve[0].split('|')[0],true, true);//.// Restituisce la parte della data in -> gg-mm-aaaa hh:mm
           // console.log('dataP ',dataP)
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