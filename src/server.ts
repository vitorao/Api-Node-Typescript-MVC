import * as express from "express";
import * as bodyParser from 'body-parser';
import { Rotas } from './routes/rotas';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const rotas = new Rotas(app);

app.listen(8080, () => {
    console.log('API Clinica Cubos rodando em http://localhost:8080');
});