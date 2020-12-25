import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();


const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());


const CACHED_REQUEST = '/products';
const CACHED_METHOD = 'GET';
const cache = new Map();

app.use('/products', (req, res, next) => {
  const cachedRequest = cache.get(CACHED_REQUEST);

  if (req.method !== CACHED_METHOD || !cachedRequest) {
    next();
    return;
  }

  const { expired, data } = cachedRequest;

  if (expired > new Date()) {
    res.json(data);
  } else {
    next();
  }
});


app.all('/*', (req, res) => {
  const recipient = req.originalUrl.split('/')[1];
  const recipientUrl = process.env[recipient];

  if (recipientUrl) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientUrl}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body })
    }

    axios(axiosConfig)
      .then(response => {
        console.log('response data from recipients', response.data);

        if (req.originalUrl === CACHED_REQUEST && req.method === CACHED_METHOD) {
          cache.set(CACHED_REQUEST, {
            expired: new Date().setMinutes(new Date().getMinutes() + 2),
            data: response.data
          });
        }

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