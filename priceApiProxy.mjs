import express from 'express';
import fetch from 'node-fetch';
import { type } from 'os';

const app = express();
const port = 4444;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/getProductInfoSvc.do', async (req, res) => {
    var params = req.query;
    console.log(params);
    var serviceKey = params['serviceKey'];
    var url = `http://openapi.price.go.kr/openApiImpl/ProductPriceInfoService/getProductInfoSvc.do?ServiceKey=${serviceKey}`;
    if (params['goodId'] != null) {
        url += '&goodId=' + params['goodId'];
    }
    console.log(url);
    try {
        const response = await fetch(url);
        const text = await response.text();
        console.log(text);
        res.send(text);
    } catch (error) {
        console.log('error');
        res.status(500).send('Error fetching data');
    }
});

app.get('/getStoreInfoSvc.do', async (req, res) => {
  var params = req.query;
  console.log(params);
  var serviceKey = params['serviceKey'];
  var url = `http://openapi.price.go.kr/openApiImpl/ProductPriceInfoService/getStoreInfoSvc.do?ServiceKey=${serviceKey}`;
  if (params['entpId'] != null) {
      url += '&entpId=' + params['entpId'];
  }
  console.log(url);
  try {
      const response = await fetch(url);
      const text = await response.text();
      console.log(text);
      res.send(text);
  } catch (error) {
    console.log('error');
    res.status(500).send('Error fetching data');
  }
});

app.get('/getProductPriceInfoSvc.do', async (req, res) => {
    var params = req.query;
    console.log(params);
    var serviceKey = params['serviceKey'];
    var url = `http://openapi.price.go.kr/openApiImpl/ProductPriceInfoService/getProductPriceInfoSvc.do?ServiceKey=${serviceKey}`;
    if (params['goodInspectDay'] != null) {
        url += '&goodInspectDay=' + params['goodInspectDay'];
    }
    if (params['entpId'] != null) {
        url += '&entpId=' + params['entpId'];
    }
    if (params['goodId'] != null) {
        url += '&goodId=' + params['goodId'];
    }
    console.log(url);
    try {
        const response = await fetch(url);
        const text = await response.text();
        console.log(text);
        res.send(text);
    } catch (error) {
        console.log('error');
        res.status(500).send('Error fetching data');
    }
  });

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});