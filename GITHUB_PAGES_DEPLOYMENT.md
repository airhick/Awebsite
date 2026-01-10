# GitHub Pages Deployment Guide

This guide explains how to deploy the Aurora Dashboard to GitHub Pages using the custom domain `apifinder.xyz`.

## Current Setup

- **Custom Domain**: `apifinder.xyz` (configured in CNAME file)
- **Deployment Source**: `/docs` folder in `main` branch
- **Build Output**: Configured to output to `docs` folder

## Quick Start

### Option 1: Automatic Deployment (Recommended)

The repository includes GitHub Actions workflows that automatically build and deploy your site when you push to the `main` branch.

#### For "Deploy from a branch" setup (Current):

1. **Set up GitHub Secrets** (required for build):
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_VAPI_API_KEY`
     - `VITE_SUPABASE_EDGE_FUNCTION_NAME` (optional)

2. **Push to main branch**:
   ```bash
   git push origin main
   ```
   The workflow will automatically build and deploy.

#### For "GitHub Actions" setup (Better, but requires changing Pages source):

1. **Change GitHub Pages source**:
   - Go to repository → Settings → Pages
   - Change "Source" from "Deploy from a branch" to "GitHub Actions"
   - The workflow `deploy-pages-actions.yml` will handle deployment

2. **Set up GitHub Secrets** (same as above)

3. **Push to main branch** - deployment happens automatically

### Option 2: Manual Deployment

If you prefer to build and deploy manually:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the application**:
   ```bash
   npm run build:pages
   ```
   This builds the app and copies the CNAME file to the docs folder.

3. **Commit and push**:
   ```bash
   git add docs/
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

## Configuration Files

### Vite Configuration
- `vite.config.ts`: Configured to output build files to `docs` folder
- Build command: `npm run build`

### GitHub Actions Workflows
- `.github/workflows/deploy-pages.yml`: For "Deploy from a branch" setup
- `.github/workflows/deploy-pages-actions.yml`: For "GitHub Actions" setup (recommended)

### Custom Domain
- `CNAME`: Contains `apifinder.xyz` - automatically copied to docs folder during build

## Troubleshooting

### 404 Error on Custom Domain

If you see a 404 error:

1. **Check that the docs folder exists and contains built files**:
   ```bash
   ls -la docs/
   ```

2. **Verify GitHub Pages is enabled**:
   - Go to repository → Settings → Pages
   - Ensure "Source" is set correctly
   - Check that the branch and folder are correct

3. **Verify DNS configuration**:
   - The CNAME file should contain `apifinder.xyz`
   - DNS should point to GitHub Pages (check your domain registrar)

4. **Check GitHub Pages build status**:
   - Go to repository → Actions tab
   - Look for any failed workflow runs

### Build Fails in GitHub Actions

1. **Check that all required secrets are set**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_VAPI_API_KEY`

2. **Check workflow logs**:
   - Go to repository → Actions tab
   - Click on the failed workflow run
   - Review the error messages

### Site Shows Blank Page

1. **Check browser console** for JavaScript errors
2. **Verify environment variables** are set correctly in GitHub Secrets
3. **Check that the build completed successfully**
4. **Clear browser cache** and try again

## Environment Variables

These variables are required at **build time** (not runtime) because Vite embeds them into the JavaScript bundle:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous/public key |
| `VITE_VAPI_API_KEY` | ✅ Yes | VAPI API key for voice features |
| `VITE_SUPABASE_EDGE_FUNCTION_NAME` | ❌ No | Edge function name (if used) |

## Notes

- The `docs` folder is **not** in `.gitignore`, so it will be committed to the repository
- The workflow automatically skips deployment if only the `docs` folder changes (prevents infinite loops)
- GitHub Pages may take a few minutes to update after deployment
- DNS propagation for custom domains can take up to 24-48 hours

## Next Steps

1. Set up GitHub Secrets with your environment variables
2. Push your changes to trigger the deployment workflow
3. Wait for GitHub Pages to build and deploy (usually 1-2 minutes)
4. Visit `https://apifinder.xyz` to verify the deployment

