import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { parse } from 'url';

const MATOMO_URL = 'https://matomo-test.sprsaas.com/matomo.php';
const SHOP_DOMAIN = '45mfgb-2i.myshopify.com';

export const trackPurchaseEvent = async ({
  email,
  order,
  siteId,
  gclid = '',
  googleLabel = '',
}) => {
  const landingSite = order?.landing_site || '';
  const parsedUrl = parse(landingSite, true);
  
  const pathname = parsedUrl.pathname?.replace(/^\/+/, '') || '';
  const search = parsedUrl.search || '';

  const finalUrl = `https://${SHOP_DOMAIN}/${pathname}${search}`.replace(/\/+$/, '') + '/thank-you';

  const urlParams = new URLSearchParams({
    rec: '1',
    idsite: siteId,
    uid: email,
    url: finalUrl,
    action_name: 'Order Complete',
    e_c: 'Funnel',
    e_a: 'Purchase',
    ec_id: order.name || '',
    revenue: order.total_price || '0',
    currency: order.currency || 'EUR',
    rand: Math.random().toString(),
  });

  if (gclid) {
    urlParams.append('_rcn', 'Google Ads');
    urlParams.append('_rck', gclid);
  }

  if (googleLabel) {
    urlParams.append('dimension1', googleLabel);
  }

  const url = `${MATOMO_URL}?${urlParams.toString()}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok || !text.startsWith('GIF89a')) {
      console.error('❌ Matomo tracking failed:', response.status, text);
      throw new Error('Matomo tracking failed');
    }

    console.log('✅ Matomo tracked:', {
      orderId: order.name,
      email,
      gclid,
      finalUrl,
    });
  } catch (error) {
    console.error('❌ Matomo error:', error.message);
    throw error;
  }
};
