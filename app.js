const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.post('/updateSiteMap', (req, res) => {
    const challenge = req.body.challenge;

    res.status(200).json({
        challenge
    });
});
app.get('*/*', function(req, res) {
    res.send('🎄🎄🎄🎄🎄Vrolijke kerst mijn liefste liefje!!!!!!! 😘😘😘😘😘');
});

let port = process.env.PORT || 3000;

app.listen(port, () => console.log(`app listening on port ${port}`));
