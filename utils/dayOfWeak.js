export function getDayAbbreviation(dayOfWeek) {
    switch(dayOfWeek) {
        case 0:
            return "Dom"; // Domenica
        case 1:
            return "Lun"; // Lunedì
        case 2:
            return "Mar"; // Martedì
        case 3:
            return "Mer"; // Mercoledì
        case 4:
            return "Gio"; // Giovedì
        case 5:
            return "Ven"; // Venerdì
        case 6:
            return "Sab"; // Sabato
        default:
            return ""; // Restituisce una stringa vuota per valori non validi
    }
  }