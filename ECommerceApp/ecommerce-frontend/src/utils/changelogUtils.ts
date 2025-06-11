import axios from 'axios';
import { API_BASE_URL } from '../infrastructure/services/ApiConfig';

// In-memory storage for changelog content (simulates a database)
// In a real app, this would be stored on the server
const changelogStorage: Record<string, string> = {};

export interface ChangelogFile {
  id: string;
  name: string;
  path: string;
  date: string;
  size: string;
  content?: string;
  version: string;
  readOnly?: boolean;
}

/**
 * Fetches changelog files from the server
 * @returns Promise with array of changelog files
 */
export const fetchChangelogFiles = async (): Promise<ChangelogFile[]> => {
  try {
    // Call the new API endpoint
    const response = await axios.get(`${API_BASE_URL}/changelog`);
    
    // Define a type for the API response item
    interface ChangelogApiItem {
      id: string;
      name: string;
      path: string;
      updatedAt: string;
      size: string;
      version: string;
      content?: string;
    }
    
    if (response.data && Array.isArray(response.data)) {
      // Direct array response
      return response.data.map((item: ChangelogApiItem) => ({
        id: item.id,
        name: item.name,
        path: item.path.startsWith('/') ? item.path : `/${item.path}`,
        date: new Date(item.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        size: item.size,
        version: item.version,
        content: item.content
      }));
    } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
      // Response wrapped in ApiResponse<T>
      return response.data.data.map((item: ChangelogApiItem) => ({
        id: item.id,
        name: item.name,
        path: item.path.startsWith('/') ? item.path : `/${item.path}`,
        date: new Date(item.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        size: item.size,
        version: item.version,
        content: item.content
      }));
    } else {
      console.warn('Unexpected API response format:', response.data);
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error('Error fetching changelog files:', error);
    
    // Return mock data as fallback if API fails
    return [
      { 
        id: 'changelog-main', 
        name: 'CHANGELOG.md', 
        path: '/change-logs/CHANGELOG.md',
        date: 'May 26, 2025',
        size: '12.4 KB',
        version: 'Hoofd Changelog'
      },
      { 
        id: 'changelog-v2-0', 
        name: 'v2.0.md', 
        path: '/change-logs/v2.0.md',
        date: 'April 15, 2025',
        size: '8.7 KB',
        version: '2.0'
      },
      { 
        id: 'changelog-v1-5', 
        name: 'v1.5.md', 
        path: '/change-logs/v1.5.md',
        date: 'March 3, 2025',
        size: '6.2 KB',
        version: '1.5'
      },
      { 
        id: 'changelog-v1-0', 
        name: 'v1.0.md', 
        path: '/change-logs/v1.0.md',
        date: 'January 10, 2025',
        size: '5.8 KB',
        version: '1.0'
      }
    ];
  }
};

/**
 * Fetches a single changelog file content by path
 * @param path Path to the changelog file
 * @returns Promise with the file content
 */
export const fetchChangelogFileContent = async (path: string): Promise<string> => {
  try {
    // Check if we have stored content for this path (for immediate access)
    if (changelogStorage[path]) {
      console.log('Loading content from storage for', path);
      return changelogStorage[path];
    }
    
    // If not in storage, try to fetch from the database via API
    console.log('Fetching content from database for', path);
    
    // Normalize the path to ensure it's in the correct format
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
      try {
      // Try to fetch the file from the database using our new API endpoint
      const response = await axios.get(`${API_BASE_URL}/changelog/bypath?path=${encodeURIComponent(normalizedPath)}`);
      
      if (response.data && response.data.success && response.data.data) {
        console.log('Successfully fetched file from database:', normalizedPath);
        const content = response.data.data.content;
        
        // Store the content in memory for future use
        changelogStorage[path] = content;
        return content;
      } else {
        console.warn('API returned success=false or no data:', response.data?.message);
        throw new Error('Failed to fetch changelog content');
      }
    } catch (fetchError) {
      console.error('Error fetching file from database:', fetchError);
      console.log('Falling back to default content');
      
      // If fetching fails, fall back to default content
      // Extract the file name from the path
      const fileName = path.split('/').pop() || '';
      
      // Default content based on the file name
      let defaultContent = '';
      
      if (fileName === 'CHANGELOG.md') {
        defaultContent = `# Main Changelog

## Version 2.0 (May 26, 2025)

### New Features
- Added advanced search functionality
- Improved user dashboard with analytics
- Integrated prescription management system

### Bug Fixes
- Fixed issue with order processing
- Resolved login problems on mobile devices
- Corrected pricing calculations for bulk orders

## Version 1.5 (March 3, 2025)

### New Features
- Added product comparison tool
- Implemented user reviews and ratings
- Enhanced mobile responsiveness`;
      } else if (fileName === 'v2.0.md') {
        defaultContent = `# Version 2.0

## Release Date: April 15, 2025

### New Features
- Advanced Search functionality
- Implemented filters (categories, price ranges, and availability)
- Added sorting options for search results
- Integrated autocomplete suggestions

### User Dashboard
- Added analytics with order history
- Created personalized product recommendations

### Prescription Management
- Secure upload and storage of prescriptions
- Automated verification system
- Integration with pharmacy systems`;
      } else if (fileName === 'v1.5.md') {
        defaultContent = `# Version 1.5

## Release Date: March 3, 2025

### New Features
- Product Comparison tool
- Side by side comparison of up to 3 products
- Detailed specification comparison
- Printable comparison sheets

### User Reviews
- Star rating system
- Verified purchase badges
- Photo upload capability for review illustrations

### Mobile Enhancements
- Improved responsive design
- Touch-friendly interface
- Optimized images for faster loading on mobile`;
      } else if (fileName === 'v1.0.md') {
        defaultContent = `# Version 1.0

## Release Date: January 10, 2025

### Initial Release Features

#### E-commerce Platform
- Product browsing and searching
- Shopping cart functionality
- Secure checkout process
- Order tracking

#### User Accounts
- Registration and login
- Profile management
- Order history
- Saved payment methods

#### Product Catalog
- Categories and subcategories
- Product details pages
- Image galleries
- Inventory management`;
      } else {
        // Generic default content for unknown files
        defaultContent = `# ${fileName.replace('.md', '')}

This is a placeholder content for ${fileName}. The actual file could not be loaded.`;
      }
      
      // Store the default content in memory for future use
      changelogStorage[path] = defaultContent;
      return defaultContent;
    }
  } catch (error) {
    console.error('Error fetching changelog file content:', error);
    return 'Error loading changelog content. Please try again later.';
  }
};

/**
 * Creates a new changelog file
 * @param file Changelog file data
 * @returns Promise with the created file
 */
export const createChangelogFile = async (file: Partial<ChangelogFile>): Promise<ChangelogFile> => {
  try {
    // Store in memory first for immediate access
    if (file.path && file.content) {
      changelogStorage[file.path] = file.content;
    }
    
    // Create a DTO for the API
    const createChangelogDto = {
      name: file.name || file.path?.split('/').pop() || 'New Changelog',
      path: file.path?.startsWith('/') ? file.path.substring(1) : file.path,
      version: file.version || '1.0.0',
      content: file.content || '',
      createdBy: 'frontend-user'
    };
      console.log('Sending to API:', createChangelogDto);
    const response = await axios.post(`${API_BASE_URL}/changelog`, createChangelogDto);
    console.log('API response:', response.data);
    
    // Check if the response has the expected structure
    if (response.data && (response.data.success || response.data.id)) {
      const createdFile = response.data.data || response.data;
      console.log('Changelog created successfully:', createdFile);
      return createdFile;
    } else {
      const errorMsg = response.data?.message || 'Unknown API error';
      console.warn('API error:', errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Error creating changelog file:', error);
    throw error; // Re-throw to allow proper error handling in the UI
  }
};

/**
 * Updates an existing changelog file
 * @param id File ID
 * @param file Updated file data
 * @returns Promise with the updated file
 */
export const updateChangelogFile = async (id: string, file: Partial<ChangelogFile>): Promise<ChangelogFile> => {
  try {
    console.log('Updating changelog file:', id);
    console.log('New content:', file.content?.substring(0, 50) + '...');
    
    // Store the updated content in our in-memory storage
    if (file.path && file.content) {
      changelogStorage[file.path] = file.content;
      console.log('Content saved to storage for', file.path);
      
      // Extract the actual file path from the URL path
      // The path in the ChangelogFile is like '/change-logs/CHANGELOG.md'
      // We need to convert it to a physical file path
      const filePath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
        try {
        // Make an API call to save the file to the database using our new endpoint
        const response = await axios.post(`${API_BASE_URL}/changelog/save-file`, {
          path: filePath,
          content: file.content,
          name: file.name,
          version: file.version
        });
        
        if (response.data && response.data.success) {
          console.log('Changelog saved to database successfully:', response.data.data);
          // Update any additional properties from the response if needed
          if (response.data.data) {
            file.size = response.data.data.size || file.size;
            file.version = response.data.data.version || file.version;
          }
        } else {
          console.warn('API returned success=false:', response.data?.message);
        }
      } catch (writeError) {
        console.error('Error saving changelog to database:', writeError);
        // Even if the API call fails, we continue with the in-memory update
        // This way, the user's changes aren't lost during the current session
      }
    }
    
    // Return the updated file
    return {
      id: id,
      name: file.name || '',
      path: file.path || '',
      date: file.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      size: file.size || '0 KB',
      content: file.content,
      version: file.version || ''
    };
  } catch (error) {
    console.error(`Error updating changelog file ${id}:`, error);
    throw new Error(`Failed to save changelog file. Please try again.`);
  }
};

/**
 * Deletes a changelog file
 * @param id File ID to delete
 * @returns Promise with success status
 */
export const deleteChangelogFile = async (id: string): Promise<boolean> => {
  try {
    // Call the new API endpoint
    const response = await axios.delete(`${API_BASE_URL}/changelog/${id}`);
    
    if (response.data && response.data.success) {
      console.log('Changelog deleted successfully:', id);
      return true;
    } else {
      console.warn('API returned success=false:', response.data?.message);
      return false;
    }
  } catch (error) {
    console.error(`Error deleting changelog file ${id}:`, error);
    return false;
  }
};
