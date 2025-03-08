import axios from 'axios';
import express from 'express';

const port = 3000;
const app = express();
app.use(express.json());

const queue = [];
const routingTable = {
  'new_pet': { 'method': 'post', 'endpoint': 'http://mail-service:3000/batch' }
};

app.post('/push', (req, res) => {
  const { event, data } = req.body;
  if (!event || !data) {
    return res.status(404).json({ 'error': 'Event and data are required' });
  }

  if (!routingTable[event]) {
    return res.status(404).json({ 'error': 'Invalid event' });
  }

  const message = { event, data };
  queue.push(message);

  console.log({ 'success': 'Message added to queue', 'details': message });
  res.status(200).json({ 'success': 'Message added to queue', 'details': message });
});

const processQueue = async () => {
  if (queue.length == 0) {
    return;
  }

  const { event, data } = queue.shift();
  const { method, endpoint } = routingTable[event];

  await axios({
    method: method,
    url: endpoint,
    data: method === 'get' ? undefined : data
  })
    .then(() => {
      console.log({
        'success': 'Routed message to service',
        'details': {
          'event': event,
          'data': data,
          'method': method,
          'endpoint': endpoint
        }
      });
    })
    .catch(() => {
      console.log({
        'failed': 'Could not route message to service',
        'details': {
          'event': event,
          'data': data,
          'method': method,
          'endpoint': endpoint
        }
      });
      queue.push({ event, data });
    });
};

setInterval(processQueue, 2000);

app.listen(port, () => {
  console.log(`Message Queue Server running on http://localhost:${port}`);
});

export { queue, routingTable };
