import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('no moikkelis moi');
});

app.listen(1234, () => console.log('app is listening http://localhost:1234'));
