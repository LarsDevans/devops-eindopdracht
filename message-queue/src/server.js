import  express from 'express';
import axios from 'axios';

const port = 3000;
const app = express();
app.use(express.json());

// In-memory message queue
const queue = [];
const routingTable = {
  'test_event': 'https://localhost:3000/blank_endpoint',
  'pet_add_event': 'https://pet-service:3000'
};

app.get('/', (req, res) => {
  res.json({ 'message': 'If you can read this message, assume the app is working correctly :)' });
});

app.post('/queue', (req, res) => {
  const { event, data } = req.body;
  if (!event || !data) {
    return res.status(400).json({ 'message': 'Event and data are required' });
  }

  if (!routingTable[event]) {
    return res.status(400).json({ 'message': 'Invalid event' });
  }

  queue.push({ event, data });
  res.json({ 'message': 'Message added to queue' });
});

const processQueue = async () => {
  if (queue.length == 0) {
    return;
  }

  const { event, data } = queue.shift();
  if (!event || !data) {
    return;
  }

  console.log({ 'event': event, 'data': data });

  const endpoint = routingTable[event];
  await axios.post(endpoint, data)
    .catch(() => {
      // Simply put the failed message back in the queue
      queue.push({ event, data });
    });
};

// Process an event every two seconds
setInterval(processQueue, 2000);

app.listen(port, () => {
  console.log(`Message Queue Server running on http://localhost:${port}`);
});

export default queue;
