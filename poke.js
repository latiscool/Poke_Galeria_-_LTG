const axios = require('axios');
const http = require('http');
const url = require('url');
const fs = require('fs');
const open = require('open');
const PORT = 3000;
const host = 'localhost';
const urlBase = 'https://pokeapi.co/api/v2/pokemon?limit=20';
let lista = [];

open(`http://${host}:${PORT}/`, function (err) {
  if (err) throw err;
});

const requestListener = (req, res) => {
  //BLOQUE HTML
  if (req.url == '/') {
    res.writeHead(200, { 'Contente-Type': 'text/html' });
    fs.readFile('index.html', 'utf-8', (err, html) => {
      if (err) {
        console.log('Ha ocurrida una Falla : ' + err);
      }
      res.end(html);
    });
  }
  //BLOQUE POKE
  if (req.url.startsWith('/pokemones')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    //IIFE
    (async () => {
      await axios.get(urlBase).then((poke) => {
        let array = poke.data.results;
        array.map((p) => {
          getFullData(p.name).then((resultado) => {
            lista.push({
              nombre: `${resultado.name}`,
              img: `${resultado.sprites.front_default}`,
            });
          });
        });
        Promise.all(lista).then((data) => {
          res.end(JSON.stringify(data));
        });
      });
    })();

    ///Pasando al getFullData el ARGUMENTO nombre a la funcion IIFE, linea 30
    const getFullData = async (name) => {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      return data;
    };
  }
};
//BLOQUE LEVANTANDO SERVER
const server = http.createServer(requestListener);
server.listen(PORT, host, () => {
  console.log(`El servidor se esta ejecutando en http://${host}:${PORT}`);
});
