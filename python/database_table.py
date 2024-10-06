import mysql.connector
from flask import Flask, request, jsonify,redirect,url_for
from flask_cors import CORS
import os
import json

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
#record database infomation in json
@app.route('/database_info', methods=['POST'])
def database_info():
    try:
        data = request.get_json()
        host = data.get('dbHost')
        user = data.get('dbUser')
        passwd = data.get('dbPasswd')
        database = data.get('dbdatabase').lower()

        data_to_write = {
                "host": host,
                "user": user,
                "passwd": passwd,
                "database": database
            }
            
        json_file_path = "json/table_database.json"
        with open(json_file_path, "w") as json_file:
            json.dump(data_to_write, json_file)
        print("1")
        result = test_result(host, user, passwd, database)
        print("2")
        if result:
            print("3")
            return jsonify({"success": True})
        else:
            print("4")
            return jsonify({"success": False})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

def test_result(host, user, passwd, database):
    try:
        # Establish a connection to the MySQL server without specifying a database
        connection = mysql.connector.connect(
            host=host,
            user=user,
            passwd=passwd
        )

        # Create a cursor object to execute queries
        cursor = connection.cursor()

        # Execute a query to check if the database exists
        cursor.execute("SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = %s", (database,))

        # Fetch the result
        result = cursor.fetchone()

        if result:
            print(f"The database '{database}' exists.")
            return True
        else:
            print(f"The database '{database}' does not exist.")
            return False

    except Exception as e:
        print(f"Error: {e}")
        return False

    finally:
        if connection.is_connected():
            connection.close()

def create_db_connection(host, user, passwd, database):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            passwd=passwd
        )
    except:
        print("Error")
    return connection

def candidate_1(table):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        query = "SELECT candidate_no FROM {} WHERE id = 1;".format(table)
        cursor.execute(query)
        result = cursor.fetchone()
        return result[0]
    except Exception:
        print("fail to get candidate no")
        return None
    finally:
        cursor.close()
        connection.close()

@app.route('/create_database', methods=['POST'])
def create_or_ignore_database():
    try:
        data = request.get_json()
        host = data.get('dbHost')
        user = data.get('dbUser')
        passwd = data.get('dbPasswd')
        database = data.get('dbdatabase').lower()

        connection = create_db_connection(host, user, passwd, database)
        if connection is None:
            return jsonify({"success": False, "error": "Failed to connect to the MySQL server"})

        cursor = connection.cursor()
        create_db_query = f"CREATE DATABASE IF NOT EXISTS {database}"
        cursor.execute(create_db_query)
        cursor.close()
        connection.close()

        return jsonify({"success": True, "message": f"Database '{database}' created or already exists."})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route('/delete_database_table', methods=['POST'])
def delete_database_table():
    json_file_path = "json/table_database.json"
    # Use the os module to delete a file
    if os.path.exists(json_file_path):
        os.remove(json_file_path)
        return jsonify({"success": True})
    else:
        return jsonify({"success": True})
    
@app.route('/create_candidate_image', methods=['POST'])
def create_candidate_image():
    try:
        data = request.get_json()
        directory_path = 'candidate_image' 
        # Delete all files in the directory
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                file_path = os.path.join(root, file)
                os.remove(file_path)
            print(f'All files in {directory_path} have been deleted.')

        with open('json/table_data.json', 'r') as file:
            data = json.load(file)
        table_data = data.get('table')

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        candidate_num2=0

        try:
            query2 = "SELECT candidate_no FROM {} WHERE id = 1;".format(table_data)
            cursor.execute(query2)
            candidate_num = cursor.fetchall()
            print("get total candidate "+str(int(candidate_num[0][0])))
            candidate_num2=int(candidate_num[0][0])
        except Exception:
            print("Fail to get total candidate")
            response_data = {"success": False, "message": "Fail to get total candidate"}
            return jsonify(response_data)

        

        for i in range(candidate_num2+1):
            j=i+2
            query = "SELECT image_data, image_name FROM {} WHERE id = %s".format(table_data)
            cursor.execute(query, (j,))
            result = cursor.fetchone()
            print("candidate: "+str(j))
            if result:
                image_data, image_name = result[0], result[1]
                image_format1 = image_name.split('.')
                if len(image_format1) > 1:
                    image_format = image_format1[-1]  # Get the last part as the file extension
                    print('File extension:', image_format)
                else:
                    print('No file extension found')
                    pass

                if image_format == 'png':
                    print('image candidate: '+str(j))
                    # Save the image to the specified directory
                    image_path = os.path.join('candidate_image/',str(i+1)+".png")
                    print(f"Saving image data to {image_path}")
                    with open(image_path, 'wb') as image_file:
                        image_file.write(image_data)
                else:
                    print("get image ",image_name," fail")
                    pass
            else:
                print("image candidate",str(j),"not found")
                pass
            print('image candidate 2: '+str(j))
        
        response_data = {"success": True, "message": "success get candidate image from database"}
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        connection.close()

