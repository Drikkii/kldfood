-- Минимальная схема для PostgreSQL (применить после поднятия БД на Beget)

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  rkeeper_object_id INT,
  pickup_enabled BOOLEAN NOT NULL DEFAULT true,
  delivery_enabled BOOLEAN NOT NULL DEFAULT true,
  work_hours TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES locations(id),
  fulfillment TEXT NOT NULL CHECK (fulfillment IN ('delivery', 'pickup')),
  status TEXT NOT NULL,
  amount_rub NUMERIC(12, 2) NOT NULL,
  cart_input_json JSONB NOT NULL,
  validated_lines_json JSONB,
  customer_json JSONB NOT NULL DEFAULT '{}',
  delivery_address_json JSONB,
  comment TEXT,
  scheduled_at TIMESTAMPTZ,
  yookassa_payment_id TEXT UNIQUE,
  payment_amount_rub NUMERIC(12, 2),
  paid_at TIMESTAMPTZ,
  rkeeper_order_num TEXT UNIQUE,
  rkeeper_task_guid TEXT,
  rkeeper_submitted_at TIMESTAMPTZ,
  rkeeper_accepted_at TIMESTAMPTZ,
  validation_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  yookassa_payment_id TEXT PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id),
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
