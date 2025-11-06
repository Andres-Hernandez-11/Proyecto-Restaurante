# Documentación para instalación del proyecto

explica cómo conectarse al backend y frontend para correr la aplicación de React.

## Tecnologías Utilizadas para el backend
* **Node.js**
* **Express**
* **Prisma** (ORM para la base de datos)
* **PostgreSQL** (manejado vía Supabase)

## Tecnologías Utilizadas para el frontend
* **React**
* **Vite** (Herramienta de frontend)
* **Axios** (Para peticiones a la API)

---

## Cómo Empezar instalación del BACKEND

Sigue estos pasos para levantar el entorno de desarrollo local.

### 1. Prerrequisitos
* Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
* Tener una cuenta de [Supabase](https://supabase.com) (o la base de datos que estés usando).

### 2. Instalación
1.  Clona el repositorio:
    ```bash
    git clone https://github.com/Andres-Hernandez-11/Proyecto-Restaurante.git
    ```
2.  Entra en la carpeta del proyecto:
    ```bash
    cd Proyecto-Restaurante
    cd backend
    ```
3.  Instala las dependencias dentro de la carpeta de backend:
    ```bash
    npm install
    ```

### 3. Configuración del Entorno
1.  Este proyecto usa un archivo `.env` para las variables de entorno. Crea una copia del archivo de ejemplo:
    ```bash
    # Connect to Supabase via connection pooling
    DATABASE_URL="postgresql://postgres.egozlcxznvfehdejjkab:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true"
    ```
    *(Si no tienes .env, créalo y añade `DATABASE_URL=""`)*

    *(Si genera un error al no encontrar la variable 'DATABASE_URL' se debe crear la variable en terminal y ejecutar después el paso 4)*
    ```bash
    $env:DATABASE_URL="postgresql://postgres.egozlcxznvfehdejjkab:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true"
    ```


### 4. Base de Datos
Ejecuta la migración de Prisma para crear todas las tablas en tu base de datos:
```bash
npx prisma migrate dev --name init
 ```

### 5. Instalar cors
```bash
npm install cors
 ```


### 6. Ejecutar el servidor
1. Se ejecuta el servidor con el comando node server.js -> el servidor estara corriendo en el localhost en el puerto 4000


---

## Cómo Empezar instalación del FRONTEND

Sigue estos pasos para levantar el entorno de desarrollo local.

### 1. Prerrequisitos
* Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
* **Importante:** El servidor del backend debe estar corriendo en `http://localhost:4000`.

### 2. Instalación

1.  Entra en la carpeta del proyecto del FRONTEND:
    ```bash
    cd frontend
    ```
3.  Instala las dependencias:
    ```bash
    npm install

### 3. Instalar axios
Inicia el servidor de desarrollo de Vite:
```bash
npm install axios
```

### 4. Ejecutar la Aplicación
Inicia el servidor de desarrollo de Vite:
```bash
npm run dev 
```

### 5. puerto de ejecucion
1. Se ejecuta la aplicacionen el puerto 5173 o en el que indique la terminal