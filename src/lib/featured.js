// Well-known names surface first in the marquee and collection previews.
export const FEATURED = [
  'Anthropic', 'Stripe', 'Netflix', 'Vercel', 'Cloudflare', 'Figma', 'Airbnb', 'Linear',
  'OpenAI', 'Discord', 'Shopify', 'Supabase', 'Spotify', 'GitHub', 'Notion', 'Slack',
  'Cursor', 'Hugging Face', 'Dropbox', 'Uber', 'Swiggy', 'Razorpay', 'Canva', 'Lyft',
  'DoorDash', 'Datadog', 'HashiCorp', 'Coinbase', 'Instagram', 'Pinterest', 'Zomato', 'CRED',
  'Google DeepMind', 'Mistral AI', 'Flipkart', 'PhonePe', 'Robinhood', 'MongoDB', 'Elastic', 'Twilio',
];

const rankOf = new Map(FEATURED.map((name, i) => [name, i]));

export function byFeatured(a, b) {
  const ra = rankOf.has(a.name) ? rankOf.get(a.name) : Infinity;
  const rb = rankOf.has(b.name) ? rankOf.get(b.name) : Infinity;
  return ra - rb;
}
