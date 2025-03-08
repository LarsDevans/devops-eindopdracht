import express from 'express';

const port = 3000;
const app = express();
app.use(express.json());

const subscribers = [
  'john.doe@domein.nl',
  'jane.doe@domein.nl',
];

app.post('/batch', (req, res) => {
  const { photo } = req.body;
  if (!photo) {
    return res.status(404).json({ 'error': 'Photo is required' });
  }

  const output = {
    'success': 'Mail sent to all recipients',
    'recipients': subscribers,
    'pet_photo': photo
  };
  console.log(output);
  
  res.status(200).json({ 'success': 'Mailed all subscribers' });
});

app.listen(port, () => {
  console.log(`Message Queue Server running on http://localhost:${port}`);
});
