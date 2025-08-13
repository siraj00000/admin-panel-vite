import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Mail,
  X
} from 'lucide-react';
import { libraryService } from '../services/apiService';
import { librarySchema, type LibraryFormData, validateFormWithYup } from '../schemas/validation';
import type { Library } from '../types/apiTypes';
import { theme } from '../utils/constants';

const LibraryPage: React.FC = () => {
  // Data states
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Form states
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Library | null>(null);
  const [formData, setFormData] = useState<LibraryFormData>({
    title: '',
    description: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Library | null>(null);

  // Load libraries
  const loadLibraries = async () => {
    setLoading(true);
    try {
      const response = await libraryService.getAll({ limit: 100 }); 
      setLibraries(response.data.items);
    } catch (error) {
      console.error('Failed to load library items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibraries();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = await validateFormWithYup(librarySchema, formData);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const dataToSubmit = {
        ...formData,
        email: formData.email?.trim() || undefined
      };

      if (editingItem) {
        await libraryService.update(editingItem._id!, dataToSubmit);
      } else {
        await libraryService.create(dataToSubmit);
      }
      
      await loadLibraries();
      resetForm();
    } catch (error) {
      console.error('Failed to save library item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      email: ''
    });
    setFormErrors({});
    setEditingItem(null);
    setShowForm(false);
  };

  // Handle edit
  const handleEdit = (item: Library) => {
    setFormData({
      title: item.title,
      description: item.description || '',
      email: item.email || ''
    });
    setEditingItem(item);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await libraryService.delete(itemToDelete._id!);
      await loadLibraries();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete library item:', error);
    }
  };

  // Filter libraries by search
  const filteredLibraries = libraries?.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Library</h1>
          <p className="text-gray-600">Manage library resources and materials</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.secondary }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Library Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search library items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      {/* Libraries List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        ) : filteredLibraries?.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No library items found matching your search' : 'No library items found'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLibraries?.map((item) => (
              <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    
                    {item.description && (
                      <p className="text-gray-600 mb-3">
                        {item.description}
                      </p>
                    )}

                    {item.email && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        <span>{item.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(item);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'Edit Library Item' : 'Add New Library Item'}
                </h2>
                <button onClick={resetForm} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter library item title"
                  />
                  {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter library item description"
                  />
                  {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter contact email"
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: theme.secondary }}
                  >
                    {submitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Delete Library Item</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{itemToDelete.title}"? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;