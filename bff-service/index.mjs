import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();


const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());


app.all('/*', (req, res) => {
  console.log(req.originalUrl);
  console.log(req.method);
  console.log(req.body);

  const recipient = req.originalUrl.split('/')[1];
  const recipientUrl = process.env[recipient]

  console.log('===');
  console.log(recipientUrl);

  if (recipientUrl) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientUrl}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body })
    }

    axios(axiosConfig)
      .then(response => {
        console.log('response data from recipients', response.data);
        res.json(response.data);
      })
      .catch(err => {
        console.error('some error',err);

        if (err.response) {
          const { status, data } = err.response;
          res.status(status).json(data);
        } else {
          res.status(500).json({error: err.message})
        }
      })
  } else {
    res.status(502).json({error: 'Cannot process request'})
  }

});

app.listen(PORT, () => {
  console.log(`BFF application listening at http://localhost:${PORT}`)
})