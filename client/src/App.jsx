import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:10000/api/data")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Lỗi khi gọi API: ", err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Data từ server: {message || "Đang tải..."}</p>
      </header>
    </div>
  );
}
export default App;
