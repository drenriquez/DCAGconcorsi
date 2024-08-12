import { APIgetAllConcorsiEsterni } from "../../utils/apiUtils.js";

document.addEventListener('DOMContentLoaded', async function() {
    const concorsi = [//esempio di struttura della collection
        {
            "_id": { "$oid": "66ab434edc45054b7dfae0cd" },
            "nome": "350 VVF",
            "nomeCollection": "350VF",
            "data": "20/06/2024",
            "descrizione": "concorso pubblico, per titoli ed esami, a 350 posti nella qualifica di vigile del fuoco del Corpo nazionale dei vigili del fuoco.",
            "order": "0"
        },
        {
            "_id": { "$oid": "66ab434edc45054b7dfae0ce" },
            "nome": "189 ISPETTORE LOGISTICO GESTIONALE",
            "nomeCollection": "189ILG",
            "data": "18/10/2023",
            "descrizione": "concorso pubblico, per esami, a 189 posti nella qualifica di ispettore logistico gestionale del Corpo nazionale dei vigili del fuoco.",
            "order": "1"
        }
        // Aggiungi altri oggetti qui se necessario
    ];
    let concorsiList=await getConcorsiEsterniList()
    generatePage(concorsiList);
})
async function getConcorsiEsterniList() {
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    const concorsiEsterniList=await APIgetAllConcorsiEsterni(hostApi)
    console.log(concorsiEsterniList,"test  concorsiesterni.js")
    return concorsiEsterniList
    
}


// Funzione per generare l'intera pagina dinamicamente
async function generatePage(concorsi) {
    // Creazione del container principale
    const container = document.createElement('div');
    container.className = 'container mt-4';

    // Creazione della colonna per le card
    const column = document.createElement('div');
    column.id = 'cardContainer';
    column.className = 'col-md-12 d-flex flex-column align-items-start cardCont';

    // Inserimento della colonna nel container
    container.appendChild(column);

    // Aggiunta del container al body della pagina
    document.body.appendChild(container);
    console.log("********",concorsi)
    // Generazione delle card dinamicamente
    concorsi.forEach(concorso => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${concorso.nome}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${concorso.data}</h6>
                <p class="card-text">${concorso.descrizione}</p>
                <button type="button" class="btn btn-primary bold" id="aggiungiUtente">GESTIONE</button>
                <button type="submit" class="btn btn-secondary bold">CONSULTAZIONE</button>
            </div>
        `;
        // Aggiunta della card alla colonna
        column.appendChild(card);
    });
}