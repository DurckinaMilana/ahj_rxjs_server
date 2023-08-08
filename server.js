const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { faker } = require('@faker-js/faker');

const app = express();

app.use(cors());
app.use(
  bodyParser.json({
    type() {
      return true;
    }
  })
);

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

let messages = [];
let timestamp = 1;
let timer = null;

app.get('/messages/unread/:time', (req, res) => {
  const time = Number(req.params.time);

  if (time === timestamp) {
    if (timer) return res.status(500).end();

    timer = setTimeout(() => {
      messages.push({
        id: faker.datatype.uuid(),
        from: faker.internet.email(),
        subject: 'Hello from ' + faker.internet.userName(),
        body: faker.lorem.word(),
        received: Date.now(),
      });

      timestamp = Date.now();
      timer = null;
    }, 5000);

    return res.status(500).end();
  };

  res.send(JSON.stringify({
    status: "ok",
    timestamp,
    messages,
  }))

  res.end();
})

const port = process.env.PORT || 7071;
app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});
