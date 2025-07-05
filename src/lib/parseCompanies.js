export function parseCompaniesFromText(text) {
  const lines = text.split('\n');
  const companies = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines, headers, and comment lines
    if (!trimmedLine || 
        trimmedLine.startsWith('#') || 
        trimmedLine.startsWith('Companies') ||
        trimmedLine.includes('companies') ||
        trimmedLine.match(/^[A-Z] companies$/)) {
      continue;
    }
    
    // Parse company lines in format: "Company Name https://url"
    const match = trimmedLine.match(/^(.+?)\s+(https?:\/\/.+?)(?:\s|$)/);
    if (match) {
      const [, name, url] = match;
      const cleanName = name.trim();
      const cleanUrl = url.trim();
      
      if (cleanName && cleanUrl) {
        // Determine the first character for alphabetical grouping
        let firstChar = cleanName.charAt(0).toUpperCase();
        if (!/[A-Z]/.test(firstChar)) {
          firstChar = '#';
        }
        
        companies.push({
          name: cleanName,
          url: cleanUrl,
          letter: firstChar,
          logo: `https://logo.clearbit.com/${new URL(cleanUrl).hostname}?size=80`,
          fallbackLogo: `https://via.placeholder.com/80x80/e5e7eb/6b7280?text=${cleanName.charAt(0)}`
        });
      }
    }
  }
  
  // Sort companies alphabetically by name
  companies.sort((a, b) => a.name.localeCompare(b.name));
  
  return companies;
}

export function groupCompaniesByLetter(companies) {
  const grouped = {};
  
  // Initialize all letters and #
  const letters = ['#', ...Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i))];
  letters.forEach(letter => {
    grouped[letter] = [];
  });
  
  // Group companies by their first letter
  companies.forEach(company => {
    if (grouped[company.letter]) {
      grouped[company.letter].push(company);
    }
  });
  
  return grouped;
}

export function searchCompanies(companies, searchTerm) {
  if (!searchTerm) return companies;
  
  const term = searchTerm.toLowerCase();
  return companies.filter(company => 
    company.name.toLowerCase().includes(term)
  );
} 