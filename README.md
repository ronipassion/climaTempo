# Projeto de Atividade: App de Clima 🌦️

Este projeto foi desenvolvido como parte de uma atividade de avaliação, com o objetivo de criar um aplicativo funcional em React Native.

## 🎯 Sobre a Aplicação


* ✅ **Consumo de Dados de uma API:**
    * O app consome dados da API pública e gratuita [Open-Meteo](https://open-meteo.com/).
    * São feitas duas chamadas à API: uma para **geocodificação** (converter nome de cidade em coordenadas) e outra para obter a **previsão do tempo**.

* ✅ **Exibição dos Dados em Tela:**
    * A interface exibe de forma clara e intuitiva os dados recebidos da API, incluindo:
        * Nome da cidade e estado/região.
        * Temperatura atual.
        * Ícone representativo da condição do tempo.
        * Descrição textual da condição (ex: "Nublado").
    * A aplicação também trata e exibe estados de carregamento (`loading`) e mensagens de erro para o usuário.

* ✅ **Uso do Armazenamento Local do Celular:**
    * O aplicativo utiliza o `AsyncStorage` para salvar a última cidade pesquisada com sucesso pelo usuário.
    * Ao iniciar o app novamente, ele busca automaticamente os dados de clima para essa última cidade, melhorando a experiência do usuário.


## 🚀 Como Executar o Projeto

Para rodar e testar o projeto, siga os passos:

1.  **Clone este repositório**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    ```

2.  **Acesse a pasta do projeto**
    ```bash
    cd seu-repositorio
    ```

3.  **Instale as dependências**
    ```bash
    npx expo install
    ```

4.  **Inicie o aplicativo**
    ```bash
    npx expo start
    ```
    Após iniciar, escaneie o QR Code com o aplicativo **Expo Go** em seu celular.

## 🛠️ Tecnologias Utilizadas

* React Native
* Expo
* JavaScript / TypeScript
* Axios (para chamadas à API)
* AsyncStorage (para armazenamento local)