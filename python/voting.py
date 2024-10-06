import mysql.connector
from flask import Flask, request, jsonify,make_response, request
from flask_cors import CORS
import os
import time
import json
import base64
import time
import cv2
import dlib
import numpy as np

from filelock import FileLock
import json
try:
    import fcntl  # Unix-specific import
except ImportError:
    fcntl = None

try:
    import msvcrt  # Windows-specific import
except ImportError:
    msvcrt = None

app = Flask(__name__)

data_write = {}

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

json_file_path = "json/temporary_file.json"

@app.route('/file_json', methods=['POST'])
def file_json():
    delete_temporary(json_file_path)
    result = create_temporary(json_file_path)

    if result:
        data_write["c1"] = "0"

        with open(json_file_path, "w") as json_file:
            json.dump(data_write, json_file)
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Failed to create temporary file"})

@app.route('/update_file', methods=['POST'])
def update_file():
    try:
        data = request.get_json()
        id = data.get('page', 0) 
        position = data.get('position', "")

        data_write["c"+str(id)] = str(position)

        with open(json_file_path, "w") as json_file:
            json.dump(data_write, json_file)

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/get_image/<int:candidateId>', methods=['POST'])
def get_image(candidateId):
    try:
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
                image_path = os.path.join('candidate_image', f'{candidateId}.png')
                with open(image_path, 'wb') as image_file:
                    image_file.write(image_data)

                response_data = {"success": True, "message": "Image saved successfully"}
                return jsonify(response_data)
            else:
                response_data = {"success": False, "message": "Invalid image format"}
                return jsonify(response_data)
        else:
            response_data = {"success": False, "message": "Image not found"}
            return jsonify(response_data)
    except Exception as e:
        response_data = {"success": False, "message": str(e)}
        return jsonify(response_data)
    
@app.route('/get_position/<int:positionid>', methods=['POST'])
def get_position(positionid):
    try:
        with open('json/table_data.json', 'r') as file:
            data = json.load(file)
        table_data = data.get('table')

        if not table_data:
            return jsonify({'success': False, 'message': 'Table not found'}), 404

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        query = "SELECT position FROM {} WHERE id = %s".format(table_data)
        cursor.execute(query, (positionid,))
        result = cursor.fetchone()

        if result is None:
            return jsonify({'success': False, 'message': 'Position not found'}), 404

        response = {'success': True, 'position': result[0]}
        return jsonify(response), 200
    except Exception as e:
        response = {'success': False, 'message': str(e)}
        return jsonify(response), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/delete_temporary_file', methods=['POST'])
def delete_temporary_file():
    json_file_path = "json/temporary_file.json"
    json_file_path2 = "json/user_data.json"
    file_path = "temporary_file.json.lock"
    # Use the os module to delete a file
    try:
        if os.path.exists(json_file_path):
            os.remove(json_file_path)
            if os.path.exists(json_file_path2):
                os.remove(json_file_path2)
                if os.path.exists(file_path):
                    os.unlink(file_path)
                else:
                    os.remove(file_path)
                    print("cannot delete "+file_path)
                    pass
            else:
                pass
            return jsonify({"success": True})
        else:
            return jsonify({"success": True})
    except: 
        pass
        return jsonify({"success": True})
    
    
def read_file_with_lock(file_path):
    if not os.path.exists(file_path):
        return None

    data = None

    if fcntl:
        # Unix-specific file locking
        with open(file_path, 'r') as file:
            try:
                fcntl.flock(file, fcntl.LOCK_SH | fcntl.LOCK_NB)
                data = json.load(file)
            except BlockingIOError:
                return None
    elif msvcrt:
        # Windows-specific file locking
        lock_file = open(file_path, 'r')
        try:
            msvcrt.locking(lock_file.fileno(), msvcrt.LK_RLCK, 0)
            with open(file_path, 'r') as file:
                data = json.load(file)
        finally:
            msvcrt.locking(lock_file.fileno(), msvcrt.LK_UNLCK, 0)
            lock_file.close()
    else:
        # No file locking support available
        with open(file_path, 'r') as file:
            data = json.load(file)

    return data

@app.route('/read_voting_status', methods=['POST'])
def read_voting_status():
    try:
        data = request.get_json()
        page = data.get('i', "")
        page2 = page-1
        file_path = 'json/temporary_file.json'

        max_retries = 3
        for _ in range(max_retries):
            file_data = read_file_with_lock(file_path)
            if file_data is not None:
                break
            time.sleep(1) 

        if file_data is None:
            response_data = {"success": False, "message": "Unable to read file."}
            return jsonify(response_data)

        key = 'c' + str(page)
        value1 = []

        for i in range(page2):
            try:
                key1 = 'c' + str(i + 1)
                value2 = int(file_data.get(key1, 0))
                value1.append(value2)
            except:
                pass

        if not value1:
            value3 = '[0]'
        else:
            value3 = value1

        if key in file_data:
            value = int(file_data[key])
        else:
            value=0
            
        response_data = {"success": True, "num": str(value), "num1": value3}
        return jsonify(response_data)
    except FileNotFoundError:
        response_data = {"success": False, "message": "File not found."}
        return jsonify(response_data)
    except Exception as e:
        response_data = {"success": False, "message": str(e)}
        return jsonify(response_data)
    
@app.route('/read_voting_history', methods=['POST'])
def read_voting_history():
    try:
        data = request.get_json()
        page = data.get('i', "")
        print(str(page))

        value = []
        with open('json/temporary_file.json', 'r') as file:
            data = json.load(file)
        element_count = len(data)
        for i in range(element_count):
            key = 'c' + str(i + 1)
            value.append(key)
        print("value:" + str(value))

        response_data = {"success": True, "message": value}
        return jsonify(response_data)
    except Exception as e: 
        response_data = {"success": False, "message": "error"}
        return jsonify(response_data)

