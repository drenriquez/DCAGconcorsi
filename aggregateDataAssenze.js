var dataInput = new Date("2024-05-23"); // Data di input
var dataInizio = new Date(dataInput);
dataInizio.setMonth(dataInizio.getMonth() - 4); // Data di inizio: data di input meno 4 mesi
var dataFine = new Date(dataInput);
dataFine.setMonth(dataFine.getMonth() + 4); // Data di fine: data di input più 4 mesi

db.personale.aggregate([
    {
        $match: {
            "assenze.data": {
                $gte: dataInizio,
                $lte: dataFine
            }
        }
    },
    {
        $project: {
            "anagrafica": 1,
            "amministrazione": 1,
            "qualifica": 1,
            "ufficio": 1,
            "livelloUser": 1,
            "assenze": {
                $filter: {
                    input: "$assenze",
                    as: "assenza",
                    cond: {
                        $and: [
                            { $gte: ["$$assenza.data", dataInizio] },
                            { $lte: ["$$assenza.data", dataFine] }
                        ]
                    }
                }
            }
        }
    }
]);
