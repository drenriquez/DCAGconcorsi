// ldapService.js
require('dotenv').config({path:'../.env'});
const ldap = require('ldapjs');

async function ldapServerAuth(username, password) {
  return new Promise((resolve, reject) => {
    const ldap_server = process.env.LDAP_SERVER;
    //console.log("++++++ serverldap ", ldap_server);
   // console.log("++++ username ", username);
   

    const client = ldap.createClient({
      url: ldap_server,
      tlsOptions: {
        rejectUnauthorized: false, // Disabilita la verifica del certificato (solo per sviluppo)
      },
    });

    username = username + "@dipvvf.it";
    console.log("---------------------- username ", username);

    client.bind(username, password, (err,risp) => {
      if (err) {
        console.error('LDAP bind error:', err);
        reject(err); // Reject se c'è un errore
      } else {
        console.log('LDAP bind successful');//risp
       // servizioWAUC(username);
        //define('WS_WAUC',  'https://wauc.dipvvf.it/api/');        // ESERCIZIO
       /*  per effettuare una richiesta HTTP GET a un servizio web.
         L'URL del servizio web viene costruito concatenando la costante WS_WAUC con la stringa "personale/?accountName="
          e l'username (privato del dominio @dipvvf.it).
         La costante WS_WAUC dovrebbe essere definita altrove nel codice e rappresenta la base URL del servizio web.
        Esempio di URL:
        Se WS_WAUC fosse "http://example.com/api/" e $_SESSION["ReferralSeed"] fosse "username@dipvvf.it", l'URL costruito sarebbe:
        
        http://example.com/api/personale/?accountName=username
 */




        // Puoi eseguire altre operazioni LDAP qui
        // Chiudi la connessione LDAP quando hai finito
        client.unbind((unbindErr) => {
          if (unbindErr) {
            console.error('LDAP unbind error:', unbindErr);
            reject(unbindErr); // Reject se c'è un errore durante l'unbind
          } else {
            console.log('LDAP connection closed');
            client.on('close',(clos)=>{console.log('xxxxxxxx LDAP connection closed',clos);});
          
            resolve(true); // Risolve con true se l'autenticazione è riuscita
          }
        });
      }
    });
  });
}
function servizioWAUC(usernameDipvvf){//tipo enrico.notaro
  // Definisci l'URL del servizio web con il parametro accountName
  let username = usernameDipvvf.replace("@dipvvf.it", "");
  console.log("+++++++++++++++++servizio wauc username",username)
  const baseUrl = 'https://wauc.dipvvf.it/api/';
  const accountName = username; // Sostituisci 'username' con il valore reale
  const url = `${baseUrl}personale/?accountName=${accountName}`;

  // Effettua la chiamata fetch
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Gestisci i dati ricevuti
      // Ad esempio, puoi aggiornare l'interfaccia utente con i dati dell'utente
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

module.exports = ldapServerAuth;