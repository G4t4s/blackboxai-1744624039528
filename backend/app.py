from flask import Flask, request, jsonify
from pymongo import MongoClient
from werkzeug.utils import secure_filename
import gridfs
from config import MONGODB_URI

app = Flask(__name__)

# Configure MongoDB Atlas connection
client = MongoClient(MONGODB_URI)
db = client['image_upload_db']
fs = gridfs.GridFS(db)

@app.route('/upload', methods=['POST'])
def upload():
    if 'images' not in request.files:
        return jsonify({'error': 'No images uploaded'}), 400

    uploaded_files = request.files.getlist('images')
    saved_files = []

    for file in uploaded_files:
        if file.filename == '':
            continue
            
        filename = secure_filename(file.filename)
        file_id = fs.put(file, filename=filename)
        saved_files.append(str(file_id))

    return jsonify({
        'message': 'Images uploaded successfully',
        'file_ids': saved_files
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
