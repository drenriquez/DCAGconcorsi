const { buildSchema } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

// Definizione dello schema GraphQL
const schema = buildSchema(`
  scalar DateTime

  type Query {
    getUserById(concorso: String!, id: String!): User
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
    getCandidatiByCriteria(concorso: String!, riserve: [String], titoliPreferenziali: [String], patenti: [String], statoCandidato: [String]): [User]
    getStatiCandidato(concorso: String!): [String]
    getEsitiByProva(concorso: String!,tipoProva:String!): [String]
    getDateProveByTipoProva(concorso: String!,tipoProva:String!): [String]
  }

  type Mutation {
    createUser(concorso: String!, codiceFiscale: String!, cognome: String!, nome: String!, dataNascita: DateTime!, comuneNascita: ComuneInput!): User
    deleteUser(concorso: String!, id: String!): String
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
    lingua: Lingua
    lstTitoliPreferenziali: [TitoloPreferenziale]
    lstRiserve: [String]
    appartenenteCNVVF: Boolean
    numeroFigli: Int
    invaliditaCivile: String
    dSA: String
    note: String
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
  }

  type Titolo {
    _id: Int
    descrizione: String
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

  type IterConcorso {
    idStep: Int
    dataProva: DateTime  # Usa DateTime per il campo data
    prova: Prova
    esito: Esito
    punteggio: String
    linkAllegati: String
    assenzaGiustificata: String
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
`);

module.exports = schema;
