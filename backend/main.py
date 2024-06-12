from flask import Flask, request, json, jsonify, make_response
from dbController import dbController
from datetime import datetime, date

db = dbController()
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

@app.route('/getPriceData', methods=['GET'])
def getPriceData():
    parameter_dict = request.args.to_dict()
    startDay = parameter_dict['startDay']
    endDay = parameter_dict['endDay']
    entpId = parameter_dict['entpId']
    goodId = parameter_dict['goodId']
    res = db.getPriceData(startDay, endDay, entpId, goodId)
    res = json.dumps(res, ensure_ascii=False)
    return res

@app.route('/fetchExternalPriceData', methods=['GET'])
def fetchExternalPriceData():
    parameter_dict = request.args.to_dict()
    goodInspectDay = parameter_dict.get('goodInspectDay')
    entpId = parameter_dict.get('entpId')
    
    try:
        prices = db.getExternalPriceData(goodInspectDay, entpId)
        print(prices)  # 콘솔에 출력
        return jsonify(prices), 200
    except Exception as e:
        return str(e), 500

@app.route('/updatePriceData', methods=['GET'])
def updatePriceData():
    # data = request.args.to_dict()
    # goodInspectDay = data.get('goodInspectDay')
    # entpId = data.get('entpId')
    
    goodInspectDay = 20240607
    entpId = 786

    try:
        result = db.updatePriceData(goodInspectDay, entpId)
        return result, 200
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8443)


