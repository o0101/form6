const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname));

app.post('/test_api', async (req,res) => {
  res.type('json');
  res.header('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(req.body));
});

app.listen(8080);
