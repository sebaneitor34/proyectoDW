import { config } from 'dotenv';
config();

export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = `mongodb://${process.env.EVENTS_APP_MONGODB_HOST}/${process.env.EVENTS_APP_MONGODB_DATABASE}`;
