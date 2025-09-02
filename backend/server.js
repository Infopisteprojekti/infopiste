import express from 'express';
const app = express();
import cors from 'cors';

app.use(cors());

app.get('/', (req, res) => {
  res.send('no moikkelis moi');
});

app.listen(1234, () => console.log('app is listening http://localhost:1234'));
