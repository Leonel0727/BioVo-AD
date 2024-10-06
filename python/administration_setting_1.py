import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import time

app = Flask(__name__)

CORS(app)

with open('json/table_database.json', 'r') as json_file:
        data = json.load(json_file)
        host1 = data.get('host')
        user1 = data.get('user')
        passwd1 = data.get('passwd')
        database = data.get('database')

# Configure Database Connection Information
db_config = {
    "host":host1,
    "user":user1,
    "passwd":passwd1,
    "database":database
}

@app.route('/db_res', methods=['GET'])
def db_res():
    try:
        app.config['TEMPLATES_AUTO_RELOAD'] = True
        with open('json/table_database.json', 'r') as json_file:
            data = json.load(json_file)
            host1 = data.get('host')
            user1 = data.get('user')
            passwd1 = data.get('passwd')
            database = data.get('database')

        global db_config
        db_config = {
            "host": host1,
            "user": user1,
            "passwd": passwd1,
            "database": database
        }
        return jsonify({"success": True})
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

# Handle AJAX requests
@app.route('/show_tables', methods=['GET'])
def get_tables():
    try:
        # establish database connection
        connection = mysql.connector.connect(**db_config)

        # create a cursor
        cursor = connection.cursor()

        # execute the SHOW TABLES query
        cursor.execute("SHOW TABLES")

        # retrieve the query results
        tables = [row[0] for row in cursor]

        # close the cursor and connection
        cursor.close()
        connection.close()

        return jsonify({"tables": tables})

    except Exception as e:
        return jsonify({"error": str(e)})
    

@app.route('/create_table_candidate', methods=['POST'])
def create_table_candidate():
    try:
        # retrieve JSON data from the request
        data = request.get_json()

        # extract table name.
        table_name = data.get('tableName')

        # create database connection
        connection = mysql.connector.connect(**db_config)

        # create cursor
        cursor = connection.cursor()

        # execute CREATE TABLE and create element
        query = "CREATE TABLE {} (id INT AUTO_INCREMENT PRIMARY KEY,start_time VARCHAR(255),end_time VARCHAR(255),position VARCHAR(20),candidate_no VARCHAR(10),multiple_positions VARCHAR(10),name VARCHAR(255),class1 VARCHAR(50),skills VARCHAR(255),age VARCHAR(10),bio VARCHAR(500),image_data LONGBLOB,image_name VARCHAR(255),image_data2 LONGBLOB)"
        
        cursor.execute(query.format(table_name))

        # close cursor and connection
        cursor.close()
        connection.close()

        # return successful response
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    
@app.route('/create_table_voter', methods=['POST'])
def create_table_voter():
    try:
        # get JSON data from request
        data = request.get_json()

        # extract table name
        table_name = data.get('tableName')

        # create database connection
        connection = mysql.connector.connect(**db_config)

        #Create a cursor
        cursor = connection.cursor()

        # Execute CREATE TABLE statement and create elements
        query = "CREATE TABLE {} (ic VARCHAR(12) PRIMARY KEY,matric VARCHAR(12),name VARCHAR(100),email VARCHAR(100),class VARCHAR(10),status VARCHAR(5) DEFAULT 'no',image_data LONGBLOB,image_name VARCHAR(255))"
            
        cursor.execute(query.format(table_name))

        #Close cursor and connection
        cursor.close()
        connection.close()

        # Return a successful response
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    
@app.route('/create_table_voting', methods=['POST'])
def create_table_voting():
    try:
        # get JSON data from request
        data = request.get_json()

        # extract table name
        table_name = data.get('tableName')

        # create database connection
        connection = mysql.connector.connect(**db_config)

        #Create a cursor
        cursor = connection.cursor()

        # Execute CREATE TABLE statement and create elements
        query = "CREATE TABLE {} (id INT AUTO_INCREMENT PRIMARY KEY)"
            
        cursor.execute(query.format(table_name))

        #Close cursor and connection
        cursor.close()
        connection.close()

        # Return a successful response
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/find_table', methods=['POST'])
def find_table():
    try:
        # Get JSON data from the request
        data = request.get_json()

        #Extract table name
        table_name = data.get('tableName')

        # Create a database connection
        connection = mysql.connector.connect(**db_config)

        # Create a cursor
        cursor = connection.cursor()

        cursor.execute("SHOW TABLES LIKE %s", (table_name,))

        # Get the query result
        result = cursor.fetchone()

        if result:
            return jsonify({"success": True})
        else:
            return jsonify({"success": False})

    except Exception as e:
        print("An error occurred:", str(e))
    finally:
        # Close cursor and connection
        cursor.close()
        connection.close()

