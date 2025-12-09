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

- `VITE_SUPABASE_URL`: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_VAPI_API_KEY`: Your VAPI API key (global for all dashboards)

### Optional Variables

- `VITE_SUPABASE_EDGE_FUNCTION_NAME`: Name of your Supabase Edge Function (if using)

**Important**: These variables must be set as **Build Arguments** in Coolify, as they are needed during the build process (Vite embeds them at build time).

## Deployment Steps

### Step 1: Connect Repository

1. Go to your Coolify dashboard
2. Click "New Resource" → "Application"
3. Connect your Git repository (GitHub, GitLab, etc.)
4. Select the branch you want to deploy (usually `main` or `master`)

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
