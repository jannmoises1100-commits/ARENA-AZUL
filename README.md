# ARENA AZUL · Reservas de canchas

App de reservas + panel de administración para las canchas de vóley.
Una sola app: el **link es la página del cliente**, y el **panel del admin**
vive dentro (botón "Admin", usuario `EL ADMIN`, contraseña `ArenaAzul2026`).

Sistema **independiente** de EL BICENTENARIO: código, datos y panel de
administración propios, sin nada compartido entre los dos.

Funciona en dos modos automáticamente:
- **Modo prueba**: si no configuras Supabase, guarda en el mismo celular. Sirve para probar.
- **En línea**: si conectas Supabase, las reservas, inventario y jugadores
  se guardan en la nube y se comparten entre el cliente y tú, en todos los celulares.

---

## 🚀 Publicar

### Paso 1 — Crear la base de datos (Supabase, gratis)
1. Entra a **supabase.com** y crea una cuenta (con Google es más rápido).
2. Botón **New project**. Ponle nombre `arena-azul`, elige una contraseña
   para la base y la región más cercana. Espera ~2 min a que se cree.
3. Menú izquierdo → **SQL Editor** → **New query**.
4. Abre el archivo `supabase/schema.sql` de este proyecto, copia **todo** su
   contenido, pégalo y toca **Run**. Debe decir "Success".
5. Menú izquierdo → **Project Settings** → **API**. Copia dos datos:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - **anon public** key (una clave larga)
6. Pega esos dos datos en un archivo `.env` (copia `.env.example` como base).

### Paso 2 — Publicar en Cloudflare Workers
```bash
npm install
npm run build
npx wrangler deploy
```
La primera vez te pedirá loguearte a tu cuenta de Cloudflare en el navegador.
Te va a dar un link como `https://arena-azul.TU-SUBDOMINIO.workers.dev`.

### Paso 3 — Compartir con tus clientes
- Copia el link que te dio Wrangler y **mándalo por WhatsApp / redes**.
- Ese mismo link es la página del cliente. Tú entras al mismo link y tocas
  **Admin** para tu panel.
- Cuando abran el link, verán arriba **"En línea"** (si dice "Modo prueba",
  revisa que las variables de Supabase estén bien puestas).

---

## 📲 Que se instale como app (ícono en el celular)
Ya viene listo como **PWA**. El cliente abre el link en el navegador del
celular → menú → **"Agregar a pantalla de inicio"**, y le queda como una app.

## 🎨 Logo e íconos (pendiente)
Los archivos en `public/logo.png`, `public/favicon.png`, `public/icon-192.png`,
`public/icon-512.png` y `public/apple-touch-icon.png` son un **placeholder**
generado automáticamente (círculo azul con una pelota). Reemplázalos por tu
logo real cuando lo tengas, manteniendo esos mismos nombres de archivo.

## 📍 Dirección / "Cómo llegar"
El botón "Cómo llegar" apunta por ahora a una **búsqueda genérica de Google
Maps** ("Arena Azul Jaén Perú"), no a un pin exacto. Cuando tengas la
ubicación exacta, reemplaza el link en `src/App.jsx` (busca `Cómo llegar`).

---

## 🔧 Cambiar cosas
- **Precios, separación, hora de noche**: se cambian desde el panel Admin → Precios.
- **Contraseñas del admin/trabajador**: están en `src/App.jsx`
  (busca `ADMIN_PASS` y `WORKER_PASS`). Cámbialas antes de usarlo en serio.
- **Tu QR de Yape**: por ahora usa el mismo QR y cuenta que EL BICENTENARIO
  (constante `YAPE_QR` / `YAPE_PHONE` en `src/App.jsx`). Si Arena Azul cobra
  a una cuenta distinta, cambia ahí la imagen y el número.

## 💻 Probar en tu compu (opcional)
```bash
npm install
npm run dev
```
Abre el link que aparece.
