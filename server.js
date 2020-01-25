const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION💥 Shutting down the server...');
  console.log(err);

  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    // .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(con => console.log(`DB connection established`))
  .catch(err => console.log('ERROR'));

const app = require('./app');

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION💥 Shutting down the server...');
  server.close(() => {
    process.exit(1);
  });
});
