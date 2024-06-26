// Função para atualizar os dados na tela inicial
function atualizarDados() {
  // Simulação de novos valores
  const umidade = (80 + Math.random()).toFixed(2) + '%';
  const temperatura = (Math.random() * 0.1 + 25.1).toFixed(1) + '°C';
  const distancia = Math.floor(Math.random() * 21) + 30 + ' cm';

  // Atualiza os elementos com os novos valores
  document.getElementById('umidade').textContent = umidade;
  document.getElementById('temperatura').textContent = temperatura;
  document.getElementById('distancia').textContent = distancia;
}

// Executa a função a primeira vez
atualizarDados();

// Executa a função a cada 4 segundos
setInterval(atualizarDados, 2000);



//npm install --save sweetalert2

document.getElementById('alerta').onclick = function(){
  swal({
  title: 'Você está certo disso?',
  text: "Esta pergunta vale um milhão de reais!",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sim, tenho certeza!',
  cancelButtonText: 'Melhor eu parar...'
  }).then((result) => {
    if (result.value) {
      swal(
        'Parabéns!',
        'Você acertou e ganhou um milhão de reais!',
        'success'
      )
    }
  })
};
// Função para enviar um comando com base no valor recebido
function sendCommand(value) {
  // Aqui você pode colocar a lógica para enviar o comando
  console.log('Comando enviado com valor:', value);
  
  // Exemplo: Simulação de envio de comando para algum lugar
  // Aqui você pode adicionar o código real para enviar comandos.
  // Por exemplo, enviar um comando para um servidor ou dispositivo.
}