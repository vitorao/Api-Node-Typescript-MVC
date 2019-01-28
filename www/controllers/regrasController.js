"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regrasModel_1 = require("../models/regrasModel");
const moment = require("moment");
class RegrasController {
    constructor() {
        this.regrasModel = new regrasModel_1.RegrasModel;
    }
    /**
     * @param req
     * @param res
     * @description Realiza a criação de um array de regras de acordo o objeto abaixo
     * @example
     * [
            {
                "intervals": [{"star": "10:10", "end": "20:10"}],
                "type": "weekly", //'daily' ou 'oneday'
                "day": null, //DD-MM-YYYY ou null em caso do tipo ser diferente de 'oneday'
                "daysOfWeek": [ "domingo", "terca" ] //no caso de type = weekly
            }
        ]
     */
    cadastrarRegra(req, res) {
        let flag_validar = req.query.validar;
        this.validaRegra(req.body).then(regras => {
            if (regras["valido"] && (flag_validar == 'true' || flag_validar == undefined)) {
                this.helperCadastrarRegras(res, regras);
            }
            else if (flag_validar == 'false') {
                this.helperCadastrarRegras(res, regras);
            }
            else {
                res.json({
                    message: "infelizmente uma das regras cadastradas é invalida",
                    status: 0,
                    code: "invalid_data",
                    data: regras["regras"]
                });
            }
        });
    }
    /**
     * @param res
     * @param regras
     * @description Recebe o response da requesicao e as regras a serem inseridas
     */
    helperCadastrarRegras(res, regras) {
        this.regrasModel.cadastrarRegra(regras["regras"]).then((data) => {
            res.json({
                message: "Regras cadastradas com sucesso",
                status: 1,
                code: "sucess",
                data: data
            });
        }).catch((err) => {
            res.json({
                message: "Ocorreu um erro ao cadastrar regra",
                status: 0,
                code: "invalid_data",
                data: err
            });
        });
    }
    /**
     * @param regras
     * @description Realiza a verificação das regras e converde day para unix ao qual
     * se torna simples a conversao posteriormente
     * @example this.validaRegra(regras: Array<RegraHorario>);
     */
    validaRegra(regras) {
        return new Promise((response, erro) => {
            //Iterador asyncrono para executar funções assíncronas dentro de um 'FOR'
            this.iterar(0, regras, (pos, regras, next) => {
                //Modifica o formato DD-MM-YYYY para unix timestamp;
                if (regras[pos].day)
                    regras[pos].day = String(moment(regras[pos]["day"], "DD-MM-YYYY").unix());
                //Verifica cada regra se ja existe um no dia ou tipos iguais
                this.regrasModel.verificaRegras(regras[pos].day, regras[pos].type).then(valido => {
                    if (valido)
                        next();
                    else {
                        regras[pos]["valido"] = false;
                        response({ valido: false, regras: regras });
                    }
                });
            }, done => {
                response({ valido: true, regras: regras });
            });
        });
    }
    /**
     * @param req
     * @param res
     * @description Recebe por querystring um periodo para filtrar as datas disponiveis
     * -> Optou-se for realizar o calculo das datas para economizar espaço de armazenamento
     */
    listarRegraFiltrada(req, res) {
        if (req.query.inicial == undefined || req.query.final == undefined) {
            res.json({
                message: "Ocorreu ao listar regras",
                status: 0,
                code: "invalid_params"
            });
        }
        let dia_inicial = moment(req.query.inicial, "DD-MM-YYYY").unix();
        let dia_final = moment(req.query.final, "DD-MM-YYYY").unix();
        //Lista todas as regras com o periodo determinado
        this.regrasModel.listarRegraFiltrada(String(dia_inicial), String(dia_final)).then((regras) => {
            let hasDiario = false;
            let regras_final = [];
            //Verifica se existe alguma regra diaria
            // -> Se existir, ignora todas as condições posteriores
            regras.map(regra => {
                if (regra.day === null && regra.type == "daily") {
                    let data_atual = Number(dia_inicial);
                    hasDiario = true;
                    do {
                        regra.day = moment.unix(data_atual).format("DD-MM-YYYY");
                        data_atual += 86400;
                        regras_final.push({
                            day: regra.day,
                            intervals: regra.intervals
                        });
                    } while (Number(data_atual) < Number(dia_final));
                }
            });
            //Verifica se não existe diario então verifique se exite semanal
            // -> Verifica regra semanal, caso não exista inclua as de dias fixos
            if (!hasDiario)
                regras.map(regra => {
                    let days_of_week = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
                    if (regra.day === null && regra.type == "weekly") {
                        let data_atual = Number(dia_inicial);
                        do {
                            regra.daysOfWeek.map(week => {
                                let day = moment.unix(data_atual).weekday();
                                if (week == days_of_week[day]) {
                                    regras_final.push({
                                        day: moment.unix(data_atual).format('DD-MM-YYYY'),
                                        intervals: regra.intervals
                                    });
                                }
                            });
                            data_atual += 86400;
                        } while (Number(data_atual) < Number(dia_final));
                    }
                    else if (regra.day) {
                        //Se existe uma data então insira na lista
                        regras_final.push({
                            day: moment.unix(regra.day).format('DD-MM-YYYY'),
                            intervals: regra.intervals
                        });
                    }
                });
            res.json(regras_final);
        }).catch((err) => {
            res.json({
                message: "Ocorreu ao remover regras",
                status: 0,
                code: "invalid_access"
            });
        });
    }
    /**
     * @param req
     * @param res
     * @description Remove uma regra de acordo o id passado
     */
    removerRegra(req, res) {
        let id_regra = req.params.id;
        this.regrasModel.removerRegra(id_regra).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json({
                message: "Ocorreu ao remover regras",
                status: 0,
                code: "invalid_access"
            });
        });
    }
    /**
     * @param req
     * @param res
     * @description Retorna todas as regras
     */
    listarRegras(req, res) {
        let regras_final = [];
        this.regrasModel.listarTodasRegras().then((data) => {
            data.map(regra => {
                regra.day = moment.unix(regra.day).format('DD-MM-YYYY');
            });
            res.json(data);
        }).catch((err) => {
            res.json({
                message: "Ocorreu ao listar regras",
                status: 0,
                code: "invalid_access"
            });
        });
    }
    /**
     * @param pos
     * @param array
     * @param iterator
     * @param done
     * @description Realiza uma 'FOR' para iterar funções assíncronas
     */
    iterar(pos, array, iterator, done) {
        if (pos < array.length) {
            iterator(pos, array, retorno => {
                pos++;
                this.iterar(pos, array, iterator, done);
            });
        }
        else {
            done(pos, array);
        }
    }
}
exports.RegrasController = RegrasController;
//# sourceMappingURL=regrasController.js.map