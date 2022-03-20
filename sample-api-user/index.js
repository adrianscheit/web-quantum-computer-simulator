const http = require('http');

const server = http.createServer((req, res) => {
    console.log(Date.now(), req.method, req.url, req.headers);
    req.on('data', (chunk) => {
        console.log(chunk.toString());
    });
    res.statusCode = 201;
    res.end();
});

const port = 12345;
server.listen(port, () => console.log(
    encodeURI(
        `http://localhost:4200#[{"gn":"X","qi":[0]},{"gn":"H","qi":[1]},{"gn":"CX","qi":[1,2]},{"gn":"CX","qi":[0,1]},{"gn":"H","qi":[0]},{"gn":"CX","qi":[1,2]},{"gn":"CZ","qi":[0,2]}]#http://localhost:${port}/?results=`
    )
));
