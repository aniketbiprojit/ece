from flask import Flask, request
from flask_cors import CORS
from nsetools import Nse
app = Flask(__name__)

nse = Nse()
CORS(app)

@app.route('/get_quote', methods=['POST', 'GET'])
def index():
    quote = (request.args.get('quote'))
    print(quote)
    data=nse.get_quote(quote)
    print(data['lastPrice'])
    return data


app.run(debug=True, port=5000)