@app.route('/create_ads_image', methods=['POST'])
def create_ads_image():

    with open('json/table_data.json', 'r') as file:
        data = json.load(file)
        table_data = data.get('table')

    try:
        directory_path = 'image' 
        # Delete all files in the directory
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                file_path = os.path.join(root, file)
                os.remove(file_path)
            print(f'All files in {directory_path} have been deleted.')
        num_image = ads_image_num(table_data)

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        for i in range(num_image):
            o = i + 1
            try:
                query = "SELECT image_data2 FROM {} WHERE id = %s".format(table_data)
                cursor.execute(query, (o,))
                result = cursor.fetchone()

                if result:
                    image_data2 = result[0]
                    image_path = os.path.join('image/', str(o) + ".png")

                    print(f"Saving image data to {image_path}")

                    with open(image_path, 'wb') as image_file:
                        image_file.write(image_data2)
                else:
                    print(f"No data found for ID {o}")

            except mysql.connector.Error as db_error:
                print(f"Database error: {db_error}")

        response_data = {"success": True, "message": "Successfully retrieved ads images from the database"}
        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": str(e)})

    finally:
        cursor.close()
        connection.close()

@app.route('/read_image_total', methods=['POST'])
def read_image_total():
    try:
        folder_path = 'image'
        files = os.listdir(folder_path)

        # Print file names
        for file in files:
            print(file)

        file_count = len(files)
        
        # Return JSON response using jsonify
        response_data = {"success": True, "total": file_count}
        return jsonify(response_data)
    
    except Exception as e:
        # Return JSON response for error
        response_data = {"success": False, "message": f"Failed to retrieve image files: {e}"}
        return jsonify(response_data)

@app.route('/delete_login', methods=['POST'])
def delete_login():
    json_file_path = "json/login_status.json"
    # Use the os module to delete a file
    if os.path.exists(json_file_path):
        os.remove(json_file_path)
        return jsonify({"success": True})
    else:
        return jsonify({"success": True})
    
@app.route('/get_time', methods=['POST'])
def get_time():
    json_file_path = "json/time.json"

    try:
        if os.path.exists(json_file_path):
            os.remove(json_file_path)
            print("File deleted successfully")
    except Exception as e:
        print(f"Error deleting file: {str(e)}")

    with open('json/table_data.json', 'r') as json_file:
        data = json.load(json_file)
        table = data.get('table')

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "SELECT start_time, end_time FROM {}".format(table)

    try:
        cursor.execute(query)
        result = cursor.fetchone()

        if result:
            data_to_write = {
                "start_time": result[0],
                "end_time": result[1]
            }

            # Fetch all remaining rows if any
            remaining_rows = cursor.fetchall()

            with open(json_file_path, "w") as json_file:
                json.dump(data_to_write, json_file)
            print(result)
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": "No data found in the database"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    finally:
        cursor.close()
        connection.close()
        
@app.route('/read_login_1', methods=['POST'])
def read_login_1():
    level = read_login()
    if level is not None and level <= 1:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})
    
@app.route('/read_login_2', methods=['POST'])
def read_login_2():
    level = read_login()
    print("level: "+str(level))
    if level is not None and level <= 2:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})
    
@app.route('/read_login_3', methods=['POST'])
def read_login_3():
    level = read_login()
    print("level: "+str(level))
    if level is not None and level <= 3:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})
    
def ads_image_num(table):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        query = "SELECT COUNT(*) as total_rows FROM {} WHERE image_data2 IS NOT NULL".format(table)
        cursor.execute(query)
        result = cursor.fetchone()

        return result[0]
    except Exception as e:
        print(f"Error: {e}")
        return 0
    finally:
        cursor.close()
        connection.close()

def read_login():
    with open('json/login_status.json', 'r') as file:
        data = json.load(file)
    level = data.get('level')  # Assuming the key is 'level'
    return level
    
if __name__ == "__main__":
    app.run(
        host='127.0.0.1',
        port=5007,
        debug=True
    )