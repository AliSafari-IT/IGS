# IGS Pharma Favicon Generator

A simple tool to generate favicons from images for IGS Pharma web applications.

## Overview

This package provides a web-based tool to easily generate favicon files from your logo or other images. It allows you to:

- Preview how your favicon will look in different sizes
- Generate a PNG favicon that works with modern browsers
- Get instructions for using the favicon in your web applications

## Usage

### Starting the Tool

1. Navigate to the package directory:
   ```bash
   cd packages/favicon-generator
   ```

2. Start the server:
   ```bash
   node index.js
   ```

3. Open your browser and go to:
   ```
   http://localhost:3030
   ```

### Using the Tool

1. Click "Load Logo" to upload your image file (supports various formats including PNG, JPG, WEBP)
2. Preview how the favicon will look in different sizes
3. Click "Generate Favicon" to create and download the favicon.png file
4. Place the favicon.png in your project's public directory
5. Update your HTML to reference the favicon:
   ```html
   <link rel="icon" type="image/png" href="/favicon.png">
   ```

## Integration with IGS Pharma Web Applications

To use the generated favicon in your IGS Pharma web application:

1. Place the favicon.png file in the public directory of your application
2. Update the `<head>` section in your index.html file to reference the favicon:
   ```html
   <link rel="icon" type="image/png" href="/favicon.png">
   ```

## Additional Information

- Modern browsers support PNG favicons, which provide better quality than traditional ICO files
- For broader compatibility (including older browsers), you can use an online converter to convert the PNG to ICO format
- Recommended favicon sizes: 16x16, 32x32, 48x48, and 64x64 pixels
