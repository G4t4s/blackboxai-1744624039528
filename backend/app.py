from flask import Flask, request, jsonify
from pymongo import MongoClient
from werkzeug.utils import secure_filename
import gridfs
from config import MONGODB_URI
import sys
import io
import contextlib
import traceback

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

@app.route('/execute', methods=['POST'])
def execute_code():
    data = request.get_json()
    if not data or 'code' not in data:
        return jsonify({'error': 'No code provided'}), 400

    code = data['code']

    # Redirect stdout to capture print statements
    stdout = io.StringIO()
    try:
        with contextlib.redirect_stdout(stdout):
            # Use exec in a restricted namespace
            exec_globals = {}
            exec_locals = {}
            exec(code, exec_globals, exec_locals)
        output = stdout.getvalue()
        return jsonify({'output': output}), 200
    except Exception:
        error_msg = traceback.format_exc()
        return jsonify({'error': error_msg}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
