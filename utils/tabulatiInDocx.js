import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from "docx";

export function generaTabulatiProveMotorieDocx(concorsoId, concorsoTipoProva, tipologia, dataProva, intestazioneColonne, larghColonne, xLineeVerticali, dati, nomiDati) {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun(`${concorsoId} Tabulato ${tipologia} ${concorsoTipoProva} del ${dataProva}`),
                        ],
                    }),

                    // Aggiungi intestazione tabella
                    new Table({
                        rows: [
                            new TableRow({
                                children: intestazioneColonne.map((colonna, i) => {
                                    return new TableCell({
                                        children: [new Paragraph(colonna)],
                                        width: { size: larghColonne[i], type: "auto" },
                                    });
                                }),
                            }),
                        ],
                    }),

                    // Aggiungi i dati
                    ...dati.map((item, index) => {
                        const valori = [
                            index + 1,
                            item[nomiDati[0]] !== undefined ? item[nomiDati[0]] : '',
                            item[nomiDati[1]] !== undefined ? item[nomiDati[1]] : '',
                            item[nomiDati[2]] !== undefined ? item[nomiDati[2]] : '',
                            item[nomiDati[3]] !== undefined ? item[nomiDati[3]] : '',
                            item[nomiDati[4]] !== undefined ? item[nomiDati[4]] : '',
                            '', // PROVA 2 vuoto
                            ''  // PROVA 3 vuoto
                        ];

                        return new Table({
                            rows: [
                                new TableRow({
                                    children: valori.map((valore, i) => {
                                        return new TableCell({
                                            children: [new Paragraph(valore)],
                                            width: { size: larghColonne[i], type: "auto" },
                                        });
                                    }),
                                }),
                            ],
                        });
                    }),

                    // Aggiungi il numero di pagina
                    new Paragraph({
                        children: [
                            new TextRun(`Pagina ${1} di ${Math.ceil(dati.length / 16)}`),
                        ],
                    }),
                ],
            },
        ],
    });

    // Salva il documento come file Word
    Packer.toBuffer(doc).then((buffer) => {
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `tabulato${concorsoId}_${tipologia}_${dataProva}.docx`;
        link.click();
    });
}