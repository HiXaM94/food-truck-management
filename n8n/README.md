# n8n Workflow - Google Maps Food Truck Scraper

## Overview

This n8n workflow automates the process of scraping food truck data from Google Maps and importing it into the Food Truck Management database.

## Workflow Steps

### 1. Webhook Trigger
- **Type**: Webhook
- **Path**: `/webhook/scrape-foodtrucks`
- **Method**: POST
- **Payload**:
  ```json
  {
    "city": "Paris",
    "search_term": "food trucks"
  }
  ```

### 2. Google Maps Search
- Opens Google Maps with search query
- Waits for page to load completely
- Extracts HTML content

### 3. Data Parsing
- Parses HTML to extract food truck information
- Maps data to database schema:
  - Name
  - Cuisine type
  - City
  - Current location
  - Average price
  - Operating hours
  - Status
  - Image URL

### 4. Database Import
- Makes POST request to `/api/foodtrucks`
- Includes JWT authentication token
- Inserts each food truck into database

### 5. Response
- Returns success status
- Includes count of imported food trucks

## Setup Instructions

### 1. Import Workflow
1. Open n8n dashboard
2. Click "Import from File"
3. Select `google-maps-scraper.json`
4. Activate workflow

### 2. Configure Credentials
1. Add HTTP Header Auth credential
2. Set header name: `Authorization`
3. Set header value: `Bearer YOUR_JWT_TOKEN`

### 3. Set Environment Variables
```
API_BASE_URL=https://your-app.vercel.app
```

### 4. Test Workflow
```bash
curl -X POST https://your-n8n-instance.com/webhook/scrape-foodtrucks \
  -H "Content-Type: application/json" \
  -d '{"city": "Paris", "search_term": "food trucks"}'
```

## Advanced Configuration

### Scheduled Execution
Add a Schedule Trigger node to run scraping automatically:
- **Cron Expression**: `0 2 * * *` (Daily at 2 AM)
- **Cities**: Paris, Lyon, Marseille, Nice, Toulouse

### Error Handling
Add Error Trigger node to handle failures:
- Log errors to database
- Send notification email
- Retry failed requests

### Data Validation
Add validation before database insert:
- Check for duplicate names
- Validate required fields
- Sanitize data

## Limitations

### Google Maps Scraping
- Google Maps uses dynamic content loading
- May require Puppeteer or Selenium
- Consider using Google Places API instead for production

### Alternative: Google Places API
```javascript
// Example using Google Places API
const response = await fetch(
  `https://maps.googleapis.com/maps/api/place/textsearch/json?query=food+trucks+in+${city}&key=${API_KEY}`
);

const data = await response.json();

const foodTrucks = data.results.map(place => ({
  name: place.name,
  city: city,
  current_location: place.formatted_address,
  average_price: place.price_level * 5, // Convert to euros
  image: place.photos?.[0]?.photo_reference,
  // ... map other fields
}));
```

## Legal Considerations

⚠️ **Important**: Web scraping may violate Google's Terms of Service. For production use:
1. Use Google Places API (official, legal)
2. Respect rate limits
3. Cache results appropriately
4. Consider paid API plans for commercial use

## Troubleshooting

### Workflow Not Triggering
- Check webhook URL is correct
- Verify n8n instance is running
- Check firewall settings

### No Data Extracted
- Verify Google Maps HTML structure hasn't changed
- Check browser console for errors
- Update CSS selectors in parsing logic

### Database Insert Fails
- Verify JWT token is valid
- Check API endpoint is accessible
- Validate data format matches schema

## Support

For issues or questions:
- Check n8n documentation: https://docs.n8n.io
- Review workflow execution logs
- Test each node individually
