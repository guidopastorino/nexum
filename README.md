# Nexum

**Nexum** es una red social donde los usuarios pueden publicar, repostear, dar likes, comentar, y enviar mensajes privados, con funcionalidades similares a redes como Twitter o Reddit (por las opiniones o comunidades). La aplicación también incluye feeds personalizados, notificaciones, y un sistema de 'moments' (historias que desaparecen en 24 horas). 

## Características

- **Publicaciones**: Realiza posts con texto e imágenes.
- **Reposteos y Quotes**: Interactúa con otros posts a través de reposts y citas.
- **Mensajes privados**: Conéctate mediante mensajes directos entre usuarios.
- **Notificaciones**: Recibe alertas de interacciones importantes.
- **Feed personalizado**: Un feed que se adapta a los intereses del usuario.
- **Moments**: Publica historias con duración de 24 horas.

## Tecnologías

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Next.js (API), MongoDB, NextAuth
- **Autenticación**: NextAuth con opciones de autenticación social y por email
- **Persistencia de datos**: MongoDB para almacenamiento de usuarios, posts, y relaciones.

## Instalación

### Prerrequisitos

- Node.js y npm/yarn instalados en tu sistema.
- MongoDB configurado y en ejecución.
- Archivo `.env.local` con las variables de entorno necesarias (detalladas abajo).

### Variables de entorno

Asegúrate de crear un archivo `.env.local` en la raíz del proyecto, con las siguientes variables:

```plaintext
MONGODB_URI=mongodb://localhost:27017/nexum
NEXTAUTH_SECRET=<your_nextauth_secret>
NEXTAUTH_URL=http://localhost:3000
```