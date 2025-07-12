# TypeFace

Frontend Setup <br>
Open your terminal. <br><br>
Add .env file and put local host url
VITE_API_URL="http://127.0.0.1:5000"
Run the following command to install dependencies:<br>
npm install<br>
npm run dev <br><br>
For any clarification use API_ENDPOINTS.md For API json structure<br><br>



Backend Setup
Create a virtual environment: <br>
python -m venv .venv <br>
Add .env file and put local host MongoDB url
MONGO_URL="mongodb://localhost:27017"
DB_NAME="TypeFace"
UPLOAD_FOLDER="Files"
Activate the virtual environment:<br>
 On Windows:<br>
.venv\Scripts\activate<br>
 On macOS/Linux:
source .venv/bin/activate<br>
Install the required packages:<br>
pip install -r requirements.txt<br><br>

Run the backend server (by default it runs on http://127.0.0.1:5000)
