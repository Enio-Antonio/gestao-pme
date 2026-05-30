1. Criar o ambiente virtual (opcional).<br>
    ```bash
    python -m venv .venv
    ```
    Windows:
    ```bash
    .venv/Scripts/Activate.ps1
    ```
    Linux:
    ```bash
    source .venv/bin/activate
    ```
2. Instalar as dependências.
    ```bash
    pip install -r requirements.txt
    ```

3. Criar o banco de dados. <br>
    ```bash
    python manage.py migrate
    ```

4. Rodar o servidor. <br>
    ```bash
    python manage.py runserver
    ```