@app.route('/delete_table_candidate', methods=['POST'])
def delete_table_candidate():
    json_file_path = "json/table_data.json"
    # Use the os module to delete a file
    if os.path.exists(json_file_path):
        os.remove(json_file_path)
        return jsonify({"success": True})
    else:
        return jsonify({"success": True})

@app.route('/delete_table_voter', methods=['POST'])
def delete_table_voter():
    json_file_path = "json/table_data_1.json"
    # Use the os module to delete a file
    if os.path.exists(json_file_path):
        os.remove(json_file_path)
        return jsonify({"success": True})
    else:
        return jsonify({"success": True})

@app.route('/delete_table_voting', methods=['POST'])
def delete_table_voting():
    json_file_path = "json/table_data_2.json"
    # Use the os module to delete a file
    if os.path.exists(json_file_path):
        os.remove(json_file_path)
        return jsonify({"success": True})
    else:
        return jsonify({"success": True})

@app.route('/create_json_candidate', methods=['POST'])
def create_json_candidate():
    try:
        data = request.get_json()
        table= data.get('tableName')

        data_to_write = {
            "table": table
        }
        #Specify the path and name of the JSON file
        json_file_path = "json/table_data.json"

        #Write JSON data to a file
        with open(json_file_path, "w") as json_file:
            json.dump(data_to_write, json_file)
        return jsonify ({"success": True})
    except Exception as e:
        return jsonify ({"success": False})
    
@app.route('/create_json_voter', methods=['POST'])
def create_json_voter():
    try:
        data = request.get_json()
        table= data.get('tableName')

        data_to_write = {
            "table": table
        }
        # Specify the path and name of the JSON file
        json_file_path = "json/table_data_1.json"

        #Write JSON data to a file
        with open(json_file_path, "w") as json_file:
            json.dump(data_to_write, json_file)
        return jsonify ({"success": True})
    except Exception as e:
        return jsonify ({"success": False})
    
@app.route('/create_json_voting', methods=['POST'])
def create_json_voting():
    try:
        data = request.get_json()
        table= data.get('tableName')

        data_to_write = {
            "table": table
        }
        # Specify the path and name of the JSON file
        json_file_path = "json/table_data_2.json"

        #Write JSON data to a file
        with open(json_file_path, "w") as json_file:
            json.dump(data_to_write, json_file)
        return jsonify ({"success": True})
    except Exception as e:
        return jsonify ({"success": False})
    

@app.route('/get_table_data_candidate', methods=['GET'])
def get_table_data_candidate():
    try:
        with open('json/table_data.json', 'r') as file:
            data = json.load(file)
        table_data = data.get('table')

        if not table_data:
            return jsonify({"message": "Please create or modify the table."})

        return jsonify(table_data)
    except Exception as e:
        table_data = "Error:Please create or modify the table."
        return jsonify(table_data)

@app.route('/get_table_data_voter', methods=['GET'])
def get_table_data_voter():
    try:
        with open('json/table_data_1.json', 'r') as file:
            data = json.load(file)
        table_data = data.get('table')

        if not table_data:
            return jsonify({"message": "Please create or modify the table."})

        return jsonify(table_data)
    except Exception as e:
        table_data = "Error:Please create or modify the table."
        return jsonify(table_data)

