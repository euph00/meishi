# Deployment Guide (Firebase Hosting + GitHub Actions)

Since you haven't run any commands yet, follow this complete guide to deploy your site and set up automatic deployments.

## 1. Setup & Login
First, install the tools and log in to your Google account.

```bash
npm install -g firebase-tools
firebase login
```

## 2. Initialize Project
Run this command to set up everything at once:

```bash
firebase init hosting
```

**Follow these specific choices when prompted:**

1.  **"Please select an option:"**
    -   Select `Use an existing project` (Choose your project from the list)
2.  **"What do you want to use as your public directory?"**
    -   Type: `dist` (Press Enter)
3.  **"Configure as a single-page app (rewrite all urls to /index.html)?"**
    -   Type: `y` (Yes)
4.  **"Set up automatic builds and deploys with GitHub?"**
    -   Type: `y` (Yes) -> **This is the important part!**
5.  **"File dist/index.html already exists. Overwrite?"**
    -   Type: `n` (No) -> **Crucial! Do not overwrite.**

## 3. GitHub Configuration
After selecting "Yes" for GitHub, it will ask for more details:

1.  **"For which GitHub repository would you like to set up a GitHub workflow?"**
    -   Enter your repo format: `username/repository-name` (e.g., `linch/namecard-site`)
2.  **"Set up the workflow to run a build script before every deploy?"**
    -   Type: `y` (Yes)
3.  **"What script should be run before every deploy?"**
    -   Press Enter to accept default (`npm ci && npm run build`)
4.  **"Set up automatic deployment to your site's live channel when a PR is merged?"**
    -   Type: `y` (Yes)
5.  **"What is the name of the git branch to deploy?"**
    -   Press Enter (usually `main` or `master`)

## 4. Final Step
Once initialization is complete, push your code to GitHub to trigger the first deploy!

```bash
git add .
git commit -m "Setup Firebase deployment"
git push
```

Your site will automatically build and deploy. You can check the "Actions" tab in your GitHub repository to see the progress.

---

## FAQ

### Is this free?
**Yes!** Firebase Hosting has a generous **Spark Plan (Free Tier)** that includes:
-   10 GB of storage
-   360 MB/day data transfer
-   Custom domain support (SSL included)

### How do I change the URL?
1.  **Custom Domain (Recommended)**:
    -   Go to the [Firebase Console](https://console.firebase.google.com/).
    -   Navigate to **Hosting**.
    -   Click **"Add custom domain"**.
    -   Follow the instructions to update your DNS records (it provides free SSL!).

2.  **Change Project ID**:
    -   The default URL is based on your Project ID (`project-id.web.app`).
    -   You cannot change a Project ID after creation.
    -   If you want a different `.web.app` URL, you must create a **new** Firebase project with your desired ID and run `firebase use --add` to switch to it.

## Alternative Hosting Options

Since this is a standard **Vite + React** app, you can host it anywhere. However, you **MUST** add your Firebase environment variables to the hosting provider's dashboard for the backend to work.

### Option 1: Vercel (Recommended Alternative)
1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in the project folder.
3.  **Important**: Go to the Vercel Dashboard > Settings > Environment Variables and add all your `VITE_FIREBASE_...` keys from your `.env` file.

### Option 2: Netlify
1.  Drag and drop the `dist` folder to Netlify Drop.
2.  **Important**: Go to Site Settings > Build & Deploy > Environment and add your `VITE_FIREBASE_...` keys.
3.  Add a `_redirects` file to the `public` folder with `/* /index.html 200` to fix routing.
