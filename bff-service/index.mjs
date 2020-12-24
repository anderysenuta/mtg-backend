import express from 'express';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());


app.all('/*', (req, res) => {
  console.log(req.originalUrl);
  console.log(req.method);
  console.log(req.body);


  const recipient = req.originalUrl.split('/')[1];
  const recipientUrl = process.env[recipient]

  res.send();
});

app.listen(PORT, () => {
  console.log(`BFF application listening at http://localhost:${PORT}`)
})