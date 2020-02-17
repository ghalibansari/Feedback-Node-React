import mongoose from 'mongoose';

//db connection settings here.
const MONGO_URI = 'mongodb://';
console.info(`Listening on port ${27017}`);
mongoose.connect(MONGO_URI, {useNewUrlParser: true});
mongoose.connection.once('open', () => {
    console.info('Connected to Mongo via Mongoose');
});

//while connection error message when fails to connect.
mongoose.connection.on('error', (err) => {
console.error('Unable to connect to Mongo via Mongoose', err);
});