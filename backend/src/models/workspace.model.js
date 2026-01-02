/**
 * Workspace model
 * Represents a workspace created by an admin
 */

export const WorkspaceModel = {
  id: null,           // string, UUID
  name: null,         // string
  description: null,  // optional string
  createdBy: null,    // string, userId of admin
  createdAt: new Date(),
  updatedAt: new Date(),
};
