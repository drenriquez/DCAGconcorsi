import { APIgetAllConcorsiEsterni } from "../../utils/apiUtils.js";
import { apiGraphQLgetAllUsers } from "../../utils/apiGraphql.js";

document.addEventListener('DOMContentLoaded', async function () {
    let concorsiList = await getConcorsiEsterniList();
    await generatePage(concorsiList);
});

async function getConcorsiEsterniList() {
    const hostApi = document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    const concorsiEsterniList = await APIgetAllConcorsiEsterni(hostApi);
    console.log(concorsiEsterniList, "test concorsiesterni.js");
    return concorsiEsterniList;
}

// Funzione per generare l'intera pagina dinamicamente
async function generatePage(concorsi) {
    const container = document.createElement('div');
    container.className = 'container mt-4';

    const column = document.createElement('div');
    column.id = 'cardContainer';
    column.className = 'col-md-12 d-flex flex-column align-items-start cardCont';

    container.appendChild(column);
    document.body.appendChild(container);

    // Genera tutte le card
    concorsi.forEach(concorso => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${concorso.nome}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${concorso.data}</h6>
                <p class="card-text">${concorso.descrizione}</p>
                <button type="button" class="btn btn-primary bold gestioneBtn" 
                        data-id="${concorso.nomeCollection}" 
                        id="button-${concorso.nomeCollection}">GESTIONE</button>
            </div>
        `;
        column.appendChild(card);
    });

    // Aggiungi evento per il click sui bottoni "GESTIONE"
    document.querySelectorAll('.gestioneBtn').forEach(button => {
        button.addEventListener('click', function () {
            const concorsoId = this.getAttribute('data-id');
            window.location.href = `/gestioneConcorsi?id=${concorsoId}`;
        });
    });

    // Aggiungi i pulsanti per le prove dopo che tutte le card sono state generate
    const promises = concorsi.map(concorso => {
             aggiungiPulsanteProve(concorso.nomeCollection, "PROVA MOTORIO-ATTITUDINALE", "PROVE MOTORIE", `button-${concorso.nomeCollection}`,`btn btn-danger`);
             aggiungiPulsanteProve(concorso.nomeCollection, "VISITA MEDICA","VISITA MEDICA", `button-${concorso.nomeCollection}`,`btn btn-warning`);
             aggiungiPulsanteProve(concorso.nomeCollection, "PROVA ORALE","PROVA ORALE", `button-${concorso.nomeCollection}`,`btn btn-success`)
        }
    );

    await Promise.all(promises); // Attendi che tutte le chiamate siano completate
    console.log("Tutti i pulsanti delle prove sono stati aggiunti.");
}

// Funzione per generare i pulsanti per la gestione delle prove
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

