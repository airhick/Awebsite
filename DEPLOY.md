# Deployment Guide for Coolify

This guide explains how to deploy the Aurora Dashboard on Coolify.

## Prerequisites

- A Coolify instance running
- Access to your Supabase project
- VAPI API key
- Git repository with your code

## Environment Variables

Set the following environment variables in Coolify (in the "Environment Variables" section):

### Required Variables

These variables **MUST** be set for the application to work:

1. **`VITE_SUPABASE_URL`**
   - **Description**: Your Supabase project URL
   - **Example**: `https://oknakvgnwxlkvhwmocno.supabase.co`
   - **Where to find**: Supabase Dashboard → Settings → API → Project URL
   - **Format**: Must start with `https://` and end with `.supabase.co`

2. **`VITE_SUPABASE_ANON_KEY`**
   - **Description**: Your Supabase anonymous/public key (NOT the service role key)
   - **Example**: `sb_publishable_BcC5d3MA2VslQJHRoXdy1Q_yvwEEgp2`
   - **Where to find**: Supabase Dashboard → Settings → API → Project API keys → `anon` `public` key
   - **Important**: Use the `anon` or `publishable` key, never the `service_role` key

3. **`VITE_VAPI_API_KEY`**
   - **Description**: Your VAPI API key (global for all dashboards)
   - **Example**: `9d09c2ec-4223-41af-a1c9-8bb097b8e5ef`
   - **Where to find**: VAPI Dashboard → Settings → API Keys
   - **Note**: This key is shared across all customer dashboards

### Optional Variables

These variables are optional but may be needed depending on your setup:

4. **`VITE_SUPABASE_EDGE_FUNCTION_NAME`**
   - **Description**: Name of your Supabase Edge Function for webhook processing
   - **Default**: `n8n-webhook`
   - **Example**: `n8n-webhook`
   - **When to use**: If you've deployed a custom edge function name different from the default

5. **`VITE_SUPABASE_DEFAULT_COMPANY_ID`**
   - **Description**: Default company ID for new customers (optional)
   - **Example**: `1`
   - **When to use**: Only if you need a default company ID for customer creation

### How to Set Variables in Coolify

1. **Go to your application** in Coolify
2. **Navigate to "Environment Variables"** section
3. **Add each variable** with its name and value
4. **Important**: Make sure these are available during **build time** (not just runtime)
   - In Coolify, environment variables are typically available during build
   - If using Dockerfile, they will be passed as build arguments automatically

### Example Configuration in Coolify

```
VITE_SUPABASE_URL=https://oknakvgnwxlkvhwmocno.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_BcC5d3MA2VslQJHRoXdy1Q_yvwEEgp2
VITE_VAPI_API_KEY=9d09c2ec-4223-41af-a1c9-8bb097b8e5ef
VITE_SUPABASE_EDGE_FUNCTION_NAME=n8n-webhook
```

**Critical Note**: These variables must be set as **Build Arguments** or **Environment Variables** that are available during the build process, as Vite embeds them at build time (not runtime). After changing these variables, you **must rebuild** the container.

## Deployment Steps

### Step 1: Connect Repository

1. Go to your Coolify dashboard
2. Click "New Resource" → "Application"
3. Connect your Git repository (GitHub, GitLab, etc.)
4. **Important**: Use **HTTPS URL** instead of SSH URL
   - ✅ **Correct**: `https://github.com/aurora-ch/dashboard`
   - ❌ **Wrong**: `git@github.com:aurora-ch/dashboard`
5. Select the branch you want to deploy (usually `main` or `master`)

**Note**: If you get a "Permission denied (publickey)" error, it means you're using SSH. Switch to HTTPS URL instead.

### Step 2: Configure Build Settings

1. **Build Pack**: Select "Dockerfile" or "Docker Compose"
2. **Dockerfile Path**: `Dockerfile` (should be auto-detected)
3. **Build Context**: `.` (root directory)

### Step 3: Set Environment Variables

