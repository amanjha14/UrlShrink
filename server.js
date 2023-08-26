const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl'); // Make sure to create this model

const app = express();

// Connect to the MongoDB database
mongoose.connect('mongodb+srv://amanjha2489:Yfvi1b6tdzFi49hR@cluster0.cds5ha8.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// Configure the app
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Define routes

// Display the list of short URLs
app.get('/', async (req, res) => {
  try {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new short URL
app.post('/shortUrls', async (req, res) => {
  try {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Redirect to the original URL when a short URL is accessed
app.get('/:shortUrl', async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

    if (!shortUrl) {
      return res.sendStatus(404);
    }

    // Increment the click count
    shortUrl.clicks++;
    await shortUrl.save();

    // Redirect to the original URL
    res.redirect(shortUrl.full);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
