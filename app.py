from flask import Flask,jsonify, request

from flask_pymongo import PyMongo

from bson.json_util import dumps

from bson.objectid import ObjectId

from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import (JWTManager, get_jwt_identity, jwt_required, create_access_token)

app = Flask(__name__)

app.secret_key = "secretkey"

app.config['MONGO_URI']= "mongodb://localhost:27017/Users"
app.config['JWT_SECRET_KEY'] = 'patrionTask'

jwt = JWTManager(app)
mongo = PyMongo(app)

@app.route('/login', methods=['POST'])
def login_user():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
        
    _json = request.json
    _email = _json['email']
    _password = _json['pwd']
    
    if not _email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not _password:
        return jsonify({"msg": "Missing password parameter"}), 400

    db_user = mongo.db.user.find_one({'email':_email})    

    isPasswordCorrect = check_password_hash(db_user['pwd'],_password)

    if isPasswordCorrect:
        access_token = create_access_token(identity=_email)
        return jsonify(access_token=access_token), 200
    else:
        return "unauthorized user"
    
@app.route('/add',methods=['POST'])
def add_user():
    _json = request.json
    _name = _json['name']
    _email = _json['email']
    _password = _json['pwd']

    if _name and _email and _password and request.method == 'POST':
        
        _hashed_password = generate_password_hash(_password)

        id = mongo.db.user.insert_one({'name':_name,'email':_email,'pwd':_hashed_password})

        resp = jsonify("User added succesfully")

        resp.status_code = 200

        return resp
    else :
        return not_found()
    

@app.route('/users', methods=['GET'])
@jwt_required()
def users():    
    current_user = get_jwt_identity()
    # return jsonify(logged_in_as=current_user), 200
    users = mongo.db.user.find()
    resp = dumps(users)
    print(current_user)
    return resp

@app.route('/users/<id>')
def user(id):
    user = mongo.db.user.find_one({'_id':ObjectId(id)})
    resp = dumps(user)
    return resp

@app.route('/delete/<id>',methods=['DELETE'])
def delete_user(id):
    mongo.db.user.delete_one({'_id':ObjectId(id)})
    resp = jsonify('User deleted successfully!')
    resp.status_code = 200
    return resp

@app.route('/update/<id>',methods=['PUT'])
def update_user(id):
    _id = id
    _json = request.json
    _name = _json['name']
    _email = _json['email']
    _password = _json['pwd']

    if _name and _email and _password and _id and request.method == 'PUT':
        _hashed_password = generate_password_hash(_password)
        mongo.db.user.update_one({ '_id': ObjectId(_id['$oid']) if '$oid' in _id else ObjectId(_id)},{'$set':{'name':_name,'email':_email,'pwd':_hashed_password}})
        resp = jsonify("User update succesfully")
        resp.status_code = 200
        return resp
    else:
        return not_found()
@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Not Found' + request.url
    }
    resp = jsonify(message)
    resp.status_code= 404

    return resp


if __name__ == "__main__":
    app.run(debug=True)