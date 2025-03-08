import assert from 'node:assert';
import axios from 'axios';
import test from 'node:test';

import { pets } from './server.js';

const endpoint = 'http://localhost:3000/pets';

test('that a correct pet will add', async () => {
  const pet = {
    'kind': 'Dog, Cocker Spaniel',
    'name': 'Joep',
    'photo': 'some_image_url',
  };

  // Test if the pet will add to the database
  await axios.post(endpoint, pet)
    .then((res) => {
      const expectedResponse = {
        'success': 'Pet added to database',
        'details': {
          'id': res.data.details.id,
          ...pet
        }
      };
      assert.deepStrictEqual(res.data, expectedResponse);
    });
  
  // Test is the database is updated
  await axios.get(endpoint)
    .then((res) => {
      assert.deepStrictEqual(pets, res.data);
    })
});
