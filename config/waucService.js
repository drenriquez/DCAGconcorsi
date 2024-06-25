async function servizioWAUC(username) {
    //console.log("+++++++++++++++++servizio wauc username", username);
    const baseUrl = 'https://wauc.dipvvf.it/api/';
    const accountName = username;
    const url = `${baseUrl}personale/?accountName=${accountName}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        //console.log(data);
        return data; // Restituisci i dati ricevuti
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error; // Rilancia l'errore per essere gestito dal chiamante
    }
}

  
  module.exports = servizioWAUC;