const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.send('🎄🎄🎄🎄🎄Vrolijke kerst mijn liefste liefje!!!!!!! 😘😘😘😘😘');
});

let port = process.env.PORT || 3000;

app.listen(port, () => console.log(`app listening on port ${port}`));
