This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Google Forms Integration

This project uses Google Forms to collect and store contact form submissions in a Google Spreadsheet. Here's how to set it up:

1. Create a new Google Form at [forms.google.com](https://forms.google.com/create)
2. Add fields matching your contact form (Name, Email, Service, Message)
3. Click the three dots in the top-right corner and select "Get pre-filled link"
4. Fill in the form with sample data and click "Get link"
5. The resulting URL will contain field IDs in the format `entry.XXXXXXXXX`
6. Update the `handleSubmit` function in `src/app/components/ContactSection.tsx` with your form's IDs:
   - Replace `YOUR_FORM_ID` with your actual Google Form ID
   - Replace each `entry.XXXXXXXXX` ID with the ones from your form

Benefits of this approach:
- No server needed - works with GitHub Pages static hosting
- No cost - Google Forms is free
- Responses are automatically collected in a Google Spreadsheet
- No CORS issues with the iframe method

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on GitHub Pages

This project is configured for deployment on GitHub Pages. The configuration includes:

```js
// next.config.js
module.exports = {
  output: 'export',
  basePath: '/miyamoto',
  assetPrefix: '/miyamoto/',
  // ...other configuration
};
```

To deploy to GitHub Pages:

1. Build the project:
```bash
npm run build
```

2. The output will be in the `out` directory.

3. Create a `.nojekyll` file in the `out` directory to bypass Jekyll processing:
```bash
touch out/.nojekyll
```

4. Push the `out` directory to the `gh-pages` branch of your GitHub repository:
```bash
git subtree push --prefix out origin gh-pages
```

### Important Notes

- All asset paths in the codebase include the `/miyamoto` prefix.
- When adding new assets or links, make sure to add this prefix to ensure they work on GitHub Pages.
- The application will be accessible at `https://yourusername.github.io/miyamoto`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
