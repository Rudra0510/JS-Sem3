import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/products";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  description: "",
  stock: "",
  rating: "",
};

const currency = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + Number(product.stock || 0), 0),
    [products],
  );

  const inventoryValue = useMemo(
    () =>
      products.reduce(
        (sum, product) =>
          sum + Number(product.price || 0) * Number(product.stock || 0),
        0,
      ),
    [products],
  );

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Products could not be loaded.");
        }

        const data = await response.json();

        if (isMounted) {
          setProducts(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const addProduct = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.category.trim() || form.price === "") {
      setError("Product name, category, and price are required.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: Number(form.price),
          description: form.description,
          stock: form.stock === "" ? 0 : Number(form.stock),
          rating: form.rating === "" ? 0 : Number(form.rating),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Product could not be saved.");
      }

      setProducts((currentProducts) => [...currentProducts, payload]);
      setForm(emptyForm);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Product could not be deleted.");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <main className="app-shell">
      <section className="workspace" aria-labelledby="page-title">
        <header className="topbar">
          <div>
            <p className="eyebrow">Inventory</p>
            <h1 id="page-title">Product Management</h1>
          </div>

          <div className="summary-grid" aria-label="Inventory summary">
            <div className="summary-card">
              <span>{products.length}</span>
              <p>Products</p>
            </div>
            <div className="summary-card">
              <span>{totalStock}</span>
              <p>Units</p>
            </div>
            <div className="summary-card">
              <span>Rs. {currency.format(inventoryValue)}</span>
              <p>Value</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="alert" role="alert">
            {error}
          </div>
        )}

        <section className="panel" aria-labelledby="add-product-title">
          <div className="panel-heading">
            <h2 id="add-product-title">Add Product</h2>
          </div>

          <form className="product-form" onSubmit={addProduct}>
            <label>
              <span>Name</span>
              <input
                name="name"
                type="text"
                placeholder="Laptop Pro 14"
                value={form.name}
                onChange={updateForm}
              />
            </label>

            <label>
              <span>Category</span>
              <input
                name="category"
                type="text"
                placeholder="Electronics"
                value={form.category}
                onChange={updateForm}
              />
            </label>

            <label>
              <span>Price</span>
              <input
                name="price"
                type="number"
                min="0"
                placeholder="89999"
                value={form.price}
                onChange={updateForm}
              />
            </label>

            <label>
              <span>Stock</span>
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                placeholder="15"
                value={form.stock}
                onChange={updateForm}
              />
            </label>

            <label>
              <span>Rating</span>
              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="4.7"
                value={form.rating}
                onChange={updateForm}
              />
            </label>

            <label className="description-field">
              <span>Description</span>
              <input
                name="description"
                type="text"
                placeholder="Short product description"
                value={form.description}
                onChange={updateForm}
              />
            </label>

            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Add Product"}
            </button>
          </form>
        </section>

        <section className="panel" aria-labelledby="product-list-title">
          <div className="panel-heading">
            <h2 id="product-list-title">Products</h2>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Rating</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        <strong>{product.name}</strong>
                        {product.description && <p>{product.description}</p>}
                      </td>
                      <td>{product.category}</td>
                      <td>Rs. {currency.format(product.price)}</td>
                      <td>{product.stock}</td>
                      <td>{Number(product.rating || 0).toFixed(1)}</td>
                      <td>
                        <button
                          className="delete-button"
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;