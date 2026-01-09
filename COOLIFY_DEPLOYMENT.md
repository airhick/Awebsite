# Coolify Deployment Guide for Aurora Dashboard

This guide will help you deploy the Aurora Dashboard to your local Coolify instance.

## Prerequisites

1. **Coolify installed and running** on your local machine or server
2. **Git repository** (or access to this codebase)
3. **Environment variables** ready (Supabase URL, keys, etc.)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is in a Git repository. Coolify can deploy from:
- Local Git repository
- GitHub/GitLab/Bitbucket
- Direct file upload

### 2. Create a New Resource in Coolify

1. Log into your Coolify dashboard
2. Navigate to your project/team
3. Click **"New Resource"** or **"Add Service"**
4. Select **"Docker Compose"** or **"Dockerfile"** as the deployment method

### 3. Configure the Service

#### Basic Configuration:
- **Name**: `aurora-dashboard` (or your preferred name)
- **Repository URL**: Your Git repository URL (or select local)
- **Branch**: `main` (or your default branch)
- **Build Pack**: Select **"Dockerfile"** (Coolify should auto-detect it)

#### Build Settings:
- **Build Context**: `.` (root directory)
- **Dockerfile Path**: `Dockerfile` (should be auto-detected)
- **Port**: `80` (internal container port)

### 4. Set Environment Variables

**CRITICAL**: These environment variables MUST be set in Coolify before building, as they are required at build time for Vite.

In Coolify UI, go to **Environment Variables** section and add:

#### Required Variables:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_VAPI_API_KEY=your-vapi-api-key-here
```

#### Optional Variables:
```
VITE_SUPABASE_EDGE_FUNCTION_NAME=your-edge-function-name
```

**Important Notes:**
- These variables are used during the **build process** (not runtime)
- Vite embeds them into the JavaScript bundle at build time
- Coolify will automatically pass these as build arguments to Docker
- Make sure to set them **before** triggering the first build

### 5. Configure Ports

- **Internal Port**: `80` (nginx serves on port 80)
- **External Port**: Choose any available port (e.g., `3000`, `8080`, etc.)
- Coolify will map: `external_port:80`

### 6. Health Check (Optional but Recommended)

Coolify should auto-detect the health check from `.coolify.yml`, but you can configure:
- **Path**: `/`
- **Interval**: `30` seconds
- **Timeout**: `10` seconds
- **Retries**: `3`

### 7. Deploy

1. Review all settings
2. Click **"Deploy"** or **"Save & Deploy"**
3. Monitor the build logs in Coolify
4. Wait for the build to complete (first build may take 5-10 minutes)

## Build Process

The deployment uses a multi-stage Docker build:

1. **Stage 1 (Builder)**: 
   - Installs Node.js dependencies
   - Builds the Vite application with environment variables
   - Creates optimized production bundle

2. **Stage 2 (Production)**:
   - Uses lightweight nginx Alpine image
   - Serves the built static files
   - Configured for SPA routing and caching

## Troubleshooting

### Build Fails with Missing Environment Variables

**Error**: Build succeeds but app doesn't work (API calls fail)

**Solution**: 
- Ensure all required environment variables are set in Coolify
- Check that variables are set **before** building
- Rebuild the service after adding variables

### Application Shows Blank Page

**Possible Causes**:
1. Build failed silently
2. Environment variables not set correctly
3. Routing issues

**Solution**:
- Check Coolify build logs
- Verify nginx is serving files correctly
- Check browser console for errors
- Ensure `nginx.conf` is properly configured for SPA routing

### Port Already in Use

**Error**: Port conflict when starting container

**Solution**:
- Change the external port in Coolify settings
- Or stop the service using that port

### Build Takes Too Long

**First Build**: Can take 5-10 minutes (installing dependencies)
**Subsequent Builds**: Usually 2-5 minutes (cached layers)

**Optimization Tips**:
- Coolify caches Docker layers automatically
- Only changed files trigger rebuilds
- Consider using `.dockerignore` to exclude unnecessary files

## Updating the Application

### Automatic Updates (if Git connected):
1. Push changes to your Git repository
2. Coolify will detect changes (if auto-deploy enabled)
3. Trigger a new build automatically

### Manual Updates:
1. Go to your service in Coolify
2. Click **"Redeploy"** or **"Rebuild"**
3. Monitor the build process

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_SUPABASE_URL` | ✅ Yes | Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous/public key | `eyJhbGc...` |
| `VITE_VAPI_API_KEY` | ✅ Yes | VAPI API key for voice features | `sk-xxxxx` |
| `VITE_SUPABASE_EDGE_FUNCTION_NAME` | ❌ No | Edge function name (if used) | `my-function` |

## File Structure

```
.
├── Dockerfile              # Multi-stage build configuration
├── .coolify.yml           # Coolify-specific configuration
├── nginx.conf             # Nginx server configuration
├── docker-compose.yml     # Docker Compose (optional, for local testing)
├── package.json           # Node.js dependencies
└── src/                   # Application source code
```

## Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Support

If you encounter issues:
1. Check Coolify build logs
2. Check Coolify container logs
3. Verify environment variables are set correctly
4. Ensure all required files are in the repository

