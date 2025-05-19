let leituras = [];

function adicionarLeitura() {
    const dataInput = document.getElementById('data');
    const horaInput = document.getElementById('hora');
    const leituraInput = document.getElementById('leitura');
    const corpoTabela = document.getElementById('corpo-tabela');
    const consumoTotalElement = document.getElementById('consumo-total');

    const data = dataInput.value;
    const hora = horaInput.value;
    const leituraAtual = parseFloat(leituraInput.value);

    if (!data || isNaN(leituraAtual)) {
        alert('Por favor, preencha a data e a leitura.');
        return;
    }

    const novaLeitura = {
        data: data,
        hora: hora,
        leitura: leituraAtual
    };

    leituras.push(novaLeitura);
    atualizarTabela();
    atualizarConsumoTotal();

    // Limpar os campos do formulário
    dataInput.value = '';
    horaInput.value = '';
    leituraInput.value = '';
}

function atualizarTabela() {
    const corpoTabela = document.getElementById('corpo-tabela');
    corpoTabela.innerHTML = ''; // Limpar a tabela

    let leituraAnterior = null;

    leituras.forEach(leitura => {
        const linha = corpoTabela.insertRow();
        const colunaData = linha.insertCell();
        const colunaHora = linha.insertCell();
        const colunaLeitura = linha.insertCell();
        const colunaConsumo = linha.insertCell();

        colunaData.textContent = leitura.data;
        colunaHora.textContent = leitura.hora;
        colunaLeitura.textContent = leitura.leitura.toFixed(2);

        let consumo = 0;
        if (leituraAnterior !== null) {
            consumo = (leitura.leitura - leituraAnterior.leitura).toFixed(2);
        }
        colunaConsumo.textContent = consumo >= 0 ? consumo : 'N/A'; // Evitar consumo negativo na primeira leitura
        leituraAnterior = leitura;
    });
}

function atualizarConsumoTotal() {
    const consumoTotalElement = document.getElementById('consumo-total');
    let consumoTotal = 0;
    let leituraAnterior = null;

    leituras.forEach(leitura => {
        if (leituraAnterior !== null) {
            const consumo = leitura.leitura - leituraAnterior.leitura;
            if (consumo >= 0) {
                consumoTotal += consumo;
            }
        }
        leituraAnterior = leitura;
    });

    consumoTotalElement.textContent = consumoTotal.toFixed(2) + ' kWh';
}

// Carregar leituras salvas (se houver) ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const leiturasSalvas = localStorage.getItem('leituras');
    if (leiturasSalvas) {
        leituras = JSON.parse(leiturasSalvas);
        atualizarTabela();
        atualizarConsumoTotal();
    }
});

// Salvar as leituras no localStorage antes de fechar a página
window.addEventListener('beforeunload', () => {
    localStorage.setItem('leituras', JSON.stringify(leituras));
});