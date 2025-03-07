import express from 'express';
import axios from 'axios';

const port = 3000;
const app = express();
app.use(express.json());

const messageQueueServerURL = 'http://message-queue:3000/queue';

const events = {
  pet_added: 'pet_add_event'
};
const pets = [];

app.get('/pets', (req, res) => {
  res.json(pets);
});

app.post('/pets', async (req, res) => {
  const { pet } = req.body;
  if (!pet) {
    return res.status(400).json({ 'message': 'Pet is required' });
  }

  const { name, age, breed } = pet;
  if (!name || !age || !breed) {
    return res.status(400).json({ 'message': 'Name, age, and breed are required' });
  }

  await axios.post(messageQueueServerURL, {
    event: events.pet_added,
    data: { name, age, breed }
  });

  pets.push({ name, age, breed });
  res.json({ 'message': 'Pet added to database' });
});

app.listen(port, () => {
  console.log(`Pet Service running on http://localhost:${port}`);
});

export default pets;
