import test from 'node:test';
import assert from 'node:assert';
import axios from 'axios';

import queue from './server.js';

const endpoint = 'http://localhost:3000/queue';

test('that a correct message will queue', async () => {
  const event = 'test_event';
  const data = { 'message': 'This message will not be seen' };

  await axios.post(endpoint, { event, data })
    .then((res) => {
      assert.deepStrictEqual(queue, [{ event, data }]);
      assert.deepEqual(res.data, { 'message': 'Message added to queue' });
    });
});

test('that an invalid body will not queue', async () => {
  await axios.post(endpoint, { })
    .catch((err) => {
      assert.deepEqual(err.response.data, { 'message': 'Event and data are required' });
    });
});

test('that an invalid event wil not queue', async () => {
  const event = 'wrong_event_name';
  const data = { 'message': 'This message will not be seen' };

  await axios.post(endpoint, { event, data })
    .catch((err) => {
      assert.deepEqual(err.response.data, { 'message': 'Invalid event' });
    });
});
