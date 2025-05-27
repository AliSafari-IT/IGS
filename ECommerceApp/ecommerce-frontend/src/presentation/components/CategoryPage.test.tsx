import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CategoryPage from "./CategoryPage";
import { getProducts } from "../../application/useCases/getProducts";

// Mock the getProducts function
jest.mock("../../application/useCases/getProducts", () => ({
  getProducts: jest.fn(),
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("CategoryPage Component", () => {
  // Sample mock products for testing
  const mockProducts = [
    {
      id: "product-1",
      name: "Test Product 1",
      price: 25.99,
      imageUrl: "https://example.com/image1.jpg",
      category: "otc",
      description: "Test description 1",
      inStock: true,
      requiresPrescription: false,
      dosage: "500mg",
      manufacturer: "Test Manufacturer 1",
      medicationType: "tablets",
    },
    {
      id: "product-2",
      name: "Test Product 2",
      price: 75.5,
      imageUrl: "https://example.com/image2.jpg",
      category: "otc",
      description: "Test description 2",
      inStock: true,
      requiresPrescription: true,
      dosage: "250mg",
      manufacturer: "Test Manufacturer 2",
      medicationType: "capsules",
    },
    {
      id: "product-3",
      name: "Test Product 3",
      price: 10.25,
      imageUrl: "https://example.com/image3.jpg",
      category: "prescription",
      description: "Test description 3",
      inStock: false,
      requiresPrescription: true,
      dosage: "100mg",
      manufacturer: "Test Manufacturer 3",
      medicationType: "liquid",
    },
  ];

  const renderWithRouter = (categoryId = "otc") => {
    return render(
      <MemoryRouter initialEntries={[`/category/${categoryId}`]}>
        <Routes>
          <Route path="/category/:categoryId" element={<CategoryPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the API response
    (getProducts as jest.Mock).mockResolvedValue(mockProducts);
  });

  it("renders the loading state initially", () => {
    renderWithRouter();
    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  it("renders the category title and description", async () => {
    renderWithRouter("otc");

    await waitFor(() => {
      expect(screen.getByText("Over-the-Counter Products")).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "Browse our selection of high-quality over-the-counter products."
      )
    ).toBeInTheDocument();
  });

  it("displays products after loading", async () => {
    renderWithRouter("otc");

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
    });

    // Should show OTC products
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();

    // Should not show prescription products from a different category
    expect(screen.queryByText("Test Product 3")).not.toBeInTheDocument();
  });

  it("navigates to product details when clicking View Details", async () => {
    renderWithRouter("otc");

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
    });

    // Click the View Details button for the first product
    const viewDetailsButtons = screen.getAllByText("View Details");
    fireEvent.click(viewDetailsButtons[0]);

    // Check if navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith("/product/product-1");
  });

  it("renders the sidebar with filter options", async () => {
    renderWithRouter("otc");

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
    });

    // Both OTC products should be visible initially
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();

    // Verify that the sidebar filter elements exist
    expect(screen.getByText("Price Range")).toBeInTheDocument();
    expect(screen.getByText("Medication Type")).toBeInTheDocument();

    // Check for the presence of the price slider
    const priceSlider = document.querySelector(".price-slider");
    expect(priceSlider).toBeInTheDocument();

    // Check for medication type checkboxes
    const filterOptions = document.querySelectorAll(".filter-option");
    expect(filterOptions.length).toBeGreaterThan(0);
  });

  it("handles empty product arrays from API", async () => {
    // Mock empty products array from API
    (getProducts as jest.Mock).mockResolvedValue([]);

    renderWithRouter("otc");

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
    });

    // The component should generate mock products even when API returns empty array
    // So we should still see product cards
    const productCards = document.querySelectorAll(".product-card");
    expect(productCards.length).toBeGreaterThan(0);
  });

  it("displays products filtered by category", async () => {
    // Mock only 2 OTC products
    const otcProducts = mockProducts.filter((p) => p.category === "otc");
    (getProducts as jest.Mock).mockResolvedValue(mockProducts);

    renderWithRouter("otc");

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
    });

    // Should show OTC products
    expect(screen.getByText("Test Product 1")).toBeInTheDocument();
    expect(screen.getByText("Test Product 2")).toBeInTheDocument();

    // Should not show prescription products
    expect(screen.queryByText("Test Product 3")).not.toBeInTheDocument();

    // Check that the filter summary shows the correct category
    const categoryTitle = screen.getByText("Over-the-Counter Products");
    expect(categoryTitle).toBeInTheDocument();
  });

  it("handles pagination correctly", async () => {
    // Create more mock products to test pagination
    const manyProducts = Array.from({ length: 25 }, (_, i) => ({
      id: `product-${i + 1}`,
      name: `Test Product ${i + 1}`,
      price: 10 + i,
      imageUrl: `https://example.com/image${i + 1}.jpg`,
      category: "otc",
      description: `Test description ${i + 1}`,
      inStock: true,
      requiresPrescription: false,
      dosage: "100mg",
      manufacturer: "Test Manufacturer",
      medicationType: "tablets",
    }));

    (getProducts as jest.Mock).mockResolvedValue(manyProducts);

    renderWithRouter("otc");

    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
    });

    // Should show pagination controls
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();

    // Previous button should be disabled on first page
    const previousButton = screen.getByText("Previous");
    expect(previousButton).toBeDisabled();

    // Next button should be enabled
    const nextButton = screen.getByText("Next");
    expect(nextButton).not.toBeDisabled();

    // Click next to go to page 2
    fireEvent.click(nextButton);

    // Previous button should now be enabled
    await waitFor(() => {
      expect(previousButton).not.toBeDisabled();
    });
  });

  it("generates mock products when API fails", async () => {
    // Simulate API failure
    (getProducts as jest.Mock).mockRejectedValue(new Error("API failed"));

    renderWithRouter("otc");

    // Should still display products (mock ones) after loading
    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
    });

    // Should show some product cards (mock products)
    const productCards = document.querySelectorAll(".product-card");
    expect(productCards.length).toBeGreaterThan(0);
  });
});
