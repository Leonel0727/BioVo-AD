import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)

CORS(app)
with open('json/table_database.json', 'r') as json_file:
            data = json.load(json_file)
            host1 = data.get('host')
            user1 = data.get('user')
            passwd1 = data.get('passwd')

# Configure Database Connection Information
db_config = {
    "host":host1,
    "user":user1,
    "passwd":passwd1,
    "database":"try"
}

with open('json/table_database.json', 'r') as json_file:
            data = json.load(json_file)
            host1 = data.get('host')
            user1 = data.get('user')
            passwd1 = data.get('passwd')

def verify_credentials(username, password):
    try:
        # Create a database connection
        mydb = mysql.connector.connect(
            host=host1,
            user=user1,
            passwd=passwd1,
            database="TRY"
        )

        cur = mydb.cursor()

        # Define the SQL query to check the credentials
        query = "SELECT USERNAME FROM user WHERE USERNAME = %s"
        cur.execute(query, (username,))
        result = cur.fetchone()

        # Check if a matching user was found
        if result:
            #reset the password if found the user in database
            query1 = "UPDATE user SET PASSWORD = %s WHERE USERNAME = %s"
            cur.execute(query1,(password,username))
            mydb.commit()
            return True
        else:
            return False

    except Exception as e:
        print("An error occurred:", str(e))
        return False
    finally:
        cur.close()
        mydb.close()


@app.route('/administration_reset_pass', methods=['POST'])
def administration_reset_pass():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Extract username and password
        username = data.get('username')
        password = data.get('password')

        # Verify credentials
        if verify_credentials(username, password):
            return jsonify({"message": "Reset successful"})
        else:
            return jsonify({"message": "Reset failed: Invalid username"})
    except Exception as e:
        return jsonify({"message": "An error occurred: " + str(e)})
    

@app.route('/administration_detail', methods=['POST'])
def administration_detail():
    try:
        data = request.get_json()
        name = data['name']
        password = data['password']
        level = data['level']
        
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        query=("INSERT INTO user (USERNAME,PASSWORD,level)"
               "VALUES (%s,%s,%s)"
            )
        cursor.execute(query, (name,password,level))
        
        connection.commit()
        
        response = {'success': True, 'message': 'Data inserted or updated successfully'}
        return jsonify(response), 200
    except Exception as e:
        # Record exception information
        app.logger.error(str(e))
        response = {'success': False, 'message': 'Internal server error'}
        return jsonify(response), 500
    finally:
        cursor.close()
        connection.close()   

@app.route('/get_level', methods=['POST'])

@app.route('/favicon.ico')
def favicon():
    return '', 404


if __name__ == "__main__":
    app.run(
        host='127.0.0.1',
        port=5004,
        debug=True
    )

