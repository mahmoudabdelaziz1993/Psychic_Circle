const express = require('express');
const port = process.env.PORT||3000;

const app = express();
//------------------------------middleware section ---------------
app.use(express.static('public'));


app.listen(port, () => console.log(` app on port ${port}!`));