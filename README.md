### Link POSTMAN dos Endpoints e exemplos de requisições
https://documenter.getpostman.com/view/1208373/RztiuqRv

### Arquitetura da API
```
│   package-lock.json
│   package.json
│   tsconfig.json
├───src
│   │   server.ts
│   ├───controllers
│   │       regrasController.ts
│   ├───interfaces
│   │       interfaces.ts
│   ├───models
│   │       regrasModel.ts
│   └───routes
│           rotas.ts
└───www
    | build files
 ```
 
 ### Executanto a API
Instalar os pacotes npm
```sh
$ npm install
```
Executar em modo de desenvolvimento e watch
```sh
$ npm run watch
```
Ou apenas executar em modo devesenvolvimento
```sh
$ npm run dev
```
Ou em modo de produção
```sh
$ npm run prod
```

### Considerações
- Os métodos estão decorados com os seus parâmetros, descrição e até mesmo exemplos. Para melhor visualizarem utilizem o VSCODE;
- A estrutura do projeto faz utiliza o modelo MVC ( Model, View e Controller ) porém sem a utilização de views;
- O algoritmo desenvolvido não salva os registro diariamente, sendo assim é necessário realizar o processamento de alguns dados no caso de um filtro por exemplo. Algo que pode-se tornar relevante é o custo do processamento, que para resolve-lo deveria se alternar e consumir mais armazenamento
