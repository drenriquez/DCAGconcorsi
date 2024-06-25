const APIgetAllUsersInOrdineCognome = async (host) => {
  try {
      const response = await fetch(`${host}api/users/ordinaCognome`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: 'same-origin' // Assicura l'invio dei cookie con la richiesta
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching user level:', error);
      throw error;
  }
};

const APIaddAbsenceById = async (host, id, data, motivo) => {
  try {
      const response = await fetch(`${host}api/users/addAbsenceById`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: 'same-origin', // Assicura l'invio dei cookie con la richiesta
          body: JSON.stringify({ id, data, motivo })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const user = await response.json();
      return user;
  } catch (error) {
      console.error('Error adding absence:', error);
      throw error;
  }
};

const APIdeleteAbsenceById = async (host, id, data) => {
  try {
      const response = await fetch(`${host}api/users/deleteAbsenceById`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: 'same-origin', // Assicura l'invio dei cookie con la richiesta
          body: JSON.stringify({ id, data })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const user = await response.json();
      return user;
  } catch (error) {
      console.error('Error deleting absence:', error);
      throw error;
  }
};

const APIgetUsersByUfficio = async (host, ufficio) => {
  try {
      const response = await fetch(`${host}api/users/ufficio/${ufficio}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: 'same-origin' // Assicura l'invio dei cookie con la richiesta
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const users = await response.json();
      return users;
  } catch (error) {
      console.error('Error fetching users by ufficio:', error);
      throw error;
  }
};
const APIcreateUser = async (host, userData) => {
    try {
        const response = await fetch(`${host}api/createUsers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const newUser = await response.json();
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const APIupdateUser = async (host, id, userData) => {
    try {
        const response = await fetch(`${host}api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const updatedUser = await response.json();
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

const APIdeleteUser = async (host, id) => {
    try {
        const response = await fetch(`${host}api/users/deleteUserById`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({ id })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

const APIgetUserByCodiceFiscale = async (host, codiceFiscale) => {
    try {
        const response = await fetch(`${host}api/users/codiceFiscale/${codiceFiscale}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user by codice fiscale:', error);
        throw error;
    }
};
export {
  APIgetAllUsersInOrdineCognome,
  APIaddAbsenceById,
  APIdeleteAbsenceById,
  APIgetUsersByUfficio, // Aggiunta della nuova funzione all'elenco di esportazione
  APIcreateUser,
  APIdeleteUser,
  APIupdateUser,
  APIgetUserByCodiceFiscale
};