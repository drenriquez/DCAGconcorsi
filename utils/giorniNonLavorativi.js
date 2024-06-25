export function isNonLavorativo(date) {
    const festivita = [
      { giorno: 1, mese: 1 }, // Capodanno
      { giorno: 6, mese: 1 }, // Befana
      { giorno: 25, mese: 4 }, // Festa della Liberazione
      { giorno: 1, mese: 5 }, // Festa del Lavoro
      { giorno: 2, mese: 6},  // Festa della Republica
      { giorno: 15, mese: 8 }, // Ferragosto
      { giorno: 1, mese: 11 },//tutti i Santi
      { giorno: 8, mese: 12 },//La Madonna
      { giorno: 25, mese: 12 }, // Natale
      { giorno:26, mese:12},//Santo Stefano
      //{ giorno: 31, mese: 12 }, // San Silvestro
    ];
  
    if (!Array.isArray(festivita)) {
        throw new TypeError("festivita must be an array");
    }
  
    if (date.getDay() === 6 || date.getDay() === 0) {
        return 1;
    }
  
    const giorno = date.getDate();
    const mese = date.getMonth() + 1;
    const anno = date.getFullYear();
  
    for (const festa of festivita) {
        if (festa.anno) {
            if (festa.giorno === giorno && festa.mese === mese && festa.anno === anno) {
                return 1;
            }
        } else {
            if (festa.giorno === giorno && festa.mese === mese) {
                return 1;
            }
        }
    }
  
    const pasqua = calculateEaster(anno);
    const pasquetta = new Date(pasqua);
    pasquetta.setDate(pasquetta.getDate() + 1);
  
    if ((date.getDate() === pasqua.getDate() && date.getMonth() === pasqua.getMonth()) ||
        (date.getDate() === pasquetta.getDate() && date.getMonth() === pasquetta.getMonth())) {
        return 1;
    }
  
    return 0;
  };
  function calculateEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }
