export const WorkspaceModel = {
  id: null,           // string (UUID)
  name: null,         // string
  description: null,  // string (Optional)
  category: null,     // string (e.g., 'Engineering', 'Marketing')
  visibility: null,   // string ('private' or 'public')
  imageUrl: null,     // string (URL de l'image de couverture)
  createdBy: null,    // string (userId de l'admin)
  createdAt: new Date(),
  updatedAt: new Date(),
};