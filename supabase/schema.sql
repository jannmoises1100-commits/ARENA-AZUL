-- ============================================================
--  ARENA AZUL · Base de datos (Supabase)
--  Pega TODO esto en Supabase > SQL Editor > New query > Run
-- ============================================================

-- Tabla única donde se guarda todo el estado del sistema
-- (reservas, productos/inventario, jugadores y precios).
create table if not exists public.app_state (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

-- Activar seguridad a nivel de fila
alter table public.app_state enable row level security;

-- Para el MVP (empezando): permitir leer y escribir.
-- ⚠️  Esto deja la tabla abierta. Sirve para arrancar y probar rápido.
--     Cuando el negocio crezca, cambia esto por reglas con login real
--     (auth de Supabase) para que solo el admin escriba precios/inventario.
drop policy if exists "acceso_abierto_mvp" on public.app_state;
create policy "acceso_abierto_mvp"
  on public.app_state
  for all
  using (true)
  with check (true);

-- (Opcional) valores iniciales de precios
insert into public.app_state (key, value)
values ('prices', '{"voley":{"dia":30,"noche":40},"nightStart":18,"discount":5,"deposit":10}')
on conflict (key) do nothing;
