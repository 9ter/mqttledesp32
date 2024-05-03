const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');

const app = express();
const client = mqtt.connect('mqtt://broker.emqx.io');

app.use(bodyParser.json()); // เพิ่ม body-parser middleware

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Handle POST request to /led endpoint
app.post('/led', (req, res) => {
  const command = req.body.command; // รับค่า "command" จาก HTTP POST request
  console.log('Received command:', command);

  // Publish MQTT message based on the received command
  client.publish('esp32/led_builtin/ter', command, (err) => {
    if (err) {
      console.error('Error publishing MQTT message:', err);
      res.status(500).send('Error toggling LED');
    } else {
      const responseMessage = command === 'n' ? 'LED ON' : 'LED OFF';
      res.send(responseMessage);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
