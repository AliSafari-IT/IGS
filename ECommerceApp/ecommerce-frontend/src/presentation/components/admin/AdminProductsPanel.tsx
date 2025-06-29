import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../infrastructure/services/ApiConfig';
import './AdminProductsPanel.css';

// Define the Product interface based on ProductDto
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description?: string;
  inStock: boolean;
  requiresPrescription: boolean;
  dosage?: string;
  manufacturer?: string;
}

interface PagedResponse {
  data: Product[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  success: boolean;
  message?: string;
}

const AdminProductsPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editFormData, setEditFormData] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories for filtering
  const categories = [
    'Pijnstillers',
    'Antibiotica', 
    'Vitamines',
    'Huidverzorging',
    'Digestie',
    'Respiratie',
    'Cardiovasculair',
    'Andere'
  ];

  // Fetch products from the API
  const fetchProducts = async (page: number = 1, category?: string, search?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('igs_auth_token');
      if (!token) {
        setError('Geen authenticatie token gevonden. Log opnieuw in.');
        return;
      }

      let url = `${API_BASE_URL}/products?page=${page}&limit=20`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      // Use search endpoint if search term is provided
      if (search && search.trim()) {
        url = `${API_BASE_URL}/products/search?query=${encodeURIComponent(search)}&page=${page}&limit=20`;
      }

      const response = await axios.get<PagedResponse>(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }      });
      
      if (response.data && response.data.success) {
        setProducts(response.data.data);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.totalPages);
      } else {
        setError(response.data.message || 'Ongeldig dataformaat ontvangen van server.');
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      if (err.response?.status === 401) {
        setError('Uw sessie is verlopen. Log opnieuw in.');
      } else if (err.response?.status === 403) {
        setError('U heeft geen toegang tot deze functie.');
      } else {
        setError('Er is een fout opgetreden bij het ophalen van producten. Probeer het later opnieuw.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, selectedCategory, searchTerm);
  }, [selectedCategory]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(1, selectedCategory, searchTerm);
  };

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSearchTerm(''); // Clear search when filtering by category
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page, selectedCategory, searchTerm);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  // Open modal
  const openModal = (product: Product | null, mode: 'view' | 'edit' | 'create') => {
    setSelectedProduct(product);
    setModalMode(mode);
    
    // Initialize form data for edit mode
    if (mode === 'edit' && product) {
      setEditFormData({ ...product });
    } else if (mode === 'create') {
      setEditFormData({
        id: '',
        name: '',
        price: 0,
        imageUrl: '',
        category: '',
        description: '',
        inStock: true,
        requiresPrescription: false,
        dosage: '',
        manufacturer: ''
      });
    } else {
      setEditFormData(null);
    }
    
    setIsModalOpen(true);
  };  // Close modal
  const closeModal = () => {
    setSelectedProduct(null);
    setEditFormData(null);
    setIsModalOpen(false);
    setModalMode('view');
    setIsSubmitting(false);
  };

  // Handle form field changes
  const handleFormChange = (field: keyof Product, value: any) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [field]: value
      });
    }
  };
  // Handle form submission
  const handleSaveProduct = async () => {
    if (!editFormData) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('igs_auth_token');
      if (!token) {
        setError('Geen authenticatie token gevonden. Log opnieuw in.');
        return;
      }

      let response;
      if (modalMode === 'create') {
        // Create new product
        response = await axios.post(`${API_BASE_URL}/products`, editFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Update existing product
        response = await axios.put(`${API_BASE_URL}/products/${editFormData.id}`, editFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.data && response.data.success) {
        // Close modal and refresh data
        closeModal();
        fetchProducts(currentPage, selectedCategory, searchTerm);
        setError(null);
      } else {
        setError(response.data.message || 'Er is een fout opgetreden bij het opslaan van het product.');
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      if (error.response?.status === 401) {
        setError('Uw sessie is verlopen. Log opnieuw in.');
      } else if (error.response?.status === 403) {
        setError('U heeft geen toegang tot deze functie.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Er is een fout opgetreden bij het opslaan van het product.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-products-panel">
      <div className="admin-products-header">
        <h2>Producten Beheer</h2>
        <button 
          className="btn btn-primary"
          onClick={() => openModal(null, 'create')}
        >
          <i className="fas fa-plus"></i> Nieuw Product
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="admin-products-controls">        <div className="search-section">
          <label htmlFor="product-search" className="search-label">
            Zoeken:
          </label>
          <div className="search-input-group">
            <input
              id="product-search"
              type="text"
              placeholder="Zoek op naam, beschrijving, fabrikant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="form-control search-input"
            />
            <button 
              onClick={handleSearch}
              className="btn btn-secondary search-btn"
              title="Zoeken"
            >
              <i className="fas fa-search"></i>
            </button>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  fetchProducts(1, selectedCategory, '');
                }}
                className="btn btn-sm btn-outline-secondary clear-search"
                title="Zoekterm wissen"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div><div className="filter-section">
          <label htmlFor="category-filter" className="filter-label">
            Categorie Filter:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="form-control category-select"
          >
            <option value="">Alle categorieën</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {selectedCategory && (
            <button
              onClick={() => handleCategoryFilter('')}
              className="btn btn-sm btn-outline-secondary clear-filter"
              title="Filter wissen"
            >
              <i className="fas fa-times"></i> Wissen
            </button>
          )}
        </div>      </div>

      {/* Results Summary */}
      {!isLoading && !error && (
        <div className="results-summary">
          <div className="results-count">
            {products.length > 0 ? (
              <>
                {products.length} product{products.length !== 1 ? 'en' : ''} gevonden
                {searchTerm && <span className="filter-info"> voor "{searchTerm}"</span>}
                {selectedCategory && <span className="filter-info"> in categorie "{selectedCategory}"</span>}
              </>
            ) : (
              <span>Geen producten gevonden</span>
            )}
          </div>
          
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                fetchProducts(1, '', '');
              }}
              className="btn btn-sm btn-outline-primary clear-all-filters"
            >
              <i className="fas fa-refresh"></i> Alle filters wissen
            </button>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="admin-error-message">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="admin-loading">
          <i className="fas fa-spinner fa-spin"></i>
          Producten laden...
        </div>
      )}

      {/* Products Table */}
      {!isLoading && !error && (
        <>
          <div className="admin-products-table-container">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Afbeelding</th>
                  <th>Naam</th>
                  <th>Categorie</th>
                  <th>Prijs</th>
                  <th>Voorraad</th>
                  <th>Recept Vereist</th>
                  <th>Fabrikant</th>
                  <th>Acties</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="no-products">
                      Geen producten gevonden.
                    </td>
                  </tr>
                ) : (
                  products.map(product => {
                    const isImageUrlValid = product.imageUrl && product.imageUrl.startsWith('http');
                    if (!isImageUrlValid) {
                      product.imageUrl = ''; // Reset to empty if URL is invalid
                    }
                    const categoryVal = product.category ? `${product.category.toLowerCase().replace(/\s+/g, '-')}` : 'unknown';
                    console.debug(`Rendering product: ${product.name}, Category: ${categoryVal}`);
                    return <tr key={product.id}>
                      <td>
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="product-thumbnail"
                          />
                        ) : (
                          <div className="product-no-image">
                            <i className="fas fa-pills"></i>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="product-name">{product.name}</div>
                        {product.dosage && (
                          <div className="product-dosage">{product.dosage}</div>
                        )}
                      </td>
                      <td>
                        <div className="product-category">{categoryVal}</div>
                      </td>
                      <td>
                        <span className="product-price">{formatPrice(product.price)}</span>
                      </td>
                      <td>
                        <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                          {product.inStock ? 'Op voorraad' : 'Uitverkocht'}
                        </span>
                      </td>
                      <td>
                        <span className={`prescription-status ${product.requiresPrescription ? 'requires-prescription' : 'no-prescription'}`}>
                          {product.requiresPrescription ? 'Ja' : 'Nee'}
                        </span>
                      </td>
                      <td>{product.manufacturer || '-'}</td>
                      <td>
                        <div className="product-actions">
                          <button
                            onClick={() => openModal(product, 'view')}
                            className="btn btn-sm btn-info"
                            title="Bekijken"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => openModal(product, 'edit')}
                            className="btn btn-sm btn-warning"
                            title="Bewerken"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-secondary"
              >
                Vorige
              </button>
              
              <span className="pagination-info">
                Pagina {currentPage} van {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
              >
                Volgende
              </button>
            </div>
          )}
        </>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalMode === 'create' && 'Nieuw Product'}
                {modalMode === 'edit' && 'Product Bewerken'}
                {modalMode === 'view' && 'Product Details'}
              </h3>
              <button onClick={closeModal} className="modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>            <div className="modal-body">
              {modalMode === 'view' && selectedProduct && (
                <div className="product-details view-mode">
                  {selectedProduct.imageUrl && (
                    <div className="product-image-large">
                      <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
                    </div>
                  )}
                  <div className="product-info-grid">
                    <div className="info-item">
                      <strong>Naam:</strong>
                      <span>{selectedProduct.name}</span>
                    </div>
                    <div className="info-item">
                      <strong>Categorie:</strong>
                      <span className="category-badge">{selectedProduct.category}</span>
                    </div>
                    <div className="info-item">
                      <strong>Prijs:</strong>
                      <span className="price-value">{formatPrice(selectedProduct.price)}</span>
                    </div>
                    <div className="info-item">
                      <strong>Voorraad:</strong>
                      <span className={`stock-indicator ${selectedProduct.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {selectedProduct.inStock ? 'Op voorraad' : 'Uitverkocht'}
                      </span>
                    </div>
                    <div className="info-item">
                      <strong>Recept vereist:</strong>
                      <span className={`prescription-indicator ${selectedProduct.requiresPrescription ? 'required' : 'not-required'}`}>
                        {selectedProduct.requiresPrescription ? 'Ja' : 'Nee'}
                      </span>
                    </div>
                    {selectedProduct.dosage && (
                      <div className="info-item">
                        <strong>Dosering:</strong>
                        <span>{selectedProduct.dosage}</span>
                      </div>
                    )}
                    {selectedProduct.manufacturer && (
                      <div className="info-item">
                        <strong>Fabrikant:</strong>
                        <span>{selectedProduct.manufacturer}</span>
                      </div>
                    )}
                    {selectedProduct.description && (
                      <div className="info-item full-width">
                        <strong>Beschrijving:</strong>
                        <span>{selectedProduct.description}</span>
                      </div>
                    )}
                  </div>
                  <div className="modal-actions">
                    <button 
                      onClick={() => {
                        setModalMode('edit');
                        setEditFormData({ ...selectedProduct });
                      }}
                      className="btn btn-warning"
                    >
                      <i className="fas fa-edit"></i> Bewerken
                    </button>
                  </div>
                </div>
              )}

              {(modalMode === 'edit' || modalMode === 'create') && editFormData && (
                <div className="product-form edit-mode">
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="product-name">Naam *</label>
                        <input
                          id="product-name"
                          type="text"
                          value={editFormData.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="product-category">Categorie *</label>
                        <select
                          id="product-category"
                          value={editFormData.category}
                          onChange={(e) => handleFormChange('category', e.target.value)}
                          className="form-control"
                          required
                        >
                          <option value="">Selecteer categorie</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="product-price">Prijs (€) *</label>
                        <input
                          id="product-price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={editFormData.price}
                          onChange={(e) => handleFormChange('price', parseFloat(e.target.value) || 0)}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="product-manufacturer">Fabrikant</label>
                        <input
                          id="product-manufacturer"
                          type="text"
                          value={editFormData.manufacturer || ''}
                          onChange={(e) => handleFormChange('manufacturer', e.target.value)}
                          className="form-control"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="product-dosage">Dosering</label>
                        <input
                          id="product-dosage"
                          type="text"
                          value={editFormData.dosage || ''}
                          onChange={(e) => handleFormChange('dosage', e.target.value)}
                          className="form-control"
                          placeholder="bijv. 500mg, 2x daags"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="product-image">Afbeelding URL</label>
                        <input
                          id="product-image"
                          type="url"
                          value={editFormData.imageUrl}
                          onChange={(e) => handleFormChange('imageUrl', e.target.value)}
                          className="form-control"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="product-description">Beschrijving</label>
                        <textarea
                          id="product-description"
                          value={editFormData.description || ''}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          className="form-control"
                          rows={3}
                          placeholder="Gedetailleerde beschrijving van het product..."
                        />
                      </div>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={editFormData.inStock}
                            onChange={(e) => handleFormChange('inStock', e.target.checked)}
                          />
                          <span className="checkmark"></span>
                          Op voorraad
                        </label>
                      </div>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={editFormData.requiresPrescription}
                            onChange={(e) => handleFormChange('requiresPrescription', e.target.checked)}
                          />
                          <span className="checkmark"></span>
                          Recept vereist
                        </label>
                      </div>
                    </div>

                    <div className="modal-actions">
                      <button 
                        type="button" 
                        onClick={closeModal}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                      >
                        Annuleren
                      </button>
                      <button 
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Opslaan...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save"></i> 
                            {modalMode === 'create' ? 'Toevoegen' : 'Opslaan'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPanel;
