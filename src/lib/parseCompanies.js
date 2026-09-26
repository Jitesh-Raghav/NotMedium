const MEDIUM_SLUG_DOMAINS = {
  'unacademy-engineering': 'unacademy.com',
  'bounceapp': 'bounce.com',
  'nobroker-tech': 'nobroker.com',
  'dunzo-it': 'dunzo.com',
  'udaan-engineering': 'udaan.com',
  'instamojo-tech': 'instamojo.com',
  'chingari-tech': 'chingari.io',
  'mercadolibre-tech': 'mercadolibre.com',
  'netflix-techblog': 'netflix.com',
  'criteo-labs': 'criteo.com',
  'strava-engineering': 'strava.com',
  'zendesk-engineering': 'zendesk.com',
  'yammer-engineering': 'yammer.com',
  'expedia-group-tech': 'expedia.com',
  'bbc-design-engineering': 'bbc.co.uk',
  'feedzaitech': 'feedzai.com',
  'retailmenot-engineering': 'retailmenot.com',
  'helpshift-engineering': 'helpshift.com',
  'engineering-housing': 'housing.com',
  'wemake-services': 'wemake.services',
  'unexpected-token': 'efounders.com',
  'Pinterest_Engineering': 'pinterest.com',
  '@Pinterest_Engineering': 'pinterest.com',
};

const NAME_DOMAIN_OVERRIDES = {
  'Facebook AI Research': 'meta.com',
  'Google DeepMind': 'deepmind.google',
  'Amazon AWS Builders': 'aws.amazon.com',
  'Amazon Science': 'amazon.science',
  'Clear (ClearTax)': 'cleartax.in',
  'Weights & Biases': 'wandb.ai',
  'Character.AI': 'character.ai',
  'CSC - IT Center For Science - Cloud Team': 'csc.fi',
  'Tesla AI': 'tesla.com',
  'Figure AI': 'figure.ai',
  'Scale AI': 'scale.com',
  'Mistral AI': 'mistral.ai',
  'Canary Technologies': 'canarytechnologies.com',
  'Ola Cabs': 'olacabs.com',
  'Flipkart': 'flipkart.com',
  'Wise': 'wise.com',
  'Transferwise': 'wise.com',
};

const SUBDOMAIN_PREFIXES = new Set([
  'blog',
  'engineering',
  'tech',
  'bytes',
  'lambda',
  'developer',
  'builders',
  'labs',
  'code',
  'cloud',
  'medium',
]);

function getLogoDomain(url, companyName) {
  if (NAME_DOMAIN_OVERRIDES[companyName]) {
    return NAME_DOMAIN_OVERRIDES[companyName];
  }

  let hostname;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }

  const mediumMatch = url.match(/medium\.com\/([^/?]+)/);
  if (mediumMatch) {
    const slug = mediumMatch[1];
    if (MEDIUM_SLUG_DOMAINS[slug]) {
      return MEDIUM_SLUG_DOMAINS[slug];
    }
  }

  const parts = hostname.split('.');
  while (parts.length > 2 && SUBDOMAIN_PREFIXES.has(parts[0])) {
    parts.shift();
  }

  return parts.join('.') || hostname;
}

function buildLogoUrls(domain) {
  if (!domain) return [];

  return [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ];
}

export function parseCompaniesFromText(text) {
  const lines = text.split('\n');
  const companies = [];
  const seen = new Set();
  let currentCategory = 'Tech & Engineering';

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      continue;
    }

    if (trimmedLine.startsWith('## ')) {
      currentCategory = trimmedLine.slice(3).trim();
      continue;
    }

    if (
      trimmedLine.startsWith('#') ||
      trimmedLine.startsWith('Companies') ||
      trimmedLine.match(/^[A-Z] companies$/)
    ) {
      continue;
    }

    const match = trimmedLine.match(/^(.+?)\s+(https?:\/\/[^\s)]+)/);
    if (!match) {
      continue;
    }

    const [, name, url] = match;
    const cleanName = name.trim().replace(/:$/, '');
    const cleanUrl = url.trim();

    if (!cleanName || !cleanUrl) {
      continue;
    }

    const dedupeKey = `${cleanName.toLowerCase()}|${cleanUrl.toLowerCase()}`;
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);

    let firstChar = cleanName.charAt(0).toUpperCase();
    if (!/[A-Z]/.test(firstChar)) {
      firstChar = '#';
    }

    const logoDomain = getLogoDomain(cleanUrl, cleanName);

    companies.push({
      name: cleanName,
      url: cleanUrl,
      letter: firstChar,
      category: currentCategory,
      logoDomain,
      logoUrls: buildLogoUrls(logoDomain),
      initial: cleanName.charAt(0).toUpperCase(),
    });
  }

  companies.sort((a, b) => a.name.localeCompare(b.name));

  return companies;
}

export function groupCompaniesByLetter(companies) {
  const grouped = {};

  const letters = ['#', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];
  letters.forEach((letter) => {
    grouped[letter] = [];
  });

  companies.forEach((company) => {
    if (grouped[company.letter]) {
      grouped[company.letter].push(company);
    }
  });

  return grouped;
}

export function getCompanyCategories(companies) {
  const counts = {};

  companies.forEach((company) => {
    counts[company.category] = (counts[company.category] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

export function searchCompanies(companies, searchTerm) {
  if (!searchTerm) return companies;

  const term = searchTerm.toLowerCase();
  return companies.filter(
    (company) =>
      company.name.toLowerCase().includes(term) ||
      company.category.toLowerCase().includes(term) ||
      company.url.toLowerCase().includes(term)
  );
}
