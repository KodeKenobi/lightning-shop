# Shopify to Sanity Sync Setup

This guide explains how to set up automatic syncing between your Shopify store and Sanity CMS, so your website pulls products from Sanity instead of directly from Shopify.

## 🎯 Benefits

- **Better Performance**: Sanity CDN provides faster product loading
- **Content Management**: Edit product details, SEO, and content in Sanity Studio
- **Reliability**: Reduced dependency on Shopify API rate limits
- **Flexibility**: Add custom fields and content without Shopify constraints

## 🚀 Quick Start

### 1. Initial Sync

Run the initial sync to populate Sanity with your existing Shopify products:

```bash
npm run sync-products
```

Or use the web interface:

- Visit `/admin/sync` in your browser
- Click "Start Sync"

### 2. Set Up Automatic Syncing

Configure Shopify webhooks to automatically sync when products change:

1. Go to your Shopify Admin → Settings → Notifications
2. Scroll down to "Webhooks" section
3. Click "Create webhook"
4. Set the following:
   - **Event**: Product creation, Product update, Product deletion
   - **Format**: JSON
   - **URL**: `https://your-domain.com/api/webhooks/shopify`
   - **API version**: 2024-10

### 3. Environment Variables

Make sure these environment variables are set in your `.env.local`:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_sanity_token

# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token

# Webhook Security (optional but recommended)
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
```

## 📋 What Gets Synced

### Product Data

- ✅ Basic info (title, description, handle)
- ✅ Pricing (price, compare-at price)
- ✅ Images (with alt text)
- ✅ Availability status
- ✅ SEO fields (title, description)

### Custom Fields (in Sanity)

- 🎨 Featured product flag
- 🏷️ Custom categories
- 📝 Enhanced descriptions
- 🏷️ Custom tags
- 📸 Additional images

## 🔧 Manual Operations

### Sync All Products

```bash
npm run sync-products
```

### API Endpoints

- **Sync Products**: `POST /api/sync-products`
- **Get Products**: `GET /api/products` (now pulls from Sanity)
- **Webhook**: `POST /api/webhooks/shopify`

### Admin Interface

Visit `/admin/sync` for a web-based sync management interface.

## 🛠️ Troubleshooting

### Common Issues

1. **Sync fails with authentication error**

   - Check your Sanity API token has write permissions
   - Verify project ID and dataset are correct

2. **Webhook not triggering**

   - Ensure webhook URL is publicly accessible
   - Check webhook secret matches in both Shopify and your app
   - Verify webhook is enabled in Shopify admin

3. **Products not appearing on website**
   - Check that `/api/products` is now returning Sanity data
   - Verify product schema is properly configured
   - Check browser console for errors

### Debug Steps

1. **Test Sanity connection**:

   ```bash
   # Check if you can fetch products from Sanity
   curl "https://your-project-id.api.sanity.io/v2024-01-01/data/query/production?query=*[_type == 'product']"
   ```

2. **Test Shopify connection**:

   ```bash
   # Check if Shopify API is working
   curl -H "X-Shopify-Storefront-Access-Token: your-token" \
        "https://your-store.myshopify.com/api/2024-10/graphql.json"
   ```

3. **Check webhook logs**:
   - Look at your server logs when products change in Shopify
   - Verify webhook payload is being received

## 📊 Monitoring

### Sync Status

- Check `/admin/sync` for last sync status
- Monitor server logs for sync operations
- Use Sanity Studio to verify products are synced

### Performance

- Products now load from Sanity CDN (faster)
- Reduced Shopify API calls
- Better caching and reliability

## 🔄 Migration Process

1. **Backup**: Export your current product data
2. **Test**: Run sync in development environment first
3. **Deploy**: Deploy the new sync system
4. **Sync**: Run initial sync to populate Sanity
5. **Switch**: Update your website to use Sanity products
6. **Monitor**: Watch for any issues and verify everything works
7. **Cleanup**: Remove old Shopify direct integration if desired

## 📚 Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Shopify Webhooks Guide](https://shopify.dev/docs/apps/webhooks)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review server logs for error details
3. Test individual components (Sanity, Shopify, webhooks)
4. Verify all environment variables are correct
