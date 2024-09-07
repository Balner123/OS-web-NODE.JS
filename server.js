const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware pro zpracování dat z formuláře
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Statická složka pro HTML, CSS a JavaScript
app.use(express.static('public'));

// API pro získání příspěvků
app.get('/prispevky', (req, res) => {
    fs.readFile('prispevky.json', (err, data) => {
        if (err) {
            return res.status(500).send("Chyba při načítání příspěvků.");
        }
        const prispevky = JSON.parse(data);
        res.json(prispevky);
    });
});

// API pro přidání nového příspěvku
app.post('/add', (req, res) => {
    const newPrispevek = req.body.prispevek;

    // Načtení existujících příspěvků
    fs.readFile('prispevky.json', (err, data) => {
        if (err) {
            return res.status(500).send("Chyba při načítání příspěvků.");
        }

        const prispevky = JSON.parse(data);

        // Přidání nového příspěvku
        prispevky.push(newPrispevek);

        // Zápis zpět do souboru
        fs.writeFile('prispevky.json', JSON.stringify(prispevky), (err) => {
            if (err) {
                return res.status(500).send("Chyba při ukládání příspěvku.");
            }

            res.status(200).json({ message: "Příspěvek uložen." });
        });
    });
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});
