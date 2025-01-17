function formatDate(dateString, includeTime = false, adjustTimezone = false, format = 'dd-MM-yyyy') {
    // Crea un oggetto Date dal valore passato
    let date = new Date(dateString);
    
    // Regola il fuso orario se richiesto
    if (adjustTimezone) {
        const localOffset = date.getTimezoneOffset() * 60000; // Offset in millisecondi
        date = new Date(date.getTime() - localOffset); // Regola la data
    }

    // Ottieni giorno, mese e anno
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mesi da 0 a 11
    const year = date.getFullYear();
    
    // Variabile per la data formattata
    let formattedDate = '';

    // Determina il formato richiesto
    switch (format) {
        case 'yyyy-MM-dd':
            formattedDate = `${year}-${month}-${day}`;
            break;
        case 'dd-MM-yyyy':
        default:
            formattedDate = `${day}-${month}-${year}`;
            break;
    }

    // Aggiungi l'ora se richiesto
    if (includeTime) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        formattedDate += ` ${hours}:${minutes}`;
    }

    return formattedDate;
}

export {
    formatDate
};

