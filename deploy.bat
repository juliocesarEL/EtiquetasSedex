@echo off
cd /d "%~dp0"

echo Gerando build de producao do frontend...
cd frontend
call npm run build
cd ..

echo.
echo Reiniciando o servico do Windows (precisa rodar este arquivo como Administrador)...
"%LOCALAPPDATA%\Microsoft\WinGet\Packages\NSSM.NSSM_Microsoft.Winget.Source_8wekyb3d8bbwe\nssm-2.24-101-g897c7ad\win64\nssm.exe" restart SedexEtiquetas

echo.
echo Pronto. Logs em logs\service-out.log e logs\service-error.log
echo Status do servico: services.msc (procure "BWR - Etiquetas SEDEX")
