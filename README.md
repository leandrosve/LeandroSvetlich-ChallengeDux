# Challenge Dux - Leandro Svetlich

🌐 **Aplicación desplegada**: [leandrosve-challenge-dux.vercel.app](https://leandrosve-challenge-dux.vercel.app/)

---

## 🛠️ Tecnologías que utilicé

- **Next.js** – Versión 14.2.30 - Con Server Components y App Router.
- **PrimeReact + PrimeFlex** – Para la interfaz y layout responsivo.
- **React Hook Form + Zod** – Para validación del formulario.
- **Context API** – Para gestionar el estado local de los usuarios.
- **PostCSS** – Para optimizar y minificar los estilos.
- **Vitest** – Para realizar tests unitarios.

---

## 🧩 Decisiones de diseño y arquitectura



### Renderizado & datos

- Usé **Server Components** en el listado principal de usuarios para asegurar que el contenido se cargue completamente desde el servidor en el primer render. Este componente establece el estado inicial del context para que luego pueda ser modificado Client Side.
- Centralicé el estado de los usuarios utilizando **Context API**, lo que me permitió evitar prop drilling y simplificar el flujo de datos.
- Decidí no incorporar **Redux** ni **TanStack Query**, ya que no estaban indicados en el enunciado y preferí mantener la complejidad al mínimo.

### Filtros & navegación

- Implementé el manejo de **filtros y modales** a través de **query params**, para permitir navegación directa, persistencia del estado y una experiencia coherente.
- Escribí **tests unitarios** centrados en la lógica de filtros y el parsing de parámetros de URL.

### API & Server actions

- Usé **Route Handlers** (`/api/users`) para manejar las operaciones `create`, `update` y `delete`.
- Desde el servidor ejecuto `revalidateTag()` luego de cada operación para invalidar la caché correctamente y reflejar los cambios sin recarga manual.

### Validaciones

- Agregué una **verificación asincrónica del ID de usuario** directamente en el input para prevenir duplicados.
- Respeté la restricción del **sector=4000**, aunque no le asigné un nombre porque no se especificaba a qué sector correspondía.

### Diseño visual

- Seguí en líneas generales el diseño proporcionado en Figma, respetando la estructura, los colores y la disposición principal. Sin embargo, me tomé la libertad de hacer algunos ajustes visuales menores ya que interpreté que el Figma funcionaba como una guía orientativa y no como una maqueta cerrada. 

### Estructura del proyecto

- Organicé el código siguiendo una estructura basada en **features**, que me permitió mantener el foco en la funcionalidad y la escalabilidad, en lugar de seguir una separación estricta por atomic design (atoms/, molecules/, etc).

## ⚙️ Cómo correr el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/leandrosve/LeandroSvetlich-ChallengeDux.git
cd LeandroSvetlich-ChallengeDux/client
```

### 2. Instalar dependencias
```bash
npm install
```
### 3. Levantar en modo desarrollo
```bash
npm run dev
```
### 4. Correr en modo producción (opcional)
```bash
npm run build
npm start
```