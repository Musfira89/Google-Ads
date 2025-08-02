// tokenHelper.js
import fetch from 'node-fetch';

export const getGoogleAccessToken = async () => {
  const data = {
    client_id: '289675413278-6c5c79foi12gh1h9o3iaalrl6n21ntcr.apps.googleusercontent.com',
    client_secret: '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',
    refresh_token: '1//047tsl3_7WFP6CgYIARAAGAQSNwF-L9IrrYYeQY7OExs0KjOcKbimALPQDB87loMEyLgsjHk4nYjO82GJpNlNAqL71CTyvvrpErU',
    grant_type: 'refresh_token',
  };

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(data),
  });

  const json = await res.json();
  return json.access_token;
};
