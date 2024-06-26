const token = "9a7a33d0-f1dc-4e55-be52-37c65eed0ceb";
const deviceBucketId = "662fe759d853480009e68782";
const distanciaVariableName = "distancia";
const umidadeVariableName = "umidade";
const temperaturaVariableName = "temperatura";

// URL da API do Tago.io para acessar dados de uma variável específica
const apiUrlGetDataDistancia = `https://api.tago.io/data?bucket=${deviceBucketId}&variable=${distanciaVariableName}&qty=1`;
const apiUrlGetDataUmidade = `https://api.tago.io/data?bucket=${deviceBucketId}&variable=${umidadeVariableName}&qty=1`;
const apiUrlGetDataTemperatura = `https://api.tago.io/data?bucket=${deviceBucketId}&variable=${temperaturaVariableName}&qty=1`;
const apiUrlSendData = `https://api.tago.io/data`;


async function sendCommand(frequency) {
  const apiUrl = `https://api.tago.io/data`;
  const body = {
    variable: 'buzzer_tone',
    value: frequency
  };
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Device-Token': token
      },
      body: JSON.stringify(body)
    });
    console.log('Comando enviado com sucesso:', await response.json());
  } catch (error) {
    console.error('Erro ao enviar comando:', error);
  }
}

sendCommand(1000)

async function fetchData() {
  try {
    // Obter dados de umidade
    const responseUmidade = await fetch(apiUrlGetDataUmidade, {
      headers: {
        'Content-Type': 'application/json',
        'Device-Token': token
      }
    });

    const dataUmidade = await responseUmidade.json();
    // Exibe os dados de umidade na página
    const umidadeValue = dataUmidade.result[0].value;
    document.getElementById('dadosUmidade').innerText = `${umidadeValue} %`;
    // Atualiza a cor do texto com base no valor da umidade
    updateUmidadeColor(umidadeValue);

    // Obter dados de distância
    const responseDistancia = await fetch(apiUrlGetDataDistancia, {
      headers: {
        'Content-Type': 'application/json',
        'Device-Token': token
      }
    });
    const dataDistancia = await responseDistancia.json();
    // Exibe os dados de distância na página
    document.getElementById('dadosDistancia').innerText = `${dataDistancia.result[0].value} cm`;

    // Obter dados de temperatura
    const responseTemperatura = await fetch(apiUrlGetDataTemperatura, {
      headers: {
        'Content-Type': 'application/json',
        'Device-Token': token
      }
    });
    const dataTemperatura = await responseTemperatura.json();
    // Exibe os dados de temperatura na página
    const temperaturaValue = dataTemperatura.result[0].value;
    document.getElementById('dadosTemperatura').innerText = `${temperaturaValue} °C`;
    // Atualiza a cor do texto com base no valor da temperatura
    updateTemperaturaColor(temperaturaValue);

  } catch (error) {
    console.error('Erro ao recuperar dados:', error);
  }
}


async function sendData() {
  try {
    const distanciaInput = document.getElementById('distanciaInput').value;
    const umidadeInput = document.getElementById('umidadeInput').value;
    const temperaturaInput = document.getElementById('temperaturaInput').value;
    const bodyDistancia = {
      variable: distanciaVariableName,
      value: distanciaInput
    };
    const bodyUmidade = {
      variable: umidadeVariableName,
      value: umidadeInput
    };
    const bodyTemperatura = {
      variable: temperaturaVariableName,
      value: temperaturaInput
    };
    // Enviar dados de distância
    await postData(apiUrlSendData, bodyDistancia);
    // Enviar dados de umidade
    await postData(apiUrlSendData, bodyUmidade);
    // Enviar dados de temperatura
    await postData(apiUrlSendData, bodyTemperatura);
    console.log('Dados enviados com sucesso');
    // Atualiza os dados exibidos após o envio bem-sucedido
    fetchData();
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
}

// Função para atualizar a cor do texto com base no valor da umidade
function updateUmidadeColor(umidade) {
  const umidadeElement = document.getElementById('dadosUmidade');
  if (umidade > 70) {
    umidadeElement.style.color = 'green';
  } else if (umidade < 40) {
    umidadeElement.style.color = 'red';
  } else {
    umidadeElement.style.color = 'yellow';
  }
}

// Função para atualizar a cor do texto com base no valor da temperatura
function updateTemperaturaColor(temperatura) {
  const temperaturaElement = document.getElementById('dadosTemperatura');
  if (temperatura >= 30) {
    temperaturaElement.style.color = 'red';
  } else if (temperatura < 30 && temperatura >= 20) {
    temperaturaElement.style.color = 'yellow';
  } else {
    temperaturaElement.style.color = 'blue';
  }
}

// Chama a função fetchData() quando a página é carregada
window.onload = function () {
  fetchData();
  // Recarrega a página a cada 4 segundos
  setInterval(fetchData, 4000); // 4000 milissegundos = 4 segundos
};




