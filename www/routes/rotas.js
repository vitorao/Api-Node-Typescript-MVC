"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regrasController_1 = require("../controllers/regrasController");
class Rotas {
    constructor(app) {
        this.regrasCtrl = new regrasController_1.RegrasController();
        this.app = app;
        this.iniciaRotas();
    }
    iniciaRotas() {
        this.app.post('/regras/cadastrar', (req, res) => this.regrasCtrl.cadastrarRegra(req, res));
        this.app.get('/regras/listar/todas', (req, res) => this.regrasCtrl.listarRegras(req, res));
        this.app.delete('/regras/remover/:id', (req, res) => this.regrasCtrl.removerRegra(req, res));
        this.app.get('/regras/listar', (req, res) => this.regrasCtrl.listarRegraFiltrada(req, res));
    }
}
exports.Rotas = Rotas;
//# sourceMappingURL=rotas.js.map