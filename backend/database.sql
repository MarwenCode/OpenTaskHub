-- Enable UUIDs

-- =================================================================
-- INSTRUCTION : Exécutez tout ce script pour corriger l'erreur 500 (Mise à jour du schéma).
-- =================================================================

-- =================================================================
-- NETTOYAGE (OPTIONNEL - DÉCOMMENTER POUR RÉINITIALISER LA DB)
-- Attention : Cela supprimera toutes les données existantes !
-- Utile si votre schéma local/prod n'est pas synchronisé avec ce script.
-- =================================================================
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS workspace_members CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =================================================================
-- EXTENSION: pgcrypto
-- Active l'extension pour la génération d'UUIDs.
-- =================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =================================================================
-- TABLE: users
-- Stocke les informations des comptes utilisateurs, les rôles et les détails d'authentification.
-- =================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- TABLE: workspaces
-- Un workspace est un conteneur de haut niveau pour les tâches et les membres.
-- =================================================================
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    visibility VARCHAR(50) DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
    image_url TEXT,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL, -- L'utilisateur qui a créé le workspace
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- TABLE: workspace_members
-- Table de jonction pour gérer l'appartenance des utilisateurs aux workspaces (relation plusieurs-à-plusieurs).
-- =================================================================
CREATE TABLE IF NOT EXISTS workspace_members (
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Vous pouvez ajouter une colonne 'role' ici pour les permissions spécifiques au workspace (ex: 'admin', 'member')
    PRIMARY KEY (workspace_id, user_id)
);

-- =================================================================
-- TABLE: tasks
-- Stocke les tâches individuelles avec toutes leurs propriétés.
-- =================================================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    priority VARCHAR(50) CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP WITH TIME ZONE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- TABLE: comments
-- Stocke les commentaires liés à une tâche spécifique.
-- =================================================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- FONCTION ET TRIGGERS POUR 'updated_at'
-- Met à jour automatiquement la colonne 'updated_at' lors de la modification d'une ligne.
-- =================================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour la table 'tasks'
DROP TRIGGER IF EXISTS set_timestamp_tasks ON tasks;
CREATE TRIGGER set_timestamp_tasks
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Trigger pour la table 'workspaces'
DROP TRIGGER IF EXISTS set_timestamp_workspaces ON workspaces;
CREATE TRIGGER set_timestamp_workspaces
BEFORE UPDATE ON workspaces
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- =================================================================
-- TRIGGER: auto_add_owner_to_workspace_members
-- Ajoute automatiquement le créateur d'un workspace comme premier membre.
-- Cela garantit que l'utilisateur qui crée un espace de travail peut immédiatement le voir et l'utiliser.
-- =================================================================
CREATE OR REPLACE FUNCTION add_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Insère le propriétaire du nouveau workspace dans la table des membres
  INSERT INTO workspace_members (workspace_id, user_id)
  VALUES (NEW.id, NEW.owner_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_add_owner_as_member ON workspaces;
CREATE TRIGGER trigger_add_owner_as_member
AFTER INSERT ON workspaces
FOR EACH ROW
-- On s'assure que owner_id n'est pas NULL avant de lancer le trigger
WHEN (NEW.owner_id IS NOT NULL)
EXECUTE FUNCTION add_owner_as_member();