document.addEventListener("DOMContentLoaded", async () => {   

    console.log('test inserimento prove')
    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                displayExcelData(json);
            };
            reader.readAsArrayBuffer(file);
        }
    });
});
function displayExcelData(data) {
    const container = document.getElementById('excelData');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'table table-bordered';

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    if (data.length > 0) {
        const headerRow = document.createElement('tr');
        data[0].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        for (let i = 1; i < data.length; i++) {
            const row = document.createElement('tr');
            data[i].forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
    }

    container.appendChild(table);
}