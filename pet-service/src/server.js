import axios from 'axios';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const port = 3000;
const app = express();
app.use(express.json());

const endpoint = 'http://message-queue:3000/push';
const events = {
  newPet: 'new_pet'
};

const pets = [];

app.get('/pets', (req, res) => {
  res.status(200).json(pets);
});

app.post('/pets', async (req, res) => {
  const { kind, name, photo } = req.body;
  if (!kind || !name || !photo) {
    return res.status(404).json({ 'error': 'Kind, name, and photo are required' });
  }

  const pet = { 'id': uuidv4(), kind, name, photo };
  pets.push(pet);

  await axios.post(endpoint, {
    event: events.newPet,
    data: pet
  });

  res.status(200).json({ 'success': 'Pet added to database', 'details': pet });
});

app.listen(port, () => {
  console.log(`Pet Service running on http://localhost:${port}`);
});

export { pets };
