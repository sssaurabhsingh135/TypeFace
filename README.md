# FullStack

full-stack application consisting of a frontend built with Vite and a backend powered by Python and MongoDB.

---

## 🔧 Frontend Setup

Follow these steps to get the frontend up and running:

1. Open your terminal.
2. Create a `.env` file in the root directory and add the following:
   ```env
   VITE_API_URL="http://127.0.0.1:5000"
   ```
3. Install project dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

📄 For detailed API usage, refer to the [`API_ENDPOINTS.md`](API_ENDPOINTS.md) file which documents the API structure and expected JSON format.

---

## 🖥️ Backend Setup

To set up and run the backend server:

1. Create a virtual environment:

   ```bash
   python -m venv .venv
   ```

2. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   MONGO_URL="mongodb://localhost:27017"
   DB_NAME="TypeFace"
   UPLOAD_FOLDER="Files"
   ```

3. Activate the virtual environment:

   - **On Windows:**

     ```bash
     .venv\Scripts\activate
     ```

   - **On macOS/Linux:**

     ```bash
     source .venv/bin/activate
     ```

4. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

5. Run the backend server:

   ```bash
   python app.py
   ```

   By default, the backend runs on: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 📂 Project Structure

```
/TypeFace
├── frontend/
├── backend/
│   ├── Files/
│   ├── app.py
│   └── requirements.txt
├── .env
├── API_ENDPOINTS.md
└── README.md
```

---

## 🛠️ Notes

- Ensure MongoDB is running locally on port `27017`.
- The `UPLOAD_FOLDER` will store all uploaded files in the `Files/` directory.
- If you face any issues, refer to `API_ENDPOINTS.md` or open an issue in the repository.

---


