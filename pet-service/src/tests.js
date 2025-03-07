import test from 'node:test';
import assert from 'node:assert';
import axios from 'axios';

import pets from './server.js';

const endpoint = 'http://localhost:3000/pets';

test('that a correct pet will add', async () => {
  await axios.post(endpoint, {
    'pet': {
      'name': 'Joep',
      'age': '11',
      'breed': 'Cocker Spaniel'
    }
  })
    .then(async (res) => {
      await axios.get(endpoint)
        .then((res) => {
          assert.deepEqual(res.data, pets);
        });
      assert.deepEqual(res.data, { 'message': 'Pet added to database' });
    });
});
