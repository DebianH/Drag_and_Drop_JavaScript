const dropArea =  document.querySelector(".drop-area");
const dragText =  dropArea.querySelector("h2");
const button =  dropArea.querySelector("button");
const input =  dropArea.querySelector("#input-file");
let files;

button.addEventListener("click", (e) => {
    input.click();
})

input.addEventListener("change",(e)  => {
    files = input.files;
    dropArea.classList.add("active");
    showFiles(files);
    dropArea.classList.remove("active");
});

dropArea.addEventListener("dragover",(e) => {
    e.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Suelta para subir imagen";
});

dropArea.addEventListener("dragleave",(e) => {
    e.preventDefault(); //Para que no intente abrir la imagen
    dropArea.classList.remove("active");
    dragText.textContent = "Arrastra y suelta imagenes";
});

dropArea.addEventListener("drop",(e) => {
    e.preventDefault();
    files = e.dataTransfer.files; //obtener referencia de las imagenes
    showFiles(files);
    dropArea.classList.remove("active");
    dragText.textContent = "Suelta imagenes!";
});



function showFiles(files) {
    if(files.length === undefined) {
        processFile(files);
    } else {
        for(const file of files) {
            processFile(file);
        }
    }
}

function processFile(file) { //Formatos de imagen - Aceptadas
    const docType = file.type;
    const validExtensions = ['image/jpeg','image/jpg','image/png','image/gif',]

    if (validExtensions.includes(docType)) {
        //archivo valido
        const fileReader = new FileReader();
        const id = `file-${Math.random().toString(32).substring(7)}`;

        fileReader.addEventListener('load', (e) => {
            const fileUrl = fileReader.result;
            
            const image = `
                <div id="${id}" class="file-container">
                    <img src="${fileUrl}" alt="${file.name}" width="50">
                    <div class="status">
                        <span>${file.name}</span>
                        <span class="status-text>
                          Loading...
                        </span>
                    </div>
                </div>
                `; 
            
            const html = document.querySelector("#preview").innerHTML
            document.querySelector('#preview').innerHTML = image + html;
            console.log("parece aqui")
        });

        fileReader.readAsDataURL(file);
        uploadFile(file, id);
    } else {
        // No es valido
        alert("NO es un archivo valido!!")
    }
}

async function uploadFile(file, id) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        });

        const responseText = await response.text();
        console.log(responseText);

        document.querySelector(`#${id} .status-text`).innerHTML = `<span class="success">Archivo subido correcto </span>`;
    } catch(error){
        document.querySelector(`#${id} .status-text`).innerHTML = `<span class="failure">Archivo incorrecto </span>`;
    }
}