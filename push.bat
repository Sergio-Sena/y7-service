@echo off
echo ======================================================
echo    Y7 SERVICE - SINCRONIZACAO COM O GITHUB
echo    Repositorio: mouratoimportacao-cloud/y7-service
echo ======================================================
echo.
echo Adicionando alteracoes...
git add .
set /p commit_msg="Digite a mensagem do commit (ou aperte Enter para padrao): "
if "%commit_msg%"=="" set commit_msg=Atualizacao Y7 Service
git commit -m "%commit_msg%"
echo.
echo Enviando para o GitHub (main)...
git push origin main
echo.
echo ======================================================
echo    Envio concluido com sucesso!
echo ======================================================
pause
