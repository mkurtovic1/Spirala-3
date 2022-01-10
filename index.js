const express = require('express');
const fs = require('fs');
const body_parser = require('body-parser');

const app = express();
app.use(body_parser.json());
app.use(express.static('public'));

const is_string_int = (str) => {
    return Number.parseInt(str).toString() === str;
}

app.get('/vjezbe', (req, res) => {
    fs.readFile('vjezbe.csv', 'utf-8', (err, data) => {
       if(err) return res.send({
           status: 'error',
           data: err
       });
        const cols = data.split(",");
        let csv_valid = true;
        cols.forEach((col) => {
            if(!is_string_int(col) || Number.parseInt(col) < 1) csv_valid = false;
        });
        if(!csv_valid) return res.send({
            status: 'error',
            data: "Datoteka 'vjezbe.csv' nije validna"
        });
        const brojVjezbi = Number.parseInt(cols[0]);
        const brojZadataka = [...cols.map((col) => Number.parseInt(col)).filter((col, index) => index)];
        if(brojVjezbi !== brojZadataka.length) return res.send({
            status: 'error',
            data: "Broj vjezbi se ne podudara sa brojem broja zadataka"
        });
        res.send({
            brojVjezbi,
            brojZadataka
        });
    });
});

app.post('/vjezbe', ({body}, res) => {
    const broj_vjezbi = body?.brojVjezbi;
    const broj_zadataka = body?.brojZadataka;
    const errors = [];
    if(!broj_vjezbi || !Number.isInteger(broj_vjezbi) || broj_vjezbi !== broj_zadataka.length)
        errors.push('brojVjezbi');
    broj_zadataka.forEach((el,index) => {
        if(!Number.isInteger(el) || el < 1) errors.push('z' + (index+1));
    });
    if(errors.length !== 0) return res.send({
        status: 'error',
        data: 'Pogrešan parametar ' + errors
    });
    fs.writeFile('vjezbe.csv', [broj_vjezbi, ...broj_zadataka ].toString(), (err, data) => {
        if(err) return res.send({
            status: 'error',
            data: err
        });
        res.send(body);
    });
});


app.listen(8080);