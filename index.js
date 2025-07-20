require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');
const app = express();

// Connect to database
connectDB();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const dns = require('dns');
const url = require('url');
const Url = require('./url.model');

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  const { url: originalUrl } = req.body;
  const urlRegex = /^(http|https):\/\/[^ "]+$/;

  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const { hostname } = url.parse(originalUrl);

  dns.lookup(hostname, async (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    try {
      let url = await Url.findOne({ original_url: originalUrl });

      if (url) {
        return res.json({
          original_url: url.original_url,
          short_url: url.short_url,
        });
      }

      const urlCount = await Url.countDocuments();
      const shortUrl = urlCount + 1;

      url = new Url({
        original_url: originalUrl,
        short_url: shortUrl,
      });

      await url.save();

      res.json({
        original_url: url.original_url,
        short_url: url.short_url,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  });
});

app.get('/api/shorturl/:short_url', async (req, res) => {
  try {
    const url = await Url.findOne({ short_url: req.params.short_url });

    if (url) {
      return res.redirect(url.original_url);
    } else {
      return res.status(404).json('No URL found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
