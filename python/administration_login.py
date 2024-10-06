import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)

with open('json/table_database.json', 'r') as json_file:
            data = json.load(json_file)
            host1 = data.get('host')
            user1 = data.get('user')
            passwd1 = data.get('passwd')
CORS(app)

username =''

def verify_credentials(username, password):
    try:
        # Create a database connection
        mydb = mysql.connector.connect(
            host=host1,
            user=user1,
            passwd=passwd1,
            database="try"
        )

        cur = mydb.cursor()

        # Define the SQL query to check the credentials
        query = "SELECT USERNAME, PASSWORD FROM user WHERE USERNAME = %s AND PASSWORD = %s"
        cur.execute(query, (username, password))
        result = cur.fetchone()

        # Check if a matching user was found
        if result:
            return True
        else:
            return False

    except Exception as e:
        print("An error occurred:", str(e))
        return False
    finally:
        cur.close()
        mydb.close()

def create_login():
    try:
        global username
        mydb = mysql.connector.connect(
            host=host1,
            user=user1,
            passwd=passwd1,
            database="try"
        )

        cursor = mydb.cursor()

        query = "SELECT USERNAME,level FROM user WHERE USERNAME = %s"
        cursor.execute(query, (username,))
        result = cursor.fetchall()   

        if result:
            data_to_write = {
                "user": result[0][0], 
                "level": result[0][1]
            }
            # Specify the path and name of the JSON file
            json_file_path = "json/login_status.json"

            # Write JSON data to a file
            with open(json_file_path, "w") as json_file:
                json.dump(data_to_write, json_file)
            
            return 'successful to create login json'
        else:
            return 'fail to create login json'
    except Exception as e:
        return 'fail to create login json'
    finally:
        cursor.close()
        mydb.close()

@app.route('/administration_login', methods=['POST'])
def administration_login():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Extract username and password
        global username
        username = data.get('username')
        password = data.get('password')

        # Verify credentials
        if verify_credentials(username, password):
            create_login();
            return jsonify({"message": "Login successful"})
        else:
            return jsonify({"message": "Login failed: Invalid credentials"})
    except Exception as e:
        return jsonify({"message": "An error occurred: " + str(e)})


@app.route('/favicon.ico')
def favicon():
    return '', 404


if __name__ == "__main__":
    app.run(
        host='127.0.0.1',
        port=5003,
        debug=True
    )

