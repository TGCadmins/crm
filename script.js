document.getElementById('fileInput').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the first sheet contains the data
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const records = XLSX.utils.sheet_to_json(firstSheet);

        generateCRM(records);
    };

    reader.readAsArrayBuffer(file);
}

function generateCRM(data) {
    const container = document.getElementById('crmContainer');
    container.innerHTML = ''; // Clear previous content

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Get the keys from the first object to create headers
    const headers = Object.keys(data[0]);

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // Add Status and Comments headers
    const statusTh = document.createElement('th');
    statusTh.textContent = 'סטָטוּס'; // Status in Hebrew
    headerRow.appendChild(statusTh);

    const commentsTh = document.createElement('th');
    commentsTh.textContent = 'הערות'; // Comments in Hebrew
    headerRow.appendChild(commentsTh);

    table.appendChild(headerRow);

    // Define status options in Hebrew
    const statusOptions = [
        'עדיין ללא פנייה', // Not yet contacted
        'בתהליך',          // In process
        'הפך ללקוח',        // Became a customer
        'לא רלוונטי'        // Not relevant
    ];

    // Create rows for each record
    data.forEach(record => {
        const row = document.createElement('tr');

        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = record[header] || '';
            row.appendChild(td);
        });

        // Status dropdown
        const statusTd = document.createElement('td');
        const statusSelect = document.createElement('select');

        statusOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            statusSelect.appendChild(opt);
        });

        statusTd.appendChild(statusSelect);
        row.appendChild(statusTd);

        // Comments input
        const commentsTd = document.createElement('td');
        const commentsInput = document.createElement('input');
        commentsInput.type = 'text';
        commentsInput.placeholder = 'הכנס הערה'; // Enter comment in Hebrew

        commentsTd.appendChild(commentsInput);
        row.appendChild(commentsTd);

        table.appendChild(row);
    });

    container.appendChild(table);
}
