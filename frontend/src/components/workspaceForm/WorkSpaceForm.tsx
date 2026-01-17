import React, { useState } from 'react';
import { FaUpload, FaTimes, FaBriefcase, FaUsers, FaPalette } from 'react-icons/fa';
import './workspaceForm.scss';



interface WorkspaceFormProps {
  onClose: () => void;
}

const WorkspaceForm: React.FC<WorkspaceFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    visibility: 'private',
    photo: null
  });

 const resetFormData = () => {
  console.log("Resetting form data");
  setFormData({
    name: '',
    description: '',
    category: '',
    visibility: 'private',
    photo: null
  });
  console.log("Closing modal");
  closeModal();
};

const closeModal = () => {
  console.log("Closing modal");
  onClose();
};

  

  return (
    <div className="workspace-form-overlay">
      <div className="workspace-modal">
        <header className="modal-header">
          <div className="title-section">
            <div className="icon-circle">
              <FaBriefcase />
            </div>
            <div>
              <h2>Create Workspace</h2>
              <p>A space for your team to collaborate and manage projects.</p>
            </div>
          </div>
         <button className="close-btn" onClick={resetFormData}><FaTimes /></button>
        </header>

        <form  className="modal-body">
          {/* Nom du Workspace */}
          <div className="input-group">
            <label>Workspace Name</label>
            <input 
              type="text" 
              placeholder="e.g. Marketing Team, Project Alpha..." 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          {/* Catégorie */}
          <div className="input-row">
            <div className="input-group">
              <label>Category</label>
              <input 
                type="text"
                placeholder="e.g. Engineering"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Visibility</label>
              <div className="toggle-group">
                 <button 
                   type="button" 
                   className={formData.visibility === 'private' ? 'active' : ''}
                   onClick={() => setFormData({...formData, visibility: 'private'})}
                 >Private</button>
                 <button 
                   type="button" 
                   className={formData.visibility === 'public' ? 'active' : ''}
                   onClick={() => setFormData({...formData, visibility: 'public'})}
                 >Public</button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="input-group">
            <label>Description (Optional)</label>
            <textarea 
              placeholder="What is this workspace about?"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          {/* Upload de couverture */}
          <div className="upload-section">
            <label>Workspace Cover</label>
            <div className="upload-dropzone">
              <FaUpload className="upload-icon" />
              <span>Click to upload or drag and drop</span>
              <p>PNG, JPG up to 5MB</p>
              <input type="file" className="file-input" />
            </div>
          </div>

          <footer className="modal-footer">
            <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn-submit">Create Workspace</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceForm;