@app.route('/upload_voting_data', methods=['POST'])
def upload_voting_data():
    try:
        file_path = 'json/temporary_file.json'
        max_retries = 3
        for _ in range(max_retries):
            with FileLock(file_path + ".lock"):
                with open(file_path, "r") as json_file:
                    file_data = json.load(json_file)
                if file_data is not None:
                    break
            time.sleep(1)

        if file_data is None:
            response_data = {'success': False}
            return jsonify(response_data)

        

        with open('json/table_data_2.json', 'r') as file:
            data2 = json.load(file)
        table_data = data2.get('table')

        data_length = len(file_data)

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        query = "SELECT COALESCE(MAX(id), 0) FROM {}".format(table_data)
        cursor.execute(query)
        lastest_id = cursor.fetchone()[0]


        new_id = lastest_id+1

        
        for i in range(data_length):
            try:
                no = i + 1
                key = 'c' + str(no)
                value = int(file_data.get(key, 0))
                query2 = ("INSERT INTO {} (id, {}) "
                          "VALUES (%s, %s) "
                          "ON DUPLICATE KEY UPDATE "
                          "id = VALUES(id), {} = VALUES({})").format(table_data, key, key, key)
                value1 = value+1
                cursor.execute(query2, (str(new_id), str(value1)))
                
            except Exception as e:
                print("cannot upload data " + str(i + 1) + " where data_length: " + str(data_length))
                pass

        connection.commit()
        cursor.close()
        connection.close()

        for i in range(data_length):
            try:
                data_write["c"+str(i+1)] = "0"
                with open(file_path, "w") as json_file:
                    json.dump(data_write, json_file)
            except:
                print("a")
                pass
        return jsonify({'success': True}), 200
    except Exception as e:
        print("An exception occurred: " + str(e))
        return jsonify({'success': False, 'error': str(e)})
    
@app.route('/read_time', methods=['POST'])
def read_time():
    try:
        with open('json/time.json', 'r') as json_file:
            data = json.load(json_file)
            start = data.get('start_time')
            end = data.get('end_time')

        # Convert to string if not already strings
        start_str = str(start) if not isinstance(start, str) else start
        end_str = str(end) if not isinstance(end, str) else end

        response_data = {
            "success": True,
            "start": start_str,
            "end": end_str
        }

        print("data:", response_data)
        return jsonify(response_data)
    except Exception as e:
        print("Error:", str(e))
        data = {
            "success": False
        }
        return jsonify(data)

@app.route('/bhg_image', methods=['POST'])
def bhg_image():
    try:
        # 从POST请求中获取图像数据
        image_data_url = request.form.get('imageDataURL')

        # 将base64编码的图像数据解码
        image_data = base64.b64decode(image_data_url.split(',')[1])

        # 指定保存图像的目录
        save_path = 'voter_image'
        if not os.path.exists(save_path):
            os.makedirs(save_path)

        # 生成一个唯一的文件
        try:
            image_filename = os.path.join(save_path, 'image2.png')
        except Exception as e:
            print(f"生成文件名时出错：{e}")
            return jsonify({'error': '文件名生成失败'}), 500

        # 保存图像到服务器
        with open(image_filename, 'wb') as image_file:
            image_file.write(image_data)

        try:
            # 加载 Dlib 的人脸检测器和预训练的人脸识别模型
            detector = dlib.get_frontal_face_detector()
            sp = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
            facerec = dlib.face_recognition_model_v1("dlib_face_recognition_resnet_model_v1.dat")

            # 加载两张照片（使用动态生成的文件名）
            image1 = cv2.imread("voter_image/image1.png")
            image2 = cv2.imread("voter_image/image2.png")

            # 转换为灰度图像
            gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
            gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)

            # 人脸检测
            faces1 = detector(gray1)
            faces2 = detector(gray2)

            # 提取人脸特征
            face_descriptors1 = []
            face_descriptors2 = []

            for face in faces1:
                shape = sp(gray1, face)
                face_descriptor = facerec.compute_face_descriptor(image1, shape)
                face_descriptors1.append(np.array(face_descriptor))

            for face in faces2:
                shape = sp(gray2, face)
                face_descriptor = facerec.compute_face_descriptor(image2, shape)
                face_descriptors2.append(np.array(face_descriptor))

            # 计算相似度
            similarity = 0  # 初始化相似度
            if len(face_descriptors1) > 0 and len(face_descriptors2) > 0:
                distance = np.linalg.norm(face_descriptors1[0] - face_descriptors2[0])
                similarity = 1 / (1 + distance)
                sim = round(similarity * 100, 4)
                print(f"相似度：{similarity}")
                response = {'success': True, 'message':  str(sim)}
                return jsonify(response), 200
            else:
                response = {'success': False, 'message':"0"}
                print("未检测到人脸")
                return jsonify(response), 200
        except Exception as e:
            print(f"处理照片时出错：{e}")
            response = {'success': True, 'message':  str(sim), 'error': 'Encountered an error while processing photos'}
            return jsonify(response), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def create_temporary(jfile):
    try:
        data_write = {}
        # Write a valid JSON string to the file
        with open(jfile, "w") as json_file:
            json.dump(data_write, json_file)
        return True
    except Exception as e:
        return False

def delete_temporary(jfile):
    if os.path.exists(jfile):
        os.remove(jfile)
        return True
    else:
        return True
    

if __name__ == "__main__":
    app.run(
        host='127.0.0.1',
        port=5056,
        debug=True
    )