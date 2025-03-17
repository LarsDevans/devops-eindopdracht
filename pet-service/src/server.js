import axios from 'axios';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname);

const endpoint = 'http://message-queue:3000/push';
const events = {
  newPet: 'new_pet'
};

const pets = [];

app.get('/pets', (req, res) => {
  res.render('pets', { pets: pets });
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

  console.log({ 'success': 'Pet added to database', 'details': pet });
  res.redirect('/pets');
});

app.listen(port, () => {
  console.log(`Pet Service running on http://localhost:${port}`);
});

export { pets };
