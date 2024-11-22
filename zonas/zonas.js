const itensPorPagina = 2; // Alterado para 2 zonas por página
let paginaAtual = 1;
let dados = []; // Dados carregados do JSON
let dadosFiltrados = []; // Dados filtrados

// Função para mostrar o loader
function mostrarLoader() {
    const loader = document.getElementById("loader");
    loader.style.display = "block";
}

// Função para ocultar o loader
function esconderLoader() {
    const loader = document.getElementById("loader");
    loader.style.display = "none";
}

// Função para buscar os dados do arquivo JSON (com loader)
async function buscarDados() {
    mostrarLoader(); // Exibe o loader
    try {
        const resposta = await fetch('../json/zonas.json'); // Caminho para o arquivo JSON
        if (!resposta.ok) {
            throw new Error(`Erro HTTP! status: ${resposta.status}`);
        }
        const dadosJSON = await resposta.json();
        return dadosJSON;
    } catch (erro) {
        console.error("Erro ao carregar os dados do JSON:", erro);
        return [];
    } finally {
        esconderLoader(); // Oculta o loader
    }
}

// Função para popular o filtro de zonas
function popularFiltroDeZonas() {
    const seletor = document.getElementById("zonaSelect");
    const zonasUnicas = [...new Set(dados.map(zona => zona.zona))]; // Extrai zonas únicas do JSON

    zonasUnicas.forEach(zona => {
        const opcao = document.createElement("option");
        opcao.value = zona; // Usa o nome da zona como valor
        opcao.textContent = zona; // Exibe o nome da zona no dropdown
        seletor.appendChild(opcao);
    });
}

// Função para criar os itens do accordion
function gerarAccordion(zonas) {
    const accordion = document.getElementById("resultsAccordion");
    accordion.innerHTML = ""; // Limpar conteúdo existente

    zonas.forEach((zona, indiceZona) => {
        let conteudoSecoes = "";

        zona.secoes.forEach(secao => {
            let conteudoCandidatos = "";

            secao.candidatos.forEach(c => {
                conteudoCandidatos += `
                    <div>
                        <p><strong>Candidato:</strong> ${c.nomeCandidato}</p>
                        <p><strong>Quantidade de Votos:</strong> ${c.quantidadeVotos}</p>
                        <p><strong>Percentual de Votos:</strong> ${c.percentualVotos}%</p>
                    </div>
                    <hr>
                `;
            });

            conteudoSecoes += `
                <div>
                    <h5>${secao.secao}</h5>
                    <p><strong>Total de Votos Válidos:</strong> ${secao.totalVotosValidos}</p>
                    <p><strong>Percentual de Votos Válidos:</strong> ${secao.percentualVotosValidos}%</p>
                    <h6>Candidatos:</h6>
                    ${conteudoCandidatos}
                </div>
            `;
        });

        const card = `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${indiceZona}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${indiceZona}" aria-expanded="false" aria-controls="collapse${indiceZona}">
                        ${zona.zona}
                    </button>
                </h2>
                <div id="collapse${indiceZona}" class="accordion-collapse collapse" aria-labelledby="heading${indiceZona}" data-bs-parent="#resultsAccordion">
                    <div class="accordion-body">
                        ${conteudoSecoes}
                    </div>
                </div>
            </div>
        `;

        accordion.insertAdjacentHTML("beforeend", card);
    });
}

// Função para criar os botões de paginação
function gerarPaginacao(totalItens) {
    const paginacao = document.getElementById("pagination");
    paginacao.innerHTML = ""; // Limpar conteúdo existente

    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === paginaAtual ? "active" : ""}`;

        const botao = document.createElement("button");
        botao.className = "page-link";
        botao.textContent = i;
        botao.onclick = () => {
            paginaAtual = i;
            renderizar();
        };

        li.appendChild(botao);
        paginacao.appendChild(li);
    }
}

// Função principal para renderizar os dados
function renderizar() {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const zonasPagina = dadosFiltrados.slice(inicio, fim);

    gerarAccordion(zonasPagina);
    gerarPaginacao(dadosFiltrados.length);
}

// Event listener para o filtro de zona
document.getElementById("zonaSelect").addEventListener("change", (e) => {
    const zonaSelecionada = e.target.value;
    paginaAtual = 1;

    if (zonaSelecionada) {
        // Filtrar os dados com base na zona selecionada
        dadosFiltrados = dados.filter(zona => zona.zona === zonaSelecionada);
    } else {
        // Exibir todos os dados
        dadosFiltrados = [...dados];
    }

    renderizar();
});

// Inicialização
(async function inicializar() {
    mostrarLoader(); // Exibe o loader no início
    try {
        dados = await buscarDados(); // Carregar os dados do JSON
        dadosFiltrados = [...dados]; // Inicia os dados filtrados
        popularFiltroDeZonas(); // Popula o filtro de zonas
        renderizar(); // Renderiza os dados
    } finally {
        esconderLoader(); // Oculta o loader ao terminar
    }
})();
