import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import time

app = Flask(__name__)

with open('json/table_database.json', 'r') as json_file:
            data = json.load(json_file)
            host1 = data.get('host')
            user1 = data.get('user')
            passwd1 = data.get('passwd')
            database = data.get('database')

CORS(app, origins="*")

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

path1= ''

def search_bar(bar):
    try:
        conn = mysql.connector.connect(**db_config)
        cur = conn.cursor()

        with open('json/table_data_1.json', 'r') as json_file:
            data = json.load(json_file)
            table = data.get('table')

        query = "SELECT ic, status FROM {} WHERE ic = %s AND status = 'no'".format(table)
        cur.execute(query, (bar,))
        result = cur.fetchone()

        if result:
            return True
        else:
            return False

    except Exception as e:
        return False
    finally:
        cur.close()
        conn.close()


def delete_user_json():
    try:
        json_file_path = "json/user_data.json"
        if os.path.exists(json_file_path):
            os.remove(json_file_path)
            return True
        else:
            return False
    except Exception as e:
        return False
    
def create_user_json(bar):
    try:
        data_to_write = {
            "bar": bar
        }
        #Specify the path and name of the JSON file
        json_file_path = "json/user_data.json"

        #Write JSON data to a file
        with open(json_file_path, "w") as json_file:
            json.dump(data_to_write, json_file)
        return True
    except Exception as e:
        return False

# Handle AJAX requests
@app.route('/id_search_record', methods=['POST'])
def id_search_record():
    try:
        data = request.get_json()

        bar = data.get('bar')

        if search_bar(bar):
            delete_user_json()
            create_user_json(bar)


            return jsonify({"message": "Successful"})
        else:
            return jsonify({"message": "No record in database or already voted"})
    except Exception as e:
        return jsonify({"message": "An error occurred: " + str(e)})
    
@app.route('/user_image', methods=['GET'])
def user_image():
    try:

        directory_path = 'voter_image' 
        # Delete all files in the directory
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                file_path = os.path.join(root, file)
                os.remove(file_path)
        print(f'All files in {directory_path} have been deleted.')

        with open('json/table_data_1.json', 'r') as file:
            data = json.load(file)
        table_data = data.get('table')

        with open('json/user_data.json', 'r') as file:
            data = json.load(file)
        bar_data = data.get('bar')

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        
        # Execute a database query to retrieve image data and image format
        query = "SELECT image_data, image_name FROM {} WHERE ic = %s".format(table_data)
        cursor.execute(query, (bar_data,))
        result = cursor.fetchone()

        if result:
            image_data, image_name = result[0], result[1]
            image_format1 = image_name.split('.')
            if len(image_format1) > 1:
                image_format = image_format1[-1]  # Get the last part as the file extension
                print('File extension:', image_format)
            else:
                print('No file extension found')

            if image_format == 'png':
                # Save the image to the specified directory
                image_path = os.path.join('voter_image/', "image1.png")
                with open(image_path, 'wb') as image_file:
                    image_file.write(image_data)

                path= image_path
                global path1
                path1 = path
                print(path1)
                # return successful
                return jsonify(path)
            else:
                return 'Invalid image format', 400
        else:
            return 'Image not found', 404
    except Exception as e:
        return str(e)
    finally:
        cursor.close()
        connection.close()
    
def update_status_1(user_bar, table):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        query = "UPDATE {} SET status = 'yes' WHERE matric = %s".format(table)
        cursor.execute(query, (user_bar,))
        connection.commit()
        return True
    except Exception as e:
        return False
    finally:
        cursor.close()
        connection.close()


        
@app.route('/update_status', methods=['POST'])
def update_status():
    try:
        with open('json/user_data.json', 'r') as file:
            data = json.load(file)
        matric2 = data.get('bar')

        data = request.get_json()
        user_bar = data['matric']

        with open('json/table_data_1.json', 'r') as json_file:
            data = json.load(json_file)
            table = data.get('table')

        update_status_1(user_bar, table)

        
        
        response = {'success': True, 'message': 'Data inserted or updated successfully'}
        return jsonify(response), 200
    except Exception as e:
        app.logger.error(str(e))
        response = {'success': False, 'message': 'Internal server error: ' + str(e)}
        return jsonify(response), 500

@app.route('/get_voter_data', methods=['GET'])
def get_voter_data():
    try:
        #Read the table name from a JSON file
        with open('json/table_data_1.json', 'r') as json_file:
            data = json.load(json_file)
            table = data.get('table')

        response_data = {
            "success": True,
            "table": table,
        }
        
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route('/voter_detail', methods=['POST'])
def voter_detail():
    try:
        ic = request.form['icno']
        matric = request.form['matric']
        table_data = request.form['table_data']
        name = request.form['name']
        class1 = request.form['class1']
        email = request.form['email']
        status = "no"
        avatar_file = request.files['avatar']

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        print("ic"+ic)
        print("matric"+matric)
        print("table_data"+table_data)
        print("name"+name)
        print("class1"+class1)
        print("email"+email)

        query = ("INSERT INTO {} (ic, matric, name, email, class, status, image_data, image_name) "
                 "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) "
                 "ON DUPLICATE KEY UPDATE "
                 "matric = VALUES(matric), name = VALUES(name), email = VALUES(email), class = VALUES(class), "
                 "status = VALUES(status), image_data = VALUES(image_data), image_name = VALUES(image_name)").format(table_data)

        query2 = ("SELECT ic, matric, name, email, class, status FROM {} WHERE ic = %s").format(table_data)
        
        if avatar_file:
            avatar_data = avatar_file.read()
            cursor.execute(query, (str(ic), matric, name, email, class1, status, avatar_data, avatar_file.filename))
            time.sleep(0.5)
            cursor.execute(query2, (str(ic),))
            result = cursor.fetchone()
        else:
            return jsonify({'success': False, 'message': 'No file provided'}), 400

        print(result)
        connection.commit()

        response = {'success': True, 'message': 'Data inserted or updated successfully'}
        return jsonify(response), 200
    except Exception as e:
        app.logger.error(str(e))
        response = {'success': False, 'message': 'Internal server error: ' + str(e)}
        return jsonify(response), 500
    finally:
        cursor.close()
        connection.close()   

matric1 = ""

@app.route('/get_image_voter', methods=['POST'])
def get_image_voter():
    try:
        directory_path = 'voter_image'

        # Delete all files in the directory
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                file_path = os.path.join(root, file)
                os.remove(file_path)
        
        print(f'All files in {directory_path} have been deleted.')

        with open('json/table_data_1.json', 'r') as file:
            data = json.load(file)
        table_data = data.get('table')

        try:
            with open('json/user_data.json', 'r') as file:
                data = json.load(file)
                ic2 = data.get('bar')
        except:
            pass

        global matric1

        try:
            data = request.get_json()
            matric1 = data['matric']
            print(matric1)
        except:
            try:
                data = request.get_json()
                matric1 = data['matric']
                print(matric1)
            except:
                matric1 = ic2
                print(matric1)

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        query = "SELECT image_data, image_name FROM {} WHERE ic = %s".format(table_data)
        query1 = "SELECT image_data, image_name FROM {} WHERE matric = %s".format(table_data)
        
        result = None  
        try:
            cursor.execute(query, (matric1,))
            print(matric1)
            result = cursor.fetchone()
        except:
            pass  

        if result is None:
            try:
                cursor.execute(query1, (matric1,))
                print(matric1+'2')
                result = cursor.fetchone()
            except:
                pass
        if result:
            image_data, image_name = result[0], result[1]
            image_format1 = image_name.split('.')
            if len(image_format1) > 1:
                image_format = image_format1[-1]
                print('File extension:', image_format)
            else:
                print('No file extension found')

            if image_format == 'png':
                image_path = os.path.join('voter_image/', image_name)
                with open(image_path, 'wb') as image_file:
                    image_file.write(image_data)

                path = image_path
                
                return jsonify({"path": path}), 200
            else:
                return 'Invalid image format', 400
        else:
            return 'Image not found', 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_inform_voter', methods=['GET','POST'])
def get_inform_voter():
    try:
        # Read table names from JSON file
        with open('json/table_data_1.json', 'r') as json_file:
            data = json.load(json_file)
            table = data.get('table')
        
        try:
            with open('json/user_data.json', 'r') as file:
                data = json.load(file)
                matric2 = data.get('bar')
        except:
            pass

        try:
            data = request.get_json()
            global matric1
            matric1 = data['matric']
            print(matric1)
        except:
            matric1 = matric2
            print(matric1+'3')

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        query = "SELECT matric,name,class,email,status,ic FROM {} WHERE matric=%s".format(table)
        query1 = "SELECT matric,name,class,email,status,ic FROM {} WHERE ic=%s".format(table)

        result = None
        try:
            cursor.execute(query, (matric1,))
            print(matric1)
            result = cursor.fetchall()  
            print(result)
        except:
            pass 

        if result == []:
            try:
                cursor.execute(query1, (matric1,))
                print(matric1+'2')
                result = cursor.fetchall()  
            except:
                pass

        if result is None:
            try:
                cursor.execute(query1, (matric1,))
                print(matric1+'2')
                result = cursor.fetchall()  
            except:
                pass
        if result:
            row = result[0]
            response_data = {
                "success": True,
                "matric": row[0],
                "name": row[1],
                "class": row[2],
                "email": row[3],
                "status": row[4],
                "ic": row[5],
            }
        else:
            response_data = {"success": False, "message": "Candidate not found."}

        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    app.run(
        host='127.0.0.1',
        port=5021,
        debug=True
    )
