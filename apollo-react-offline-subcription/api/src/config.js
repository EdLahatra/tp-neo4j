import dotenv from 'dotenv';

dotenv.config({ silent: true });

export const {
  JWT_SECRET,
  FIREBASE_SERVER_KEY,
  AWS_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION
} = process.env;

const defaults = {
  JWT_SECRET: 'secret',
  FIREBASE_SERVER_KEY:
    'AAAALZTyOD0:APA91bFIatpuRFWLiVZ-_Dj9ykjYBKJH0_bsrayHInxGvljxFUrUIWL91RnYnwS-RxJMw1JgQqfiF-ZxoEsnPnfG-KKfIUdDO7zuCk7mciUaz_jIaeDZVQDiqYFa5ZIy9jKCKDXL3rOJ',
  AWS_BUCKET: 'bucket',
  AWS_ACCESS_KEY_ID: '0311',
  AWS_SECRET_ACCESS_KEY: 'lanjara',
  AWS_REGION: 'region'
};

Object.keys(defaults).forEach(key => {
  if (!process.env[key] || process.env[key] !== defaults[key]) {
    throw new Error(
      `Please enter a custom ${key} in .env on the root directory`
    );
  }
});
