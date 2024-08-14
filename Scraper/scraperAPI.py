from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from scraper import submitForm

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "content-Type"


@app.route('/submitForm', methods=['POST'])
@cross_origin()
def submit_form():
    #Getting the data from the request
    data = request.json
    location = data.get('location')
    description = data.get('description')
    size = data.get('size')
    
    #Check if the location, description, and size are provided
    if not location or not description or not size:
        return jsonify({'error': 'Please provide location, description, and size'}), 400    

    #Call the function to submit the form and return the result
    result = submitForm(location, description, size)
    if result:
        return jsonify({'message': 'Form submission succesful'}), 200
    else:
        return jsonify({'error': 'Form submission failed'}), 500


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
