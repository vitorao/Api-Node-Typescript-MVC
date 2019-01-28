"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const rotas_1 = require("./routes/rotas");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const rotas = new rotas_1.Rotas(app);
app.listen(8080, () => {
    console.log('API Clinica Cubos rodando em http://localhost:8080');
});
//# sourceMappingURL=server.js.map