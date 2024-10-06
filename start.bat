@echo off


timeout /t 5 /nobreak
start cmd /k "call %~dp0\venv\Scripts\activate && python %~dp0\python\administration_login.py"
timeout /t 5 /nobreak
timeout /t 3 /nobreak
start cmd /k "call %~dp0\venv\Scripts\activate && python %~dp0\python\administration_reset_pass.py"
timeout /t 5 /nobreak
start cmd /k "call %~dp0\venv\Scripts\activate && python %~dp0\python\administration_setting_1.py"
timeout /t 5 /nobreak
start cmd /k "call %~dp0\venv\Scripts\activate && python %~dp0\python\administration_setting_2.py"
timeout /t 5 /nobreak
start cmd /k "call %~dp0\venv\Scripts\activate && python %~dp0\python\database_table.py"
timeout /t 5 /nobreak
start cmd /k "call %~dp0\venv\Scripts\activate && python %~dp0\python\voting.py"
timeout /t 5 /nobreak
start cmd /k "call %~dp0\venv\Scripts\activate && python %~dp0\python\user_data_1.py"
