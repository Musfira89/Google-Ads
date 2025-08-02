import fs from 'fs';
const CACHE_FILE = './sentOrders.json';

let sentOrders = new Set();

export const loadCache = () => {
  if (fs.existsSync(CACHE_FILE)) {
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    const list = JSON.parse(raw || '[]');
    sentOrders = new Set(list);
  }
};

export const saveCache = () => {
  fs.writeFileSync(CACHE_FILE, JSON.stringify([...sentOrders]), 'utf-8');
};

export const isOrderTracked = (orderName) => {
  return sentOrders.has(orderName);
};

export const markOrderAsTracked = (orderName) => {
  sentOrders.add(orderName);
  saveCache();
};
