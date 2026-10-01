import { useState } from "react";
import "./App.css";

const App = () => {
  const [search, setSearch] = useState("");

  const documents = [
    { name: "FSD", file: "FSD.pdf" },
    { name: "React", file: "React.pdf" },
    { name: "JavaScript", file: "JavaScript.pdf" },
  ];

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Notes Portal App</h1>
        <p>Find and download your study materials</p>
      </header>

      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <main className="documents-grid">
        {filteredDocuments.length === 0 ? (
          <p className="no-results">No notes found matching your search.</p>
        ) : (
          filteredDocuments.map((doc) => (
            <div key={doc.file} className="document-card">
              <h2 className="document-title">{doc.name}</h2>
              <a
                href={`http://localhost:5000/files/${doc.file}`}
                className="download-btn"
                download
              >
                Download PDF
              </a>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default App;