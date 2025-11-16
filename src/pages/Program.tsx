import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  User,
  X
} from 'lucide-react';
import { programService } from '../services/apiService';
import { programSchema, type ProgramFormData, validateFormWithYup } from '../schemas/validation';
import type { Program } from '../types/apiTypes';
import { theme } from '../utils/constants';

const ProgramPage: React.FC = () => {
  // Data states
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form states
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Program | null>(null);
  const [formData, setFormData] = useState<ProgramFormData>({
    title: '',
    hijri_date: '',
    georgian_date: '',
    description: '',
    speaker: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Program | null>(null);

  // Load programs
  const loadPrograms = async () => {
    setLoading(true);
    try {
      const response = await programService.getAll({ limit: 100 });
      setPrograms(response.data.items);
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
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

    const { isValid, errors } = await validateFormWithYup(programSchema, formData);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const dataToSubmit = {
        ...formData,
        description: formData.description?.trim() || undefined,
        speaker: formData.speaker?.trim() || undefined
      };

      if (editingItem) {
        await programService.update(editingItem._id!, dataToSubmit);
      } else {
        await programService.create(dataToSubmit);
      }

      await loadPrograms();
      resetForm();
    } catch (error) {
      console.error('Failed to save program:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      hijri_date: '',
      georgian_date: '',
      description: '',
      speaker: ''
    });
    setFormErrors({});
    setEditingItem(null);
    setShowForm(false);
  };

  // Handle edit
  const handleEdit = (item: Program) => {
    setFormData({
      title: item.title,
      hijri_date: item.hijri_date,
      georgian_date: item.georgian_date,
      description: item.description || '',
      speaker: item.speaker || ''
    });
    setEditingItem(item);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await programService.delete(itemToDelete._id!);
      await loadPrograms();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete program:', error);
    }
  };

  // Filter programs by search
  const filteredPrograms = programs?.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.speaker?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Programs</h1>
          <p className="text-gray-600">Manage mosque programs and events</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.secondary }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      {/* Programs List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        ) : filteredPrograms?.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No programs found matching your search' : 'No programs found'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPrograms?.map((item) => (
              <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h3>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Hijri: {item.hijri_date}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Georgian: {new Date(item.georgian_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-gray-600 mb-3">
                        {item.description}
                      </p>
                    )}

                    {item.speaker && (
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>Speaker: {item.speaker}</span>
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
                  {editingItem ? 'Edit Program' : 'Add New Program'}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter program title"
                  />
                  {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hijri Date</label>
                    <input
                      type="text"
                      name="hijri_date"
                      value={formData.hijri_date}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${formErrors.hijri_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Jumada I 8, 1447 AH (Hijri)"
                    />
                    {formErrors.hijri_date && <p className="mt-1 text-sm text-red-500">{formErrors.hijri_date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Georgian Date *</label>
                    <input
                      type="date"
                      name="georgian_date"
                      value={formData.georgian_date}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${formErrors.georgian_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {formErrors.georgian_date && <p className="mt-1 text-sm text-red-500">{formErrors.georgian_date}</p>}
                  </div>
                </div>

                {/* Speaker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                  <input
                    type="text"
                    name="speaker"
                    value={formData.speaker}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${formErrors.speaker ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter speaker name"
                  />
                  {formErrors.speaker && <p className="mt-1 text-sm text-red-500">{formErrors.speaker}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter program description"
                  />
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
              <h2 className="text-lg font-bold text-gray-800 mb-4">Delete Program</h2>
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

export default ProgramPage;