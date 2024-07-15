import mongoose from 'mongoose';
import { MONGODB_URI } from './config.js';

console.log('MONGODB_URI:', MONGODB_URI);  // Verificación adicional

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err));