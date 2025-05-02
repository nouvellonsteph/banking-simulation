import { NextResponse } from 'next/server';

export async function GET() {
  // Create an HTML page that embeds Swagger UI
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Virgin Money API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: "Montserrat", Arial, Helvetica, sans-serif;
      height: 100vh;
      overflow: auto;
    }
    .topbar {
      display: none;
    }
    .swagger-ui .info .title {
      color: #e10718;
    }
    .swagger-ui .opblock-tag {
      color: #333333;
    }
    .swagger-ui .btn.execute {
      background-color: #e10718;
      color: #fff;
      border-color: #e10718;
    }
    .swagger-ui .btn.authorize {
      color: #e10718;
      border-color: #e10718;
    }
    .swagger-ui .info a {
      color: #e10718;
    }
    .swagger-ui {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .swagger-ui .wrapper {
      padding: 0;
      max-width: none;
    }
    .swagger-ui .opblock {
      margin-bottom: 10px;
    }
    #swagger-ui {
      height: auto;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      // Begin Swagger UI call region
      window.ui = SwaggerUIBundle({
        url: "/api/openapi",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout",
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        docExpansion: 'list',
        operationsSorter: 'alpha',
        tagsSorter: 'alpha',
        persistAuthorization: true,
        withCredentials: true,
        displayRequestDuration: true,
      });
      // End Swagger UI call region
    };
  </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
