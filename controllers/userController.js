require('dotenv').config({ path: '../.env' });
const express = require('express');
const UserDao = require('../dao/userDao'); // Assumendo che il file del modello si chiami userDao.js
const { userAuth } = require('../middleware/userAuth');
const userDao = new UserDao()
class UserController {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
        //console.log("ISTANZIATO UN OGGETTO UserController ******************")
    }

    initializeRoutes() {
       // this.router.use(userAuth);

        this.router.get('/users', this.getAllUsers);
        this.router.get('/users/ordinaCognome', this.getAllUsersInOrdineCognome);
        this.router.get('/users/:id', this.getUserById);
        this.router.post('/createUsers', this.createUser);
        this.router.put('/users/:id', this.updateUser);
        this.router.delete('/users/deleteUserById', this.deleteUser);
        this.router.get('/users/codiceFiscale/:codiceFiscale', this.getUserByCodiceFiscale);
        this.router.get('/users/ufficio/:ufficio', this.getUsersByUfficio);
        this.router.get('/users/livelloUser/:codiceFiscale', this.getLivelloUserByCodiceFiscale);
        this.router.post('/users/uffici', this.getUsersByUffici);
        this.router.post('/users/addAbsenceByCodiceFiscale', this.addAbsenceByCodiceFiscale);
        this.router.delete('/users/deleteAbsenceByCodiceFiscale', this.deleteAbsenceByCodiceFiscale);
        this.router.post('/users/addAbsenceById', this.addAbsenceById);
        this.router.post('/users/deleteAbsenceById', this.deleteAbsenceById);
    }

    async getAllUsers(req, res) {
        try {
            const users = await userDao.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllUsersInOrdineCognome(req, res) {
        try {
            const users = await userDao.getAllUsersInOrdineCognome();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await userDao.getUserById(req.params.id);
            //console.log("******************user id:",req.params.id)
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createUser(req, res) {
        try {
            console.log("---------TEst userController riga65",req.body)
            const user = await userDao.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const user = await userDao.updateUser(req.params.id, req.body);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.body;
            const user = await userDao.deleteUser(id);
           // console.log('*********** chiamato metodo deleteUser in UserController',user)
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserByCodiceFiscale(req, res) {
        try {
            const user = await userDao.getUserByCodiceFiscale(req.params.codiceFiscale);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUsersByUfficio(req, res) {
        try {
            const users = await userDao.getUsersByUfficio(req.params.ufficio);
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getLivelloUserByCodiceFiscale(req, res) {
        try {
            const livello = await userDao.getLivelloUserByCodiceFiscale(req.params.codiceFiscale);
            if (livello === null) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ livelloUser: livello });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUsersByUffici(req, res) {
        try {
            const users = await userDao.getUsersByUffici(req.body.uffici);
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addAbsenceByCodiceFiscale(req, res) {
        try {
            const { codiceFiscale, data, motivo } = req.body;
            const user = await userDao.addAbsenceByCodiceFiscale(codiceFiscale, data, motivo);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteAbsenceByCodiceFiscale(req, res) {
        try {
            const { codiceFiscale, data } = req.body;
            const user = await userDao.deleteAbsenceByCodiceFiscale(codiceFiscale, data);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addAbsenceById(req, res) {
        try {
            const { id, data, motivo } = req.body;
            const user = await userDao.addAbsenceById(id, data, motivo);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteAbsenceById(req, res) {
        try {
            const { id, data } = req.body;
            const user = await userDao.deleteAbsenceById(id, data);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
  
  
    getRouter() {
        return this.router;
    }
}

module.exports = UserController


////vecchio controller


// require('dotenv').config({path:'../.env'});
// const express = require('express');
// const basicAuth = require('express-basic-auth');
// const router = express.Router();
// const UserDao = require('../model/userDao'); // Assumendo che il file del modello si chiami userDao.js
// const { userAuth } = require('../middleware/userAuth');

// /* // Configurazione dell'autenticazione di base
// router.use(basicAuth({
//     users: { "admin": process.env.API_KEY },
//     challenge: true
// })); */


// //autorizza l'accesso alle API solo attraverso l'applicazione
// router.use(userAuth)
// ;
// // Ottenere tutti gli utenti
// router.get('/users', async (req, res) => {
//     try {
//         const users = await userDao.getAllUsers();
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Ottenere tutti gli utenti ordinati per cognome
// router.get('/users/ordinaCognome', async (req, res) => {
//     //console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRR")
//     try {
//         const users = await userDao.getAllUsersInOrdineCognome();
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Ottenere un utente per ID
// router.get('/users/:id', async (req, res) => {
//     try {
//         const user = await userDao.getUserById(req.params.id);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Creare un nuovo utente
// router.post('/users', async (req, res) => {
//     try {
//         const user = await userDao.createUser(req.body);
//         res.status(201).json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Aggiornare un utente
// router.put('/users/:id', async (req, res) => {
//     try {
//         const user = await userDao.updateUser(req.params.id, req.body);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Eliminare un utente
// router.delete('/users/:id', async (req, res) => {
//     try {
//         const user = await userDao.deleteUser(req.params.id);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         res.json({ message: 'User deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Ottenere un utente per codice fiscale
// router.get('/users/codiceFiscale/:codiceFiscale', async (req, res) => {
//     try {
//         const user = await userDao.getUserByCodiceFiscale(req.params.codiceFiscale);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Ottenere utenti per ufficio
// router.get('/users/ufficio/:ufficio', async (req, res) => {
//     try {
//         const users = await userDao.getUsersByUfficio(req.params.ufficio);
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Ottenere il livello utente tramite codice fiscale
// router.get('/users/livelloUser/:codiceFiscale', async (req, res) => {
//     try {
//         const livello = await userDao.getLivelloUserByCodiceFiscale(req.params.codiceFiscale);
//         if (livello === null) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         res.json({ livelloUser: livello });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Ottenere utenti per una lista di uffici e ordinati per cognome
// router.post('/users/uffici', async (req, res) => {
//     try {
//         const users = await userDao.getUsersByUffici(req.body.uffici);
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Aggiungere un'assenza con codicce fiscale
// router.post('/users/addAbsenceByCodiceFiscale', async (req, res) => {
//     try {
//         const { codiceFiscale, data, motivo } = req.body;
//         const user = await userDao.addAbsenceByCodiceFiscale(codiceFiscale, data, motivo);
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Cancellare un'assenza con codice fiscale
// router.delete('/users/deleteAbsenceByCodiceFiscale', async (req, res) => {
//     try {
//         const { codiceFiscale, data } = req.body;
//         const user = await userDao.deleteAbsenceByCodiceFiscale(codiceFiscale, data);
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Aggiungere un'assenza con codicce fiscale
// router.post('/users/addAbsenceById', async (req, res) => {
//     //console.log("/////////////////",userDao)
//     try {
//         const { id, data, motivo } = req.body;
//         console.log("/////////////////",req.body)
//         const user = await userDao.addAbsenceById(id, data, motivo);
//         console.log("////////////// user in userController:",user)
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Cancellare un'assenza con codice fiscale
// router.delete('/users/deleteAbsenceById', async (req, res) => {
//     try {
//         const { id, data } = req.body;
//         const user = await userDao.deleteAbsenceById(id, data);
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// module.exports = router;