1. Go to the "Environment Variables" section
2. Add all required variables (see above)
3. **Important**: Make sure these are set as **Build Arguments** or **Environment Variables** that are available during build

### Step 4: Configure Port

1. Set the **Port** to `80` (or leave default if Coolify auto-detects it)
2. The application will be accessible on the port you configure

### Step 5: Deploy

1. Click "Deploy" or "Save & Deploy"
2. Monitor the build logs
3. Wait for the deployment to complete

## Build Process

The Dockerfile uses a multi-stage build:

1. **Builder stage**: 
   - Uses Node.js 20 Alpine
   - Installs dependencies
   - Builds the React application with Vite
   - Environment variables are embedded in the build

2. **Production stage**: 
   - Uses nginx Alpine (lightweight)
   - Serves the built static files
   - Configured for SPA routing

## Post-Deployment Checklist

After deployment, ensure:

1. **Supabase RPC functions** are created:
   - Run `supabase-auth-function.sql` in your Supabase SQL Editor
   - Run `supabase-stats-function.sql` in your Supabase SQL Editor
   - Run `supabase-call-logs-schema.sql` in your Supabase SQL Editor
   - Run `supabase-user-events-schema.sql` in your Supabase SQL Editor

2. **Supabase Edge Function** is deployed (if using):
   - Deploy the `edge function.js` to your Supabase project

3. **Environment variables** are correctly set in Coolify

4. **Test the application**:
   - Visit your deployed URL
   - Test login functionality
   - Verify dashboard loads correctly

## Troubleshooting

### "Permission denied (publickey)" or "Could not read from remote repository"

**Error**: 
```
Error: git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```

**Solution**: 
- **Use HTTPS URL instead of SSH URL** in Coolify
- Change from: `git@github.com:aurora-ch/dashboard`
- Change to: `https://github.com/aurora-ch/dashboard`
- If the repository is private, you'll need to:
  1. Go to Coolify → Sources
  2. Add your GitHub/GitLab credentials
  3. Or use a Deploy Key (SSH) if you prefer SSH

### Build fails with "VITE_* is not defined"

- **Solution**: Make sure environment variables are set as **Build Arguments** in Coolify
- In Coolify, go to Environment Variables → Make sure they're available during build

### Build fails with npm errors

- Check Node.js version (should be 20)
- Clear build cache in Coolify
- Check `package.json` for any issues

### Application doesn't load

- Check nginx logs in Coolify: View container logs
- Verify the build completed successfully
- Check that `dist` folder was created during build

### 404 errors on routes (SPA routing)

- This is normal for SPAs - nginx is configured to serve `index.html` for all routes
- The `nginx.conf` file handles this automatically
- If issues persist, verify `nginx.conf` is correctly copied

### Environment variables not working

- **Important**: Vite embeds `VITE_*` variables at **build time**, not runtime
- You must **rebuild** the container after changing environment variables
- In Coolify, trigger a new deployment after changing env vars

## Coolify-Specific Tips

1. **Auto-deploy**: Enable auto-deploy on push to your main branch
2. **Health checks**: The Dockerfile includes a health check
3. **SSL/HTTPS**: Coolify can automatically provision SSL certificates
4. **Custom domains**: Configure your domain in Coolify settings

## Notes

- The application is built at container build time, not runtime
- Environment variables starting with `VITE_` are embedded in the build
- **Always rebuild** the container if you change environment variables
- The application runs on port 80 inside the container
- Nginx serves static files efficiently with gzip compression
- All routes are handled by the SPA (Single Page Application) routing

## File Structure

```
.
├── Dockerfile              # Multi-stage build configuration
├── docker-compose.yml      # Alternative deployment option
├── nginx.conf             # Nginx configuration for SPA
├── .dockerignore          # Files to exclude from Docker build
├── .coolify.yml           # Coolify-specific configuration
├── ENV.example            # Example environment variables
└── DEPLOY.md              # This file
```
