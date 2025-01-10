const UserDAO = require('./dao/UserDAO');
//const userDao=new UserDAO("350VF")

const resolvers = {
  getAllUsers: async ({concorso}) => {
    console.log("----test resolver getAllUsers-----",concorso)
    try {
        const userDao = new UserDAO(concorso);
        await userDao.initializeDatabase();
        const users = await userDao.getAllUsers();
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Unable to fetch users");
      }
    },

  getUserById: async ({ concorso,id }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();
    return await userDao.getUserById(id);
  },

  createUser: async ({ concorso, codiceFiscale, cognome, nome, dataNascita, comuneNascita }) => {
    const userDao = new UserDAO(concorso);
    const user = {
      codiceFiscale,
      cognome,
      nome,
      dataNascita: new Date(dataNascita).toISOString(),
      comuneNascita
    };
    await userDao.initializeDatabase();
    return await userDao.createUser(user);
  },

  deleteUser: async ({concorso, id }) => {
    const userDao = new UserDAO(concorso)
    await userDao.initializeDatabase();
    const success = await userDao.deleteUser(id);
    return success ? `User ${id} deleted` : `User not found`;
  },

  getUsersByBirthDate: async ({ concorso, filterDate }) => {
    const userDao = new UserDAO(concorso)
    console.log("----test resolver getUsersByBirthDate5-------")
    //return await userDao.getUsersByBirthDate(filterDate);
    await userDao.initializeDatabase();
    const result=await userDao.getUserByExactBirthDate(filterDate);
    console.log(result.length)
    return result
  },
  getUsersByBirthDateGreaterThan: async ({ concorso, filterDate }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();
    const result=await userDao.getUsersByBirthDateGreaterThan(concorso, filterDate);
    console.log(result.length);
    return result
  },
  getUsersByBirthDateGreaterThanOrEqual: async ({concorso, filterDate }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();
    const result=await userDao.getUsersByBirthDateGreaterThanOrEqual(concorso,filterDate);
    console.log(result.length);
    return result
  },
  getUsersByBirthDateLessThan: async ({ concorso,filterDate }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();
    const result=await userDao.getUsersByBirthDateLessThan(concorso,filterDate);
    console.log(result.length);
    return result
  },
  getUsersByBirthDateLessThanOrEqual: async ({concorso, filterDate }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();
    const result=await userDao.getUsersByBirthDateLessThanOrEqual(filterDate);
    console.log(result.length);
    return result
  },
  getUsersByBirthDateExact: async ({concorso, filterDate }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();
    const result=await userDao.getUsersByBirthDateExact(filterDate);
    console.log(result.length);
    return result
  },
  getUsersByBirthDateFilter: async ({ concorso, before, after }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();

    // Costruisci il filtro in base ai parametri ricevuti
    const filter = {};
    
    if (before) {
      const beforeDate = new Date(before);
      filter.dataNascita = { ...filter.dataNascita, $lt: beforeDate };
    }
    
    if (after) {
      const afterDate = new Date(after);
      filter.dataNascita = { ...filter.dataNascita, $gt: afterDate };
    }

    // Esegui la query
    const result = await userDao.collection.find(filter).toArray();
    console.log(result.length);
    return result;
  },
/*   getAllTitoliPreferenziali: async ({ concorso }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();

    const users = await userDao.collection.find({}).toArray();

    const titoliPreferenziali = new Set(); // Usando un Set per eliminare duplicati

    users.forEach(user => {
      // Verifica se esistono domande di concorso
      if (user.domandeConcorso && user.domandeConcorso.length > 0) {
        // Seleziona l'ultima domanda di concorso
        const ultimaDomanda = user.domandeConcorso[user.domandeConcorso.length - 1];
        // Verifica se l'ultima domanda ha titoli preferenziali
        if (ultimaDomanda.lstTitoliPreferenziali) {
          // Itera su tutti i titoli preferenziali dell'ultima domanda
          ultimaDomanda.lstTitoliPreferenziali.forEach(titolo => {
            titoliPreferenziali.add(titolo.descrizione);
          });
        }
      }
    });

    return Array.from(titoliPreferenziali); // Convertiamo il Set in array
  }, */
  getAllTitoliPreferenziali: async ({ concorso }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();
    // Chiama il metodo DAO per ottenere i titoli preferenziali
    return await userDao.getTitoliPreferenziali();
},
  /* getAllRiserve: async ({ concorso }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();

    const users = await userDao.collection.find({}).toArray();

    const riserve = new Set(); // Usando un Set per eliminare duplicati

    users.forEach(user => {
      // Verifica se esistono domande di concorso
      if (user.domandeConcorso && user.domandeConcorso.length > 0) {
        // Seleziona l'ultima domanda di concorso
        const ultimaDomanda = user.domandeConcorso[user.domandeConcorso.length - 1];
        // Verifica se l'ultima domanda ha riserve
        if (ultimaDomanda.lstRiserve) {
          // Itera su tutte le riserve dell'ultima domanda
          ultimaDomanda.lstRiserve.forEach(riserva => {
            riserve.add(riserva.descrizione);
          });
        }
      }
    });

    return Array.from(riserve); // Convertiamo il Set in array
  }, */
  getAllRiserve: async ({ concorso }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();

    // Chiama il metodo DAO per ottenere le riserve
    return await userDao.getRiserve();
},
  getCandidatiByRiserve: async ({ concorso, riserve }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();
    // Recupera tutti i candidati dalla collezione
    const users = await userDao.collection.find({}).toArray();
    // Lista dei candidati che hanno almeno una delle riserve specificate
    const candidatiConRiserva = [];
    // Itera su ogni utente
    users.forEach(user => {
      // Verifica se esistono domande di concorso
      if (user.domandeConcorso && user.domandeConcorso.length > 0) {
        // Seleziona l'ultima domanda di concorso
        const ultimaDomanda = user.domandeConcorso[user.domandeConcorso.length - 1];
        // Verifica se l'ultima domanda ha riserve
        if (ultimaDomanda.lstRiserve) {
          // Controlla se il candidato ha almeno una riserva presente nell'array di riserve passato
          const hasRiserva = ultimaDomanda.lstRiserve.some(riserva =>
            riserve.includes(riserva.descrizione) // Controlla se la riserva del candidato è nell'array fornito
          );
          if (hasRiserva) {
            candidatiConRiserva.push({
              codiceFiscale: user.codiceFiscale,
              cognome: user.cognome,
              nome: user.nome,
              dataNascita: user.dataNascita,
              comuneNascita: user.comuneNascita
            });
          }
        }
      }
    });

    return candidatiConRiserva; // Restituisce un array di candidati
},
  getCandidatiByTitoliPreferenziali: async ({ concorso, titoliPreferenziali }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();

    // Recupera tutti gli utenti dalla collezione
    const users = await userDao.collection.find({}).toArray();

    // Lista di candidati che hanno almeno uno dei titoli preferenziali
    const candidatiConTitoliPreferenziali = [];

    // Itera su ogni utente
    users.forEach(user => {
      // Verifica se esistono domande di concorso
      if (user.domandeConcorso && user.domandeConcorso.length > 0) {
        // Seleziona l'ultima domanda di concorso
        const ultimaDomanda = user.domandeConcorso[user.domandeConcorso.length - 1];
        // Verifica se l'ultima domanda ha titoli preferenziali
        if (ultimaDomanda.lstTitoliPreferenziali) {
          // Controlla se il candidato ha almeno uno dei titoli preferenziali nella lista fornita
          const hasTitolo = ultimaDomanda.lstTitoliPreferenziali.some(titolo =>
            titoliPreferenziali.includes(titolo.descrizione) // Verifica se la descrizione del titolo è inclusa nella lista passata
          );
          if (hasTitolo) {
            candidatiConTitoliPreferenziali.push({
              codiceFiscale: user.codiceFiscale,
              cognome: user.cognome,
              nome: user.nome,
              dataNascita: user.dataNascita,
              comuneNascita: user.comuneNascita
            });
          }
        }
      }
    });

    return candidatiConTitoliPreferenziali; // Restituisce un array di candidati
},
  /* getListaUnicaPatenti: async ({ concorso }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();

    const users = await userDao.collection.find({}).toArray();

    const patentiUniche = new Set(); // Utilizziamo un Set per evitare duplicati

    users.forEach(user => {
      // Verifica se esistono domande di concorso
      if (user.domandeConcorso && user.domandeConcorso.length > 0) {
        // Seleziona l'ultima domanda di concorso
        const ultimaDomanda = user.domandeConcorso[user.domandeConcorso.length - 1];
        // Verifica se l'ultima domanda ha patenti
        if (ultimaDomanda.lstPatenti) {
          // Itera su tutte le patenti dell'ultima domanda
          ultimaDomanda.lstPatenti.forEach(patente => {
            patentiUniche.add(patente.tipoPatente.tipo); // Aggiunge solo il tipo di patente
          });
        }
      }
    });
    return Array.from(patentiUniche); // Converte il Set in un array per la risposta
  }, */
  getListaUnicaPatenti: async ({ concorso }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();

    // Chiama il metodo DAO per ottenere le patenti uniche
    return await userDao.getPatentiUniche();
},
  getCandidatiByPatenti: async ({ concorso, patenti }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();

    // Recupera tutti i candidati dalla collezione
    const users = await userDao.collection.find({}).toArray();

    // Lista dei candidati che hanno almeno una delle patenti specificate
    const candidatiConPatente = [];

    // Itera su ogni utente
    users.forEach(user => {
      // Verifica se esistono domande di concorso
      if (user.domandeConcorso && user.domandeConcorso.length > 0) {
        // Seleziona l'ultima domanda di concorso
        const ultimaDomanda = user.domandeConcorso[user.domandeConcorso.length - 1];
        // Verifica se l'ultima domanda ha patenti
        if (ultimaDomanda.lstPatenti) {
          // Verifica se il candidato ha almeno una patente presente nell'array di patenti passate
          const hasPatente = ultimaDomanda.lstPatenti.some(patente =>
            patenti.includes(patente.tipoPatente.tipo) // Controlla se la patente del candidato è nell'array fornito
          );
          if (hasPatente) {
            candidatiConPatente.push({
              codiceFiscale: user.codiceFiscale,
              cognome: user.cognome,
              nome: user.nome,
              dataNascita: user.dataNascita,
              comuneNascita: user.comuneNascita
            });
          }
        }
      }
    });

    return candidatiConPatente; // Restituisce un array di candidati
},
/* getTipologieProve :async ({ concorso }) => {
  const userDao = new UserDAO(concorso); // Inizializzi il DAO per il concorso specificato
  await userDao.initializeDatabase();

  const users = await userDao.collection.find({}).toArray(); // Estrai tutti i documenti utenti dalla collezione
  //console.log(users);
  const tipologieProveUniche = new Set(); // Usa un Set per garantire che le prove siano uniche

  // Itera su ogni documento
  users.forEach(user => {
    const { iterConcorso } = user;

    if (iterConcorso && iterConcorso.length > 0) {
      iterConcorso.forEach(iter => {
        if (iter.prova && iter.prova.descrizione) {
          tipologieProveUniche.add(iter.prova.descrizione); // Aggiungi solo la descrizione della prova al Set
        }
      });
    }
  });

  return Array.from(tipologieProveUniche); // Converte il Set in un Array prima di restituirlo
}, */
getTipologieProve: async ({ concorso }) => {
  const userDao = new UserDAO(concorso);
  await userDao.initializeDatabase();

  // Chiama il metodo DAO per ottenere le tipologie di prove uniche
  return await userDao.getTipologieProveUniche();
},
getStatiCandidato: async ({ concorso }) => {
  const userDao = new UserDAO(concorso); // Inizializzi il DAO per il concorso specificato
  await userDao.initializeDatabase();

  const users = await userDao.collection.find({}).toArray(); // Estrai tutti i documenti utenti dalla collezione
  const statiCandidatoUnici = new Set(); // Usa un Set per garantire che gli stati siano unici

  // Itera su ogni documento
  users.forEach(user => {
    if (user.statoCandidato) { // Verifica che lo statoCandidato esista nel documento
      statiCandidatoUnici.add(user.statoCandidato); // Aggiungi lo statoCandidato al Set
    }
  });

  return Array.from(statiCandidatoUnici); // Converte il Set in un Array prima di restituirlo
},
/* getEsitiByProva: async ({ concorso, tipoProva }) => {
  const userDao = new UserDAO(concorso);
  await userDao.initializeDatabase();

  // Recupera tutti i candidati dalla collezione per il concorso specificato
  const users = await userDao.collection.find({}).toArray();

  // Set per memorizzare gli esiti unici
  const esitiSet = new Set();

  // Itera su ogni utente
  users.forEach(user => {
    if (user.iterConcorso && user.iterConcorso.length > 0) {
      // Filtra gli step dell'iter concorso che corrispondono al tipo di prova
      user.iterConcorso.forEach(step => {
        if (step.prova.descrizione === tipoProva && step.esito && step.esito.descrizione) {
          esitiSet.add(step.esito.descrizione); // Aggiungi l'esito al set (evita duplicati)
        }
      });
    }
  });

  // Converte il set in un array e lo restituisce
  return Array.from(esitiSet);
}, */
getEsitiByProva: async ({ concorso, tipoProva }) => {
  const userDao = new UserDAO(concorso);
  await userDao.initializeDatabase();

  // Chiama il metodo DAO per ottenere gli esiti unici
  return await userDao.getEsitiByProva(tipoProva);
},
/* getDateProveByTipoProva: async ({ concorso, tipoProva }) => {
  const userDao = new UserDAO(concorso);
  await userDao.initializeDatabase();

  // Recupera tutti gli utenti dalla collezione per il concorso specificato
  const users = await userDao.collection.find({}).toArray();

  // Set per memorizzare le date uniche delle prove senza orario
  const dateProvaSet = new Set();

  // Funzione per normalizzare la data
  const normalizeDate = (dateInput) => {
    // Se la data è un oggetto MongoDB
    if (dateInput && typeof dateInput === 'object' && '$date' in dateInput) {
      return new Date(dateInput.$date);
    }
    // Se è un numero, assume che sia un timestamp
    if (typeof dateInput === 'number') {
      return new Date(dateInput);
    }
    return dateInput; // In caso di altri formati, restituisce il valore originale
  };

  // Itera su ogni utente
  users.forEach(user => {
    if (user.iterConcorso && user.iterConcorso.length > 0) {
      // Filtra gli step dell'iter concorso che corrispondono al tipo di prova
      user.iterConcorso.forEach(step => {
        if (step.prova.descrizione === tipoProva && step.dataProva) {
          const normalizedDate = normalizeDate(step.dataProva);

          // Normalizza la data per considerare solo giorno, mese e anno
          const dateKey = normalizedDate.toISOString().split('T')[0]; // Ottieni solo la parte della data (YYYY-MM-DD)

          // Aggiungi la data normalizzata al set (evita duplicati)
          dateProvaSet.add(dateKey);
        }
      });
    }
  });

 
  return Array.from(dateProvaSet).sort((a, b) => new Date(a) - new Date(b));
}, */
getDateProveByTipoProva: async ({ concorso, tipoProva }) => {
  const userDao = new UserDAO(concorso);
  await userDao.initializeDatabase();

  // Chiama il metodo DAO per ottenere le date delle prove uniche
  return await userDao.getDateProveByTipoProva(tipoProva);
},

/* getCandidatiByCriteria: async ({ concorso, riserve, titoliPreferenziali, patenti, statoCandidato }) => {
  const userDao = new UserDAO(concorso);
  await userDao.initializeDatabase();
  // Recupera tutti i candidati dalla collezione
  const users = await userDao.collection.find({}).toArray();
  // Lista dei candidati che soddisfano i criteri
  const candidati = [];
  // Itera su ogni utente
  users.forEach(user => {
    let meetsCriteria = true; // Inizializza la variabile come true
    // Verifica se esistono domande di concorso
    if (user.domandeConcorso && user.domandeConcorso.length > 0) {
      // Seleziona l'ultima domanda di concorso
      const ultimaDomanda = user.domandeConcorso[user.domandeConcorso.length - 1];   
      let hasRiserva = true;
      let hasTitoloPreferenziale = true;
      let hasPatente = true;
      let hasStatoCandidato = true; // Variabile per lo statoCandidato 
      // Controllo delle riserve, se presente il parametro
      if (riserve && riserve.length > 0) {
        hasRiserva = ultimaDomanda.lstRiserve 
          ? ultimaDomanda.lstRiserve.some(r => riserve.includes(r.descrizione)) 
          : false;
      }  
      // Controllo dei titoli preferenziali, se presente il parametro
      if (titoliPreferenziali && titoliPreferenziali.length > 0) {
        hasTitoloPreferenziale = ultimaDomanda.lstTitoliPreferenziali 
          ? ultimaDomanda.lstTitoliPreferenziali.some(t => titoliPreferenziali.includes(t.descrizione))
          : false;
      }
      // Controllo delle patenti, se presente il parametro
      if (patenti && patenti.length > 0) {
        hasPatente = ultimaDomanda.lstPatenti
          ? ultimaDomanda.lstPatenti.some(p => patenti.includes(p.tipoPatente.tipo))
          : false;
      }
      // Controllo dello statoCandidato, se presente il parametro
      if (statoCandidato && statoCandidato.length > 0) {
        hasStatoCandidato = statoCandidato.includes( user.statoCandidato );
      }
      // Se l'utente soddisfa tutte le condizioni, impostiamo meetsCriteria a true
      meetsCriteria = hasRiserva && hasTitoloPreferenziale && hasPatente && hasStatoCandidato;
    }
    // Se il candidato soddisfa i criteri, lo aggiungiamo alla lista
    if (meetsCriteria) {
      candidati.push({
        codiceFiscale: user.codiceFiscale,
        cognome: user.cognome,
        nome: user.nome,
        dataNascita: user.dataNascita,
        comuneNascita: user.comuneNascita
      });
    }
  });
  
  return candidati; // Restituisce un array di candidati che soddisfano i criteri
}, */
 /**
     * Trova i candidati in base ai criteri di ricerca passati( JSDoc)
     * @param {Array} riserve - Lista delle riserve da cercare
     * @param {Array} titoliPreferenziali - Lista dei titoli preferenziali
     * @param {Array} patenti - Lista delle patenti
     * @param {Array} statoCandidato - Lista degli stati candidato
     * @returns {Array} candidati che soddisfano i criteri
     */
getCandidatiByCriteria: async ({ concorso, riserve, titoliPreferenziali, patenti, tipoProve, esitiProve, dateProve, statoCandidato, nome,cognome,codiceFiscale,BirthDateGreaterThanOrEqual,BirthDateLessThanOrEqual }) => {
    const userDao = new UserDAO(concorso);
    await userDao.initializeDatabase();

    // Chiama il metodo DAO per ottenere i candidati in base ai criteri specificati
    return await userDao.getCandidatiByCriteria({ riserve, titoliPreferenziali, patenti, tipoProve, esitiProve, dateProve, statoCandidato,nome,cognome,codiceFiscale,BirthDateGreaterThanOrEqual,BirthDateLessThanOrEqual  });
},
getAllFields: async ({ concorso }) => {
  const userDao = new UserDAO(concorso);
  await userDao.initializeDatabase();
  return await userDao.getAllFields();
},
getSimpleFields: async ({ concorso }) => {
  const userDao = new UserDAO(concorso);
  await userDao.initializeDatabase();
  return await userDao.getSimpleFields();
},
getAllCampiDomandeConcorso: async ({ concorso }) => {
  const userDao = new UserDAO(concorso);
  await userDao.initializeDatabase();
  return await userDao.getAllCampiDomandeConcorso();
},
getStepsByProvaByCandidato: async ({ concorso,codiceFiscale, tipoProva }) => {
  const userDao = new UserDAO(concorso);
  await userDao.initializeDatabase();

  // Chiama il metodo DAO per ottenere le date delle prove uniche
  return await userDao.getStepsByProvaByCandidato(codiceFiscale, tipoProva);
},


};

module.exports = resolvers;