@app.route('/get_table_data_voting', methods=['GET'])
def get_table_data_voting():
    try:
        with open('json/table_data_2.json', 'r') as file:
            data = json.load(file)
        table_data = data.get('table')

        if not table_data:
            return jsonify({"message": "Please create or modify the table."})

        return jsonify(table_data)
    except Exception as e:
        table_data = "Error:Please create or modify the table."
        return jsonify(table_data)

position_no = 0
@app.route('/set_candidate', methods=['POST'])
def set_candidate():
    try:
        data = request.get_json()
        table_data = data['table_data']
        positions = data['positions']
        candidates = data['candidates']
        multiple_positions = 'no'

        id_value = 1
        global position_no
        position_no = positions

        # Execute a database insert or update operation
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Use parameterized queries to prevent SQL injection
        query = ("INSERT INTO {} (id, position, candidate_no, multiple_positions) "
                 "VALUES (%s, %s, %s, %s) "
                 "ON DUPLICATE KEY UPDATE "
                 "id = VALUES(id), position = VALUES(position), candidate_no = VALUES(candidate_no), multiple_positions = VALUES(multiple_positions)")

        cursor.execute(query.format(table_data), (str(id_value), positions, candidates, multiple_positions))
        connection.commit()
        cursor.close()
        connection.close()

        response = {'success': True, 'message': 'Data inserted or updated successfully'}
        return jsonify(response), 200
    except Exception as e:
        response = {'success': False, 'message': str(e)}
        return jsonify(response), 500

@app.route('/get_inform_data', methods=['GET'])
def get_inform_data():
    try:
        #Read the table name from a JSON file
        with open('json/table_data.json', 'r') as json_file:
            data = json.load(json_file)
            table = data.get('table')

        # Query MySQL data or perform other operations here, construct data, and return it to the frontend
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Check if there is data in the database
        query_check = "SELECT COUNT(*) FROM {} WHERE id=1".format(table)
        cursor.execute(query_check)
        data_in_database = cursor.fetchone()[0] > 0

        #If there is data in the database, then query related information
        if data_in_database:
            query = "SELECT position, candidate_no, multiple_positions FROM {} WHERE id=1".format(table)
            cursor.execute(query)
            result = cursor.fetchone()

            # Construct response data
            response_data = {
                "success": True,
                "table": table,
                "position_count": result[0],
                "candidate_count": result[1],
                "status": result[2]
            }
        else:
            response_data = {"success": False}
        
        cursor.close()
        connection.close()
        
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route('/create_voting', methods=['POST'])
def create_voting():
    try:
        with open('json/table_data_2.json', 'r') as json_file:
            data = json.load(json_file)
            table_data = data.get('table')

        # Execute a database insert or update operation
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        for j in range(60):
            h = j + 1
            try:
                # Column exists, drop it
                drop_query = "ALTER TABLE {} DROP COLUMN c{}".format(table_data, str(h))
                cursor.execute(drop_query)
            except Exception as e:
                # Handle the error, e.g., print or log the error message
                print(f"Error while dropping column c{h}: {str(e)}")
                # Optionally, you can continue to the next iteration
                continue

        for x in range(int(position_no)):
            y = x + 1
            # Add the column, specify data type
            query1 = "ALTER TABLE {} ADD COLUMN c{} VARCHAR(5)".format(table_data, str(y))
            cursor.execute(query1)

        connection.commit()
        cursor.close()
        connection.close()

        response = {'success': True, 'message': 'Data inserted or updated successfully'}
        return jsonify(response), 200
    except Exception as e:
        app.logger.error("Error in create_voting: %s", str(e))
        response = {'success': False, 'message': str(e)}
        return jsonify(response), 500
    




if __name__ == "__main__":
    app.run(
        host='127.0.0.1',
        port=5005,
        debug=True
    )