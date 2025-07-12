from flask import Flask, jsonify, request, abort, send_file
from dotenv import load_dotenv
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
 


import os
load_dotenv()

app = Flask(__name__)
CORS(app)


client = MongoClient(os.getenv("MONGO_URI"))

# Access a database
db = client[os.getenv("DB_NAME")]

# Access a collection


@app.route('/')
def ping():
    return 'Ping Successful'



@app.route('/files/upload', methods=['POST'])
def upload_file():
    if 'files' not in request.files:
        return 'No file part in the request', 400

    files = request.files.getlist('files')
    
    uploadDate = request.form.get('uploadDate')

    if len(files) == 0:
        return 'No selected file', 400
    
    result=""
    list_files=[]
    collection = db["files"]
    for file in files:
        if not os.path.exists(os.getenv("UPLOAD_FOLDER")):
            os.makedirs(os.getenv("UPLOAD_FOLDER"))
        if collection.find_one({"filename": file.filename}):
            return jsonify({"message":"File already exists"}), 400
        file_type = file.content_type
        file.seek(0, 2) # Move to end of file
        file_size = file.tell()
        file.seek(0) # Reset file pointer to beginning
        result=collection.insert_one({"filename": file.filename, "path": os.getenv("UPLOAD_FOLDER")+"/"+file.filename, "uploadDate": uploadDate,"size":file_size,"type":file_type})
        file_path = os.path.join(os.getenv("UPLOAD_FOLDER"), f"{result.inserted_id}_{file.filename}")
        file.save(file_path)
        
        list_files.append(file.filename)
    
    
    response=collection.find_one({"_id": result.inserted_id})
    response['_id'] = str(response['_id'])
    return jsonify(response), 200

@app.route('/getFiles', methods=['GET'])
def get_uploaded_file():
    collection = db["files"]
    files = list(collection.find())

    
    for doc in files:
        doc['_id'] = str(doc['_id'])

    list_files = []
    print(files)
    for file in files:
        list_files.append(file["filename"])
    return jsonify(files), 200


@app.route('/download/<file_id>', methods=['GET'])
def download_file(file_id):
    collection = db["files"]
    try:
        result = collection.find_one({"_id": ObjectId(file_id)})
        if not result:
            abort(404, description="File record not found")

        stored_filename = f"{str(result['_id'])}_{result['filename']}"
        file_path = os.path.join(os.getenv("UPLOAD_FOLDER"), stored_filename)

      
        return send_file(file_path, as_attachment=True, download_name=result['filename'])

    except FileNotFoundError:
        abort(404, description="File not found")
    except Exception as e:
        abort(500, description=str(e))

@app.route('/files/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    collection = db["files"]
    try:
        result = collection.find_one({"_id": ObjectId(file_id)})
        if not result:
            abort(404, description="File record not found")

        stored_filename = f"{str(result['_id'])}_{result['filename']}"
        file_path = os.path.join(os.getenv("UPLOAD_FOLDER"), stored_filename)
        os.remove(file_path)
        collection.delete_one({"_id": ObjectId(file_id)})

        return jsonify({"message": "File deleted successfully"}), 200

    except FileNotFoundError:
        abort(404, description="File not found")
    except Exception as e:
        abort(500, description=str(e))


 




if __name__ == '__main__':
    app.run(debug=True)