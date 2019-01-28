import { RegraHorario } from '../interfaces/interfaces';
import * as rethinkdb from 'rethinkdb';

export class RegrasModel {

    constructor(){
    }

    /**
     * @param regra 
     * @description Inclui regras no banco de dados
     * @example this.cadastrarRegra(regra: Array<RegraHorario>);
     */
    public cadastrarRegra(regra: Array<RegraHorario>){
        return new Promise((response, erro)=>{
            rethinkdb.connect({host: '127.0.0.1', port: 28015, db: "cubos"}, (err, conexao)=>{
                rethinkdb.table("regras").insert(regra).run(conexao, (err, result) => {
                    conexao.close();
                    if (err) erro(err);
                    else response(result);
                });
            }).catch(err=>{
                erro("Erro ao abrir conexao com o banco");
            });
        });
    }

    /**
     * @description Lista todas as regras com todos valores salvos no banco
     * @example this.listarTodasRegras()
     */
    public listarTodasRegras(){
        return new Promise((response, erro)=>{
            rethinkdb.connect({host: '127.0.0.1', port: 28015, db: "cubos"}, (err, conexao)=>{
                rethinkdb.table("regras").run(conexao, (err, cursor) => {
                    cursor.toArray(function(error, results) {
                        if (error) throw error;
                        response(results);
                    });
                });
            }).catch(err=>{
                erro("Erro ao abrir conexao com o banco");
            });
        });
    }

    /**
     * @param id_regra 
     * @example this.removerRegra(id_regra: String);
     */
    public removerRegra(id_regra: String){
        return new Promise((response, erro)=>{
            rethinkdb.connect({host: '127.0.0.1', port: 28015, db: "cubos"}, (err, conexao)=>{
                rethinkdb.table("regras").filter({"id": id_regra}).delete().run(conexao, (err, result) => {
                    if (err) erro(err);
                    else response(result);
                    conexao.close();
                });
            }).catch(err=>{
                erro("Erro ao abrir conexao com o banco");
            });
        });
    }

    /**
     * @param dia_inicial 
     * @param dia_final 
     * @example this.listarRegraFiltrada(dia_inicial, dia_final);
     */
    public listarRegraFiltrada(dia_inicial, dia_final){
        return new Promise((response, erro)=>{
            rethinkdb.connect({host: '127.0.0.1', port: 28015, db: "cubos"}, (err, conexao)=>{
                rethinkdb.table("regras")
                    .filter(
                        rethinkdb.row("day").gt(dia_inicial)
                        .and( rethinkdb.row("day").lt(dia_final) )
                        .or( rethinkdb.row("day").eq(null) ) //rethink não tinha o 'ne' na doc
                    )
                    .run(conexao, (err, cursor) => {
                        conexao.close();
                        cursor.toArray((err, result)=>{
                            if (err) erro(err);
                            else response(result);
                        })    
                });
            }).catch(err=>{
                erro("Erro ao abrir conexao com o banco");
            });
        });
    }

    public verificaRegras(dia, tipo = ""){
        return new Promise((response, erro)=>{
            rethinkdb.connect({host: '127.0.0.1', port: 28015, db: "cubos"}, (err, conexao)=>{
                rethinkdb.table("regras")
                    .filter(
                        rethinkdb.row("day").eq(dia)
                        .and( rethinkdb.row("type").eq(tipo))
                    )
                    .run(conexao, (err, cursor) => {
                        conexao.close();
                        cursor.toArray((err, result)=>{
                            if (err) erro(err);
                            else{
                                if(result.length == 0)
                                    response(true);
                                else
                                    response(false);
                            }
                        })    
                });
            }).catch(err=>{
                erro("Erro ao abrir conexao com o banco");
            });
        });
    }
        
}