# NotMedium - Engineering Blogs Directory

A curated directory of engineering blogs from top companies worldwide, organized alphabetically for easy discovery.

## Features

- 📚 **Comprehensive Directory**: Browse engineering blogs from 200+ companies
- 🔍 **Smart Search**: Find companies quickly with real-time search
- 🔤 **Alphabetical Navigation**: Browse companies by letter with visual counters
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, intuitive interface with company logos
- ➕ **Community Driven**: Users can suggest new companies to add
- 🔗 **Direct Links**: Click any company card to visit their blog
- 📧 **Email Notifications**: Receive emails when users suggest new companies

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. **Set up email notifications** (see Email Setup section below)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Email Setup (Company Suggestions)

To receive email notifications when users suggest new companies:

### Option 1: Using Environment Variables (Recommended)

1. Create a `.env.local` file in your project root:
   ```env
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
   ```

### Option 2: Direct Configuration

Update `src/lib/emailConfig.js` with your actual values:
```javascript
export const emailConfig = {
  publicKey: 'your_actual_public_key',
  serviceId: 'your_actual_service_id', 
  templateId: 'your_actual_template_id',
  targetEmail: 'jitesh.raghav.viragvigyan@gmail.com'
};
```

### Get EmailJS Credentials

1. **Create Account**: Go to [EmailJS.com](https://www.emailjs.com/) and sign up
2. **Add Service**: Connect your Gmail account
3. **Create Template**: Use the template provided in `EMAILJS_SETUP.md`
4. **Get Keys**: Copy your Public Key, Service ID, and Template ID

📋 **See `EMAILJS_SETUP.md` for detailed step-by-step instructions.**

## Project Structure

```
notmedium/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles
│   │   ├── layout.js        # Root layout
│   │   └── page.js          # Main page component
│   ├── components/
│   │   ├── AlphabetNav.js   # Alphabet navigation
│   │   ├── CompanyCard.js   # Company display cards
│   │   ├── SearchBar.js     # Search functionality
│   │   └── SuggestionForm.js # Company suggestion form
│   └── lib/
│       ├── parseCompanies.js # Data parsing utilities
│       └── emailConfig.js   # Email configuration
├── public/
│   └── links.txt            # Company data file
├── EMAILJS_SETUP.md         # Email setup guide
└── package.json
```

## Data Format

The `public/links.txt` file contains company information in the format:
```
Company Name https://blog-url.com/
```

Companies are automatically categorized by their first letter and displayed with logos fetched from Clearbit's logo API.

## Contributing

1. **Adding Companies**: Use the "Suggest Company" button in the app
2. **Bug Reports**: Open an issue with details
3. **Features**: Submit feature requests via issues

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: JavaScript (ES6+)
- **Icons**: Heroicons
- **Logo Service**: Clearbit Logo API
- **Email Service**: EmailJS

## License

MIT License - feel free to use this project for your own needs.

## Acknowledgments

- Companies for maintaining excellent engineering blogs
- The developer community for sharing knowledge
- Clearbit for providing the logo API service