import mysql.connector
from flask import Flask, request, jsonify,send_file
from flask_cors import CORS
import os
import json
from PIL import Image
import time
import io

app = Flask(__name__)

with open('json/table_database.json', 'r') as json_file:
            data = json.load(json_file)
            host1 = data.get('host')
            user1 = data.get('user')
            passwd1 = data.get('passwd')
            database = data.get('database')

CORS(app)

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

@app.route('/candidate_detail', methods=['POST'])
def candidate_detail():
    try:
        data = request.get_json()
        id = data['id']
        table_data = data['table_data']
        name = data['name']
        class1 = data['class1']
        skills = data['skills']
        age = data['age']
        bio = data['bio']

        id2=int(id)+1

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        query=("INSERT INTO {} (id,name,class1,skills,age,bio)"
               "VALUES (%s,%s,%s,%s,%s,%s)"
               "ON DUPLICATE KEY UPDATE"
               " id = VALUES(id),name = VALUES(name),class1 = VALUES(class1),skills = VALUES(skills),age = VALUES(age),bio = VALUES(bio)")
        
        cursor.execute(query.format(table_data), (str(id2),name,class1,skills,age,bio))
        
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


@app.route('/upload_avatar', methods=['POST'])
def upload_avatar():
    try:
        with open('json/table_data.json', 'r') as file:
            data = json.load(file)
        table_data = data.get('table')
        #Get the uploaded file
        avatar_file = request.files['avatar']

        # Get the ID from the form
        candidate_id = request.form['id']
        candidate_id2 =int(candidate_id)+1

        if avatar_file:
            # Read data from the file
            avatar_data = avatar_file.read()

            # Insert file data into the database
            connection = mysql.connector.connect(**db_config)
            cursor = connection.cursor()

            # Use an INSERT statement to insert file data into the database and associate it with a specified ID
            query = ("INSERT INTO {} (id, image_data, image_name)" 
                     "VALUES (%s, %s, %s)"
                     "ON DUPLICATE KEY UPDATE "
                     "id = VALUES (id), image_data = VALUES(image_data), image_name = VALUES(image_name),"
                     "name = VALUES(name), class1 = VALUES(class1), skills = VALUES(skills), age = VALUES(age), bio = VALUES(bio)").format(table_data)
            cursor.execute(query, (candidate_id2, avatar_data, avatar_file.filename))
            
            connection.commit()

            cursor.close()
            connection.close()

            return jsonify({'message': 'File uploaded successfully'}), 200
        else:
            return jsonify({'message': 'No file provided'}), 400
    except Exception as e:
        return jsonify({'message': 'Error uploading file', 'error': str(e)})


@app.route('/get_image/<int:candidateId>')
def get_image(candidateId):
    try:
        directory_path = 'image1' 
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

        image_id2 = int(candidateId + 1)
        # Execute a database query to retrieve image data and image format
        query = "SELECT image_data, image_name FROM {} WHERE id = %s".format(table_data)
        cursor.execute(query, (image_id2,))
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
                image_path = os.path.join('image1/', image_name)
                with open(image_path, 'wb') as image_file:
                    image_file.write(image_data)

                path= image_path
                # return successful
                return jsonify(path)
            else:
                return 'Invalid image format', 400
        else:
            return 'Image not found', 404
    except Exception as e:
        return str(e)
    
    
@app.route('/get_inform_candidate/<int:candidateId>', methods=['GET'])
def get_inform_candidate(candidateId):
    id = int(candidateId + 1)
    try:
        # Read table names from JSON file
        with open('json/table_data.json', 'r') as json_file:
            data = json.load(json_file)
            table = data.get('table')

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()


        query = "SELECT name,class1,skills,age,bio FROM {} WHERE id=%s".format(table)
        cursor.execute(query,(id,))
        result = cursor.fetchone()
        if result:
            # Construct response data
            response_data = {
                "success": True,
                "name": result[0],
                "class1": result[1],
                "skills": result[2],
                "age": result[3],
                "bio": result[4],
            }
        else:
            response_data = {"success": False, "message": "Candidate not found."}
                
        
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        connection.close()
    

@app.route('/time_detail', methods=['POST'])
def time_detail():
    try:
        data=request.get_json()
        id=data['id']
        start_time=data['start_time']
        end_time=data['end_time']
        table_data = data['table_data']

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        query = (
            "INSERT INTO {} (id, start_time, end_time) "
            "VALUES (%s, %s, %s) "
            "ON DUPLICATE KEY UPDATE "
            "id = VALUES(id), start_time = VALUES(start_time), end_time = VALUES(end_time)"
        ).format(table_data)
        
        cursor.execute(query,(str(id),start_time,end_time))

        connection.commit()
        cursor.close()
        connection.close()
        response = {'success': True, 'message': 'Data inserted or updated successfully'}
        return jsonify(response), 200
    except Exception as e:
        app.logger.error(str(e))
        response = {'success': False, 'message': 'Internal server error'}
        return jsonify(response), 500
    

@app.route('/favicon.ico')
def favicon():
    return '', 404

@app.route('/position_count', methods=['POST'])
def position_count():
    try:
        
        with open('json/table_data.json', 'r') as json_file:
            data = json.load(json_file)
            table = data.get('table')

        position=position_1(table)
        candidate=candidate_1(table)


        response_data = {
            "success": True,
            "position": position,
            "candidate": candidate
        }
        
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)})
        
@app.route('/image_file', methods=['POST'])
def image_file():
    try:
        data = request.get_json()
        folder_path = data['file']
        max_file_size = 5 * 1024 * 1024
        png_image_list = []
        
        # Get a list of filenames in alphabetical order
        filenames = sorted(os.listdir(folder_path))
        for filename in filenames:
            file_path = os.path.join(folder_path, filename)
            if os.path.isfile(file_path) and is_png(filename):
                # Check file size
                if os.path.getsize(file_path) <= max_file_size:
                    try:
                        with open(file_path, 'rb') as image_file:
                            img_data = image_file.read()
                            png_image_list.append(img_data)
                    except FileNotFoundError as fe:
                        print(f"File not found: {file_path}")
                    except Exception as e:
                        print(f"Error reading {filename}: {e}")
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        total_image = len(png_image_list)
        for i in range(total_image):
            with open('json/table_data.json', 'r') as json_file:
                data = json.load(json_file)
                table = data.get('table')
            id = i + 1
            query = f"UPDATE {table} SET image_data2 = %s WHERE id = %s"
            image_data = png_image_list[i]
            try:
                cursor.execute(query, (image_data, str(id)))
            except mysql.connector.Error as db_error:
                print(f"Database error: {db_error}")
            connection.commit()
        return jsonify({'success': True, 'message': 'Data image inserted or updated successfully'})
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'success': False, 'message': f'Failed to insert or update data image: {e}'})
    finally:
        cursor.close()
        connection.close()




def is_png(filename):
    return filename.lower().endswith('.png')


def position_1(table):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        query = "SELECT position FROM {} WHERE id = 1;".format(table)
        cursor.execute(query)
        result = cursor.fetchone()
        return result[0]
    except Exception:
        return None
    finally:
        cursor.close()
        connection.close()
def candidate_1(table):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        query = "SELECT candidate_no FROM {} WHERE id = 1;".format(table)
        cursor.execute(query)
        result = cursor.fetchone()
        return result[0]
    except Exception:
        return None
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    app.run(
        host='127.0.0.1',
        port=5006,
        debug=False
    )