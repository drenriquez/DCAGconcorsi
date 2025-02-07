document.addEventListener("DOMContentLoaded", function () {
    function caricaInformazioni(idSezione, idInfo, datiSezioni) {
        const dati = datiSezioni[idSezione];
        let html = `
            <p><strong>Titolo:</strong> ${dati.titolo}</p>
            <p><strong>Verificato:</strong> ${dati.verificato ? "Sì" : "No"}</p>
            <p><strong>Numero Protocollo:</strong> ${dati.numeroProtocollo}</p>
            <p><strong>Data Protocollo:</strong> ${dati.dataProtocollo}</p>
        `;
        document.getElementById(idInfo).innerHTML = html;
    }

    const datiCartelle = {
        cartella1: { titolo: "Titolo Cartella 1", verificato: true, numeroProtocollo: "12345", dataProtocollo: "2023-10-26" },
        cartella2: { titolo: "Titolo Cartella 2", verificato: false, numeroProtocollo: "67890", dataProtocollo: "2023-10-27" }
    };
    
    const datiPreferenze = {
        opzione1: { titolo: "Titolo Opzione 1", verificato: true, numeroProtocollo: "54321", dataProtocollo: "2023-11-01" },
        opzione2: { titolo: "Titolo Opzione 2", verificato: false, numeroProtocollo: "98765", dataProtocollo: "2023-11-02" }
    };

    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener("shown.bs.tab", function (event) {
            const idSezione = event.target.getAttribute("data-bs-target").substring(1);
            const idInfo = "info" + idSezione.charAt(0).toUpperCase() + idSezione.slice(1);
            
            if (datiCartelle[idSezione]) {
                caricaInformazioni(idSezione, idInfo, datiCartelle);
            } else if (datiPreferenze[idSezione]) {
                caricaInformazioni(idSezione, idInfo, datiPreferenze);
            }
        });
    });

    caricaInformazioni("cartella1", "infoCartella1", datiCartelle);
    caricaInformazioni("cartella2", "infoCartella2", datiCartelle);
    caricaInformazioni("opzione1", "infoOpzione1", datiPreferenze);
    caricaInformazioni("opzione2", "infoOpzione2", datiPreferenze);
});