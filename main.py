from flask import Flask, jsonify, render_template, request
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "my-super-secret-key-de-mns"  # Dans un contexte de prod, vous ne feriez pas ça, évidemment. La clé doit être dans une variable d'environnement, sécurisée (on verra ça plus tard).

jwt = JWTManager(app)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    # Authentification fictive
    if username == "mns" and password == "mns":
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    return jsonify({"msg": "Identifiants invalides"}), 401

@app.route('/api/me', methods=['GET'])
@jwt_required()
def me():
    current_user = get_jwt_identity()
    return jsonify(username=current_user), 200

@app.route('/api/sessions', methods=['GET'])
@jwt_required()
def get_sessions():
    return jsonify([
        {"id": 1, "activity": "lecture", "duration": 45, "date": "2024-05-20T17:00"},
        {"id": 2, "activity": "sport", "duration": 30, "date": "2024-05-19T18:00"}
    ])

@app.route('/api/sessions', methods=['POST'])
@jwt_required()
def add_session():
    # ⚠️ Pensez à valider les données (que se passe-t-il si j'utilise une string dans la durée ?)
    data = request.json
    print(data) # 👈 Les données que vous recevez du frontend.
    print(data.get("activity")) # 👈 Pour récupérer le nom de l'activité par exemple.

    return jsonify({"message": "Session enregistrée", "session": data}), 201

@app.route('/api/activities', methods=['GET'])
@jwt_required()
def get_activities():
    return jsonify(["lecture", "sport", "travail"])

@app.route('/api/activities', methods=['POST'])
@jwt_required()
def add_activity():
    data = request.json
    return jsonify({"message": "Activité ajoutée", "activity": data.get("name")}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5001)
