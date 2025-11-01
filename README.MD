# API del S

Este es el backend para la aplicación de gestión de pedidos, construido con Node.js, Express y Prisma.

## Tecnologías Utilizadas
* **Node.js**
* **Express**
* **Prisma** (ORM para la base de datos)
* **PostgreSQL** (manejado vía Supabase)

---

## Cómo Empezar

Sigue estos pasos para levantar el entorno de desarrollo local.

### 1. Prerrequisitos
* Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
* Tener una cuenta de [Supabase](https://supabase.com) (o la base de datos que estés usando).

### 2. Instalación
1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/TU_USUARIO/restaurante-backend.git](https://github.com/edwinzubieta/restaurantsoft.git)
    ```
2.  Entra en la carpeta del proyecto:
    ```bash
    cd restaurante-backend
    ```
3.  Instala las dependencias:
    ```bash
    npm install
    ```

### 3. Configuración del Entorno
1.  Este proyecto usa un archivo `.env` para las variables de entorno. Crea una copia del archivo de ejemplo:
    ```bash
    cp .env.example .env
    ```
    *(Si no tienes .env.example, créalo y añade `DATABASE_URL=""`)*

2.  Abre el archivo `.env` y añade tu URL de conexión de la base de datos:
    ```
    DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@db.xyz.supabase.co..."
    ```

### 4. Base de Datos
Ejecuta la migración de Prisma para crear todas las tablas en tu base de datos:
```bash
npx prisma migrate dev
 ```

### 5. ejecutar el servidor
1. Se ejecuta el servidor con el comando node server.js -> el servidor estara corriendo en el localhost en el puerto 4000
