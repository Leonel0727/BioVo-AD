@echo off

rem Navigate to your project directory
cd \path\to\your\project

rem Activate the virtual environment
call .\venv\Scripts\activate

rem Start Gunicorn for each Flask application with specified ports and log files
start /B gunicorn -w 4 -b 127.0.0.1:5003 --error-logfile server_log/administration_login_error.log python\administration_login:app
start /B gunicorn -w 4 -b 127.0.0.1:5004 --error-logfile server_log/administration_reset_pass_error.log python\administration_reset_pass:app
start /B gunicorn -w 4 -b 127.0.0.1:5005 --error-logfile server_log/administration_setting_1_error.log python\administration_setting_1:app
start /B gunicorn -w 4 -b 127.0.0.1:5006 --error-logfile server_log/administration_setting_2_error.log python\administration_setting_2:app
start /B gunicorn -w 4 -b 127.0.0.1:5007 --error-logfile server_log/database_table_error.log python\database_table:app
start /B gunicorn -w 4 -b 127.0.0.1:5021 --error-logfile server_log/user_data_1_error.log python\user_data_1:app
start /B gunicorn -w 4 -b 127.0.0.1:5056 --error-logfile server_log/voting_error.log python\voting:app

rem Deactivate the virtual environment
call deactivate