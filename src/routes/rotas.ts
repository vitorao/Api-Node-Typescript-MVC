import { RegrasController } from '../controllers/regrasController';

export class Rotas {

    private app: any;
    private regrasCtrl = new RegrasController();

    constructor(app) {
        this.app = app;
        this.iniciaRotas();
    }   
    
    iniciaRotas(){
        this.app.post('/regras/cadastrar', (req, res) => this.regrasCtrl.cadastrarRegra(req, res));
        this.app.get('/regras/listar/todas', (req, res) => this.regrasCtrl.listarRegras(req, res));
        this.app.delete('/regras/remover/:id', (req, res) => this.regrasCtrl.removerRegra(req, res));
        this.app.get('/regras/listar', (req, res) => this.regrasCtrl.listarRegraFiltrada(req, res));
    }
}