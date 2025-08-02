import db from './db.js'; // assuming you have a DB connection file

export async function saveMatomoEvent(event) {
  const {
    category,
    action,
    label,
    value,
    pageUrl,
    formData,
    timestamp = new Date().toISOString()
  } = event;

  const query = `
    INSERT INTO mtm_events (category, action, label, value, page_url, form_data, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [category, action, label, value, pageUrl, JSON.stringify(formData || {}), timestamp];

  await db.query(query, values);
}
