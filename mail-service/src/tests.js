import assert from 'node:assert';
import axios from 'axios';
import test from 'node:test';

const endpoint = 'http://localhost:3000/batch';

test('that a mail will sent', async () => {
  const data = {
    'photo': 'http://some_image_url:3000/image.png'
  };
  
  await axios.post(endpoint, data)
    .then((res) => {
      const expectedResponse = { 'success': 'Mailed all subscribers' };
      assert.deepStrictEqual(res.data, expectedResponse);
    });
});
