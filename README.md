# Hydro Experience - S.A da 3ª Fase

## Descrição

**Hydro Experience** é um projeto desenvolvido para o monitoramento e controle de irrigação de plantas, focado na agricultura. Utilizamos o **ESP32** como dispositivo central, equipado com sensores ultrassônicos para medir a distância e controlar a pressão da água, garantindo uma irrigação eficiente e segura. O sistema também utiliza um sensor **DHT11** para monitoramento de temperatura e umidade do ambiente, fornecendo alertas em tempo real sobre as condições do clima e a necessidade de irrigação.

Além disso, o projeto conta com uma interface interativa, na qual as informações de umidade, temperatura e distância são exibidas para o usuário. Alertas são acionados automaticamente ou manualmente para manter o ambiente das plantas saudável e bem irrigado.

## Funcionalidades

- **Monitoramento de Umidade**: Utiliza LEDs e alertas para indicar o nível de umidade do solo (verde para alta umidade, amarelo para moderada e vermelho para baixa).
- **Controle de Irrigação**: Aciona a irrigação automaticamente ou por comando manual via tela ou botão no dispositivo.
- **Monitoramento de Temperatura e Distância**: Exibe em tempo real os dados de temperatura e distância, proporcionando um controle mais preciso do ambiente.
- **Gráfico Dinâmico**: Interface que exibe gráficos atualizados com dados de umidade, temperatura e distância para fácil monitoramento.

## Tecnologias Utilizadas

### Backend e Hardware

- **ESP32**: Microcontrolador utilizado para realizar a leitura dos sensores e controlar a irrigação.
- **Sensor Ultrassônico**: Usado para medir a distância e controlar a pressão da água.
- **Sensor DHT11**: Sensor de temperatura e umidade do ambiente.
- **LEDs**: Indicadores de umidade (verde, amarelo, vermelho).
  
### Frontend

- **HTML/CSS**: Estrutura e estilo da interface do usuário.
- **JavaScript**: Manipulação dos dados em tempo real e comunicação com o dispositivo.
- **Bootstrap**: Framework CSS utilizado para criar uma interface responsiva e moderna.
- **FontAwesome**: Ícones utilizados para representar os controles do sistema.
- **SweetAlert2**: Biblioteca para alertas interativos na interface.
