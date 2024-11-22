// Select elements
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('arquivo');

// Function to read the JSON file
const readJSONFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const jsonData = JSON.parse(event.target.result);
            sendJSONToAPI(jsonData);
        } catch (error) {
            console.error("Erro ao ler JSON:", error);
        }
    };
    reader.readAsText(file);
};

// Function to send JSON data to the API
const sendJSONToAPI = (jsonData) => {
    const xhr = new XMLHttpRequest();
    const url = 'https://your-api-endpoint.com/upload';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("JSON enviado com sucesso:", xhr.responseText);
            } else {
                console.error("Erro ao enviar JSON:", xhr.status, xhr.statusText);
            }
        }
    };

    xhr.send(JSON.stringify(jsonData));
};

// Form submit event handler
const handleFormSubmit = (event) => {
    event.preventDefault();
    const file = fileInput.files[0];

    if (file && file.type === 'application/json') {
        readJSONFile(file);
    } else {
        console.error("Selecione um arquivo JSON válido.");
    }
};

// Add submit event listener to the form
uploadForm.addEventListener('submit', handleFormSubmit);


