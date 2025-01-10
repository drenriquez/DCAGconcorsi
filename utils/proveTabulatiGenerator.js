//const jsPDF = require('jspdf').jsPDF;
//import jsPDF from 'jspdf'

export function generaTabulatiProveMotorie(concorsoId,concorsoTipoProva,dataProva,intestazioneColonne,larghColonne,xLineeVerticali,dati) {
    const doc = new jsPDF({ orientation: 'landscape' }); // Modificato per layout orizzontale
    const paginaLarghezza = 297; // A4 width in mm per layout orizzontale
    const paginaAltezza = 210; // A4 height in mm per layout orizzontale
    const margine = 10;
    const altezzaLinea = 10;
    const larghezzeColonne = larghColonne; // Definito a livello globale

    // Funzione per disegnare l'intestazione con sfondo grigio
    function disegnaIntestazione(yCorrente) {
        const intestazione = intestazioneColonne
        // Disegna sfondo grigio per l'intestazione
        doc.setFillColor(200, 200, 200); // Grigio chiaro
        doc.rect(margine, yCorrente - altezzaLinea + 2, paginaLarghezza - 2 * margine, altezzaLinea, 'F');

        let xCorrente = margine;
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        intestazione.forEach((testo, i) => {
            doc.text(testo, xCorrente, yCorrente);
            xCorrente += larghezzeColonne[i];
        });

        // Disegna linea sotto l'intestazione
        doc.setDrawColor(0);
        doc.line(margine, yCorrente + 2, paginaLarghezza - margine, yCorrente + 2);

        return yCorrente + altezzaLinea;
    }

    // Funzione per disegnare il numero di pagina
    function disegnaNumeroPagina(numeroPagina, totalePagine) {
        doc.setFont('Helvetica', 'italic');
        doc.setFontSize(8);
        doc.text(`Pagina ${numeroPagina} di ${totalePagine}`, paginaLarghezza - margine - 30, paginaAltezza - margine);
    }

    let yCorrente = margine + 20; // Posizione iniziale dopo il titolo
    let numeroPagina = 1;
    const totalePagine = Math.ceil(dati.length / 16); // Calcolo pagine per massimo 16 righe per pagina

    // Disegna intestazione iniziale
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    const titolo = `${concorsoId} Tabulato Identificazione ${concorsoTipoProva} del ${dataProva}`;
    
    // Calcola la larghezza del testo per centrarlo
    const larghezzaTitolo = doc.getTextWidth(titolo);
    const xPos = (paginaLarghezza - larghezzaTitolo) / 2;
    
    doc.text(titolo, xPos, margine);

    yCorrente = disegnaIntestazione(yCorrente);

    // Riempire i dati della tabella
    dati.forEach((item, index) => {
        if (yCorrente > paginaAltezza - margine - 20) { // Gestire nuova pagina se spazio insufficiente
            disegnaNumeroPagina(numeroPagina, totalePagine);
            numeroPagina++;
            doc.addPage();
            yCorrente = margine + 20;
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(14);
            const titolo = `${concorsoId} Tabulato Identificazione ${concorsoTipoProva} del ${dataProva}`;
    
            // Calcola la larghezza del testo per centrarlo
            const larghezzaTitolo = doc.getTextWidth(titolo);
            const xPos = (paginaLarghezza - larghezzaTitolo) / 2;
            
            doc.text(titolo, xPos, margine);
        
            yCorrente = disegnaIntestazione(yCorrente);
        }
    
        let xCorrente = margine;
        const valori = [
            index + 1,
            item.cognome,
            item.nome,
            item.dataNascita,
            '', // DOCUMENTO vuoto
            '', // PROVA 1 vuoto
            '', // PROVA 2 vuoto
            ''  // PROVA 3 vuoto
        ];
    
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        valori.forEach((valore, i) => {
            if (typeof valore === 'string') {
                // Dividi il testo se supera la larghezza disponibile
                const larghezzaCella = larghezzeColonne[i];
                const testoDiviso = doc.splitTextToSize(valore, larghezzaCella);
    
                // Scrivi il testo riga per riga nella cella
                testoDiviso.forEach((linea, j) => {
                    doc.text(String(linea), xCorrente, yCorrente + (j * altezzaLinea));
                });
    
                // Aggiorna yCorrente solo se necessario
                const altezzaTesto = testoDiviso.length * altezzaLinea;
                yCorrente += altezzaTesto - altezzaLinea; // Sottrai per evitare spazio doppio
            } else {
                doc.text(String(valore), xCorrente, yCorrente);
            }
            xCorrente += larghezzeColonne[i];
        });
    
        // Disegna linea orizzontale sotto ogni riga
        doc.setDrawColor(150); // Colore grigio
        doc.line(margine, yCorrente + 2, paginaLarghezza - margine, yCorrente + 2);
    
        // Disegna righe verticali fino alla riga con dati
        const colonneVerticali = xLineeVerticali; // Colonne DOCUMENTO, PROVA 1, PROVA 2, PROVA 3
        colonneVerticali.forEach((x) => {
            doc.line(x + margine, yCorrente - altezzaLinea + 5, x + margine, yCorrente + 2);
            // doc.line(x + margine, yCorrente - altezzaLinea + 2, x + margine, yCorrente + 2);
        });
    
        yCorrente += altezzaLinea;
    });

    // Disegna numero pagina finale
    disegnaNumeroPagina(numeroPagina, totalePagine);

    // Salvare il file PDF in download
    doc.save(`tabulato${concorsoId}_${dataProva}.pdf`);
}

// Esempio di utilizzo
const listaDati = [
    { cognome: 'Ferracatena', nome: 'Francesco', dataNascita: '08/03/1999' },
    { cognome: 'Breci', nome: 'Alfio', dataNascita: '01/07/1996' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ferracatena', nome: 'Francesco', dataNascita: '08/03/1999' },
    { cognome: 'Breci', nome: 'Alfio', dataNascita: '01/07/1996' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ferracatena', nome: 'Francesco', dataNascita: '08/03/1999' },
    { cognome: 'Breci', nome: 'Alfio', dataNascita: '01/07/1996' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ferracatena', nome: 'Francesco', dataNascita: '08/03/1999' },
    { cognome: 'Breci', nome: 'Alfio', dataNascita: '01/07/1996' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },
    { cognome: 'Ciampa', nome: 'Dolores', dataNascita: '29/08/1992' },

    // Aggiungere altri dati...
];

//generaPDF(listaDati);
