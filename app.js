const express = require('express');
const app = express();
const sql = require('mssql')
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home');
});
app.get('/timesheet', function(req, res) {
    res.render('timesheet');
});
app.get('/apontar', function(req, res) {
    res.render('apontar');
});

app.get('/dados', async(req, res) => {
    var dados
    try {
        const timesheets = []
        await sql.connect('mssql://sa:1fb3c9Ua@192.168.1.80/METABASE')
        const result = await sql.query `SELECT * FROM V_TIME_SHEET WHERE RECURSO='0003' AND PERIODO='20201217' ORDER BY RECURSO,DATA_HORA_INI DESC`
        var rows = result.rowsAffected[0]
        console.log(rows)
        dados = result.recordset
        var k = 1
        var recurso = dados[k].RECURSO
        var recAtu = dados[k].RECURSO
        while (recurso == recAtu && k < rows - 1) {
            console.log(dados[k].RECURSO + recurso)

            const apontamentos = []
            console.log(k)

            while (recurso == recAtu && k < rows) {
                console.log(dados[k])
                console.log(k)
                const item = dados[k]

                var min_inicial_px = Math.round(915 / 1440 * item.MINUTO_INICIAL, 0)
                var tempo_px = Math.round(915 / 1440 * item.TEMPO_MINUTOS, 0)
                apontamentos.push({
                    "tipo": item.TIPO,
                    "op": item.OP,
                    "produto": item.PRODUTO,
                    "motivo": item.DESC_MOTIVO,
                    "data_hora_ini": item.DATA_HORA_INI,
                    "data_hora_fim": item.DATA_HORA_FIM,
                    "duracao": tempo_px,
                    "motivo": item.DESC_MOTIVO,
                    "minuto_inicial": min_inicial_px,
                })
                k = k + 1
                if (k < rows) {
                    recAtu = dados[k].RECURSO
                } else {
                    recAtu = ''
                }

            }
            timesheets.push({
                "recurso": recurso,
                "apontamentos": apontamentos
            })
        }
        console.log(timesheets)
        res.send(timesheets)

    } catch (err) {
        console.log(err)
    }
    /*    const timesheet = [{
            "recurso": "extrusora",
            "apontamentos": [{
                    "tipo": "producao",
                    "op": "012345",
                    "data_hora_ini": '12/17/2020 00:25',
                    "data_hora_fim": '12/17/2020 00:35',
                    "duracao": 10,
                    "minuto_inicial": 25
                },
                {
                    "tipo": "producao",
                    "op": "012345",
                    "data_hora_ini": '12/17/2020 01:25',
                    "data_hora_fim": '12/17/2020 02:35',
                    "duracao": 70,
                    "minuto_inicial": 85
                },
            ]
        }, {
            "recurso": "revisao",
            "apontamentos": [{
                    "tipo": "producao",
                    "op": "012345",
                    "data_hora_ini": '12/17/2020 00:25',
                    "data_hora_fim": '12/17/2020 00:35',
                    "duracao": 10,
                    "minuto_inicial": 25
                },
                {
                    "tipo": "producao",
                    "op": "012345",
                    "data_hora_ini": '12/17/2020 01:25',
                    "data_hora_fim": '12/17/2020 02:35',
                    "duracao": 80,
                    "minuto_inicial": 155
                },
                {
                    "tipo": "parada",
                    "motivo": "troca de turno",
                    "data_hora_ini": '12/17/2020 14:25',
                    "data_hora_fim": '12/17/2020 14:45',
                    "duracao": 20,
                    "minuto_inicial": 865
                },
            ]
        }]
        console.log(timesheet)
        res.send(timesheet)
    */
})

app.listen(3001)