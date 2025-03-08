import assert from 'node:assert';
import axios from 'axios';
import test from 'node:test';

import { routingTable } from './server.js';

const endpoint = 'http://localhost:3000/push';

test('that a correct message will queue', async () => {
  const event = 'new_pet';
  const data = {
    'kind': 'Dog, Cocker Spaniel',
    'name': 'Joep',
    'photo': 'http://some_image_url:3000/image.png'
  };
  routingTable[event] = { 'method': 'post', 'endpoint': '' };

  await axios.post(endpoint, { event, data })
    .then((res) => {
      const expectedResponse = {
        'success': 'Message added to queue',
        'details': {
          'event': event,
          'data': {
            'kind': 'Dog, Cocker Spaniel',
            'name': 'Joep',
            'photo': 'http://some_image_url:3000/image.png'
          }
        }
      };
      assert.deepStrictEqual(res.data, expectedResponse);
    });
});
