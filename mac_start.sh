#!/bin/bash

# 进入虚拟环境
source venv/bin/activate

# 启动各个 Flask 应用程序
nohup gunicorn -w 4 -b 127.0.0.1:5003 python.administration_login:app > server_log/administration_login.log 2>&1 &
nohup gunicorn -w 4 -b 127.0.0.1:5004 python.administration_reset_pass:app > server_log/administration_reset_pass.log 2>&1 &
nohup gunicorn -w 4 -b 127.0.0.1:5005 python.administration_setting_1:app > server_log/administration_setting_1.log 2>&1 &
nohup gunicorn -w 4 -b 127.0.0.1:5006 python.administration_setting_2:app > server_log/administration_setting_2.log 2>&1 &
nohup gunicorn -w 4 -b 127.0.0.1:5021 python.user_data_1:app > server_log/user_data_1.log 2>&1 &
nohup gunicorn -w 4 -b 127.0.0.1:5056 python.voting:app > server_log/voting.log 2>&1 &
nohup gunicorn -w 4 -b 127.0.0.1:5007 python.database_table:app > server_log/database_table.log 2>&1 &

# 退出虚拟环境
deactivate