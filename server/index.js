const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Campaign = require('./models/Campaign');
const Contact = require('./models/Contact');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/whatsapp_tool').then(() => {
    console.log("DB connected")
})

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Create a campaign
app.post('/api/campaigns', async (req, res) => {
  const { name, message } = req.body;
  const campaign = new Campaign({ name, message });
  await campaign.save();
  res.status(201).json(campaign);
});

// Upload contacts via CSV
app.post('/api/campaigns/:id/contacts', upload.single('file'), async (req, res) => {
  const campaignId = req.params.id;
  const contacts = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      contacts.push(new Contact({ campaign: campaignId, ...row }));
    })
    .on('end', async () => {
      await Contact.insertMany(contacts);
      res.status(201).json({ message: 'Contacts uploaded successfully!' });
    });
});

// Simulate sending messages
app.post('/api/campaigns/:id/send', async (req, res) => {
  const campaignId = req.params.id;
  const contacts = await Contact.find({ campaign: campaignId, sent: false });

  contacts.forEach(async (contact) => {
    setTimeout(async () => {
      contact.sent = true;
      await contact.save();
    }, Math.random() * 5000);
  });

  res.json({ message: 'Message sending initiated!' });
});

// Get campaign status
app.get('/api/campaigns/:id/status', async (req, res) => {
  const campaignId = req.params.id;
  const totalContacts = await Contact.countDocuments({ campaign: campaignId });
  const sentContacts = await Contact.countDocuments({ campaign: campaignId, sent: true });
  res.json({ total: totalContacts, sent: sentContacts, pending: totalContacts - sentContacts });
});

app.listen(3005, () => {
    console.log("Port no 3005")
})
