const { buildSchema } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

// Definizione dello schema GraphQL
const schema = buildSchema(`
  scalar DateTime

  type Query {
   """Ottiene un utente tramite ID e concorso"""
    getUserById( """Il nome del concorso"""concorso: String!, id: String!): User
    getAllUsers(concorso: String!): [User]
    getUsersByBirthDate(concorso: String!, filterDate: DateTime!): [User]
    getUsersByBirthDateGreaterThan(concorso: String!, filterDate: DateTime!): [User]
    getUsersByBirthDateGreaterThanOrEqual(concorso: String!, filterDate: DateTime!): [User]
    getUsersByBirthDateLessThan(concorso: String!, filterDate: DateTime!): [User]
    getUsersByBirthDateLessThanOrEqual(concorso: String!, filterDate: DateTime!): [User]
    getUsersByBirthDateExact(concorso: String!, filterDate: DateTime!): [User]
    getUsersByBirthDateFilter(concorso: String!, before: DateTime, after: DateTime): [User]
    getAllTitoliPreferenziali(concorso: String!): [String]
    getAllRiserve(concorso: String!): [String]
    getCandidatiByRiserve(concorso: String!, riserve: [String]!): [User]
    getCandidatiByTitoliPreferenziali(concorso: String!, titoliPreferenziali: [String]!): [User]
    getListaUnicaPatenti(concorso: String!): [String]
    getCandidatiByPatenti(concorso: String!, patenti: [String]!): [User]
    getTipologieProve(concorso: String!): [String]
     """Ottiene utenti tramite filtri, restituisce potenzialmente tutti i campi, con l'eccezione delle domandeConcorso, delle quali restituisce i dati relativi solo dell'ultima domanda"""
    getCandidatiByCriteria(concorso: String!, riserve: [String], titoliPreferenziali: [String], patenti: [String], tipoProve: [String], dateProve: [String], esitiProve: [String],  statoCandidato: [String], nome: String, cognome: String, codiceFiscale: String ,BirthDateGreaterThanOrEqual:DateTime ,BirthDateLessThanOrEqual:DateTime): [User]
    getStatiCandidato(concorso: String!): [String]
    getEsitiByProva(concorso: String!,tipoProva:String!): [String]
    getDateProveByTipoProva(concorso: String!,tipoProva:String!): [String]
    """restituisce tutti i nomi possibili contenuti nei documenti, anche aanidatio contenuti in liste, facendo quindi un controllo sulla collezione intera"""
    getAllFields(concorso: String!): [String!]!
    """restituisce i nomi dei campi semplici che non contengono oggetti o liste, sostanzialmente l'anagrafica"""
    getSimpleFields(concorso: String!): [String!]!
    """analizza l'intera collezione e, per ogni documento, estrae i campi presenti nell'ultimo oggetto di domandeConcorso"""
    getAllCampiDomandeConcorso(concorso: String!): [String!]!
    getStepsByProvaByCandidato(concorso: String!,codiceFiscale: String!,tipoProva:String!): [IterConcorso]
    getDocumentsByProvaWithEsito(concorso: String!, provaDescrizione: String!, esitoList: [String]!): [User]
  }

  type Mutation {
    createUser(concorso: String!, codiceFiscale: String!, cognome: String!, nome: String!, dataNascita: DateTime!, comuneNascita: ComuneInput!): User
    deleteUser(concorso: String!, id: String!): String
    addOrUpdateStep(concorso: String!, codiceFiscale: String!,provaDescrizione: String!,idStep: Int!,stepData: IterConcorsoInput!): IterConcorso
  }

  type User {
    _id: String
    codiceFiscale: String
    cognome: String
    nome: String
    dataNascita: DateTime
    comuneNascita: Comune
    elaborato: Elaborato
    statoDomanda: String
    statoCandidato: String
    dataUltInvioDomanda: DateTime
    annullaDomanda: String
    domandeConcorso: [DomandaConcorso]
    iterConcorso: [IterConcorso]
    ultimoStep: IterConcorso
  }

  type Comune {
    codice: String
    nome: String
    codiceProvincia: String
    nomeProvincia: String
  }

  input ComuneInput {
    codice: String
    nome: String
    codiceProvincia: String
    nomeProvincia: String
  }

  type Elaborato {
    cognome: String
    nome: String
  }

  type DomandaConcorso {
    infoInvio: InfoInvio
    anagCandidato: AnagCandidato
    diploma: Diploma
    laurea: Laurea
    abilitazione: Abilitazione
    lingua: Lingua
    lstTitoliValutabili: [String]
    lstTitoliPreferenziali: [TitoloPreferenziale]
    lstRiserve: [Riserve]
    lstPatenti: [Patente]
    appartenenteCNVVF: Boolean
    numeroFigli: Int
    invaliditaCivile: String
    dSA: String
    note: String
    volontarioCNVVF: Boolean
  }

  type InfoInvio {
    data: DateTime  # Usa DateTime per il campo data
    autoreCf: String
  }

  type AnagCandidato {
    codiceFiscale: String
    cognome: String
    nome: String
    dataNascita: DateTime  # Usa DateTime per il campo data
    comuneNascita: Comune
    comuneNascitaEstero: String
    sesso: String
    pec: String
    residenza: String
  }

  type Diploma {
    tipoTitolo: Titolo
    titoloStudio: TitoloStudio
    istituto: String
    luogoIstituto: Comune
    indirizzoIstituto: String
    dataConseguimento: DateTime  # Usa DateTime per il campo data
    descrizioneAltroTitolo: String
    note: String
    tipologia: Tipologia
    settore: Settore
    selezione: Selezione
    descTitolo: String
  }

   type Laurea {
    tipoTitolo: String
    titoloStudio: TitoloStudio
    istituto: String
    luogoIstituto: Comune
    indirizzoIstituto: String
    dataConseguimento: DateTime  # Usa DateTime per il campo data
    descrizioneAltroTitolo: String
    note: String
    tipologia: Tipologia
    settore: Settore
    selezione: Selezione
    descTitolo: String
  }

  type Abilitazione {
    tipoTitolo: String
    titoloStudio: TitoloStudio
    istituto: String
    luogoIstituto: Comune
    indirizzoIstituto: String
    annoConseguimento: Int
    note: String
    sessione: String
  }

  type Titolo {
    _id: Int
    descrizione: String
  }

  type Patente {
    tipoPatente: TipoPatente
    numero: String
    enteRilascio: String
    dataRilascio: DateTime  # Usa DateTime per il campo data
    dataScadenza: DateTime  # Usa DateTime per il campo data

  }

  type TipoPatente {
    _id: Int
    tipo: String
    punti: Int
  }

  type TitoloStudio {
    _id: String
    descrizioneTitolo: String
    tipologia: Tipologia
    indirizzo: Indirizzo
    codiceMIUR: String
    idTipoStudio: String
  }

  type Tipologia {
    _id: Int
    descrizione: String
    livelloDiIstruzione: LivelloDiIstruzione
    flagSettore: Boolean
    flagSelezione: Boolean
    flgTesto: Boolean
    codiceMIUR: String
    idTipoStudio: String
  }

  type Settore{
    _id: String
    idPadre: String
    descrizione: String
    flgSelezione: Boolean
  }

  type Selezione{
    _id: String
    idPadre: String
    descrizione: String
  }

  type LivelloDiIstruzione {
    _id: Int
    descrizione: String
  }

  type Indirizzo {
    _id: Int
    descrizione: String
    flgInsManuale: Boolean
  }

  type Lingua {
    _id: Int
    descrizione: String
  }

  type TitoloPreferenziale {
    _id: Int
    descrizione: String
  }

   type Riserve {
    _id: Int
    descrizione: String
  }

  type IterConcorso {
    idStep: Int
    dataProva: DateTime  # Usa DateTime per il campo data
    prova: Prova
    esito: Esito
    punteggio: String
    linkAllegati: String
    assenzaGiustificata: AssenzaGiustificata
    cFTipoProva: String
    cFTipoEsito: String
    note: String
  }

  type Prova {
    _id: Int
    categoria: String
    descrizione: String
  }

  type Esito {
    _id: Int
    categoria: String
    descrizione: String
    statoCandidato: String
    notaObbligatoria: Boolean
  }
  type AssenzaGiustificata{
    dataInizioMalattia: String
    giorniCertificati: Int
    numeroProtocollo: String
    dataProtocollo: String
    note: String
  }
  input IterConcorsoInput {
    idStep: Int
    dataProva: DateTime
    prova: ProvaInput
    esito: EsitoInput
    punteggio: String
    linkAllegati: String
    assenzaGiustificata: AssenzaGiustificataInput
    cFTipoProva: String
    cFTipoEsito: String
    note: String
}

input ProvaInput {
  _id: Int
  categoria: String
  descrizione: String
}

input EsitoInput {
  _id: Int
  categoria: String
  descrizione: String
  statoCandidato: String
  notaObbligatoria: Boolean
}

input AssenzaGiustificataInput {
  dataInizioMalattia: String
  giorniCertificati: Int
  numeroProtocollo: String
  dataProtocollo: String
  note: String
}  
`);

module.exports = schema;
