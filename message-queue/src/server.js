import axios from 'axios';
import express from 'express';

const port = 3000;
const app = express();
app.use(express.json());

const queue = [];
const routingTable = {
  'new_pet': { 'method': 'post', 'endpoint': 'http://localhost:3000/blank' }
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
    .catch(() => {
      queue.push({ event, data });
    });
};

setInterval(processQueue, 2000);

app.listen(port, () => {
  console.log(`Message Queue Server running on http://localhost:${port}`);
});

export { queue, routingTable };
