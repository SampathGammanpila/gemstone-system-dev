-- Insert migration version
INSERT INTO schema_migrations (version) VALUES ('002_user_roles');

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Apply updated_at trigger to roles table
CREATE TRIGGER set_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_updated_at();

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Apply updated_at trigger to permissions table
CREATE TRIGGER set_permissions_updated_at
BEFORE UPDATE ON permissions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_updated_at();

-- Create role_permissions join table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

-- Create index for faster lookups
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'System administrator with full access'),
  ('user', 'Regular user with basic access'),
  ('dealer', 'Gemstone dealer who can sell items'),
  ('cutter', 'Gemstone cutter who can provide cutting services'),
  ('appraiser', 'Gemstone appraiser who can provide valuation services')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
  ('user:read', 'Can view user information'),
  ('user:write', 'Can create and update user information'),
  ('user:delete', 'Can delete users'),
  ('gemstone:read', 'Can view gemstone information'),
  ('gemstone:write', 'Can create and update gemstone information'),
  ('gemstone:delete', 'Can delete gemstones'),
  ('rough_stone:read', 'Can view rough stone information'),
  ('rough_stone:write', 'Can create and update rough stone information'),
  ('rough_stone:delete', 'Can delete rough stones'),
  ('jewelry:read', 'Can view jewelry information'),
  ('jewelry:write', 'Can create and update jewelry information'),
  ('jewelry:delete', 'Can delete jewelry'),
  ('marketplace:read', 'Can view marketplace listings'),
  ('marketplace:write', 'Can create and update marketplace listings'),
  ('marketplace:delete', 'Can delete marketplace listings'),
  ('certificate:read', 'Can view certificates'),
  ('certificate:write', 'Can create and update certificates'),
  ('certificate:delete', 'Can delete certificates'),
  ('admin:access', 'Can access admin panel'),
  ('professional:verified', 'Professional with verified status')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin';

-- Assign basic permissions to user role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id, 
  p.id
FROM 
  roles r, 
  permissions p
WHERE 
  r.name = 'user' AND 
  p.name IN (
    'user:read', 
    'gemstone:read', 
    'rough_stone:read', 
    'jewelry:read', 
    'marketplace:read', 
    'certificate:read'
  );

-- Assign permissions to dealer role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id, 
  p.id
FROM 
  roles r, 
  permissions p
WHERE 
  r.name = 'dealer' AND 
  p.name IN (
    'user:read', 
    'gemstone:read', 
    'gemstone:write', 
    'rough_stone:read', 
    'rough_stone:write', 
    'jewelry:read', 
    'jewelry:write', 
    'marketplace:read', 
    'marketplace:write', 
    'certificate:read'
  );

-- Assign permissions to cutter role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id, 
  p.id
FROM 
  roles r, 
  permissions p
WHERE 
  r.name = 'cutter' AND 
  p.name IN (
    'user:read', 
    'gemstone:read', 
    'gemstone:write', 
    'rough_stone:read', 
    'rough_stone:write', 
    'marketplace:read', 
    'marketplace:write', 
    'certificate:read'
  );

-- Assign permissions to appraiser role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id, 
  p.id
FROM 
  roles r, 
  permissions p
WHERE 
  r.name = 'appraiser' AND 
  p.name IN (
    'user:read', 
    'gemstone:read', 
    'rough_stone:read', 
    'jewelry:read', 
    'certificate:read', 
    'certificate:write'
  );