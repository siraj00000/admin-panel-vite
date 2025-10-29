import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { bankService } from '../services/apiService'; // replace with your bank service
import { bankSchema, type BankFormData, validateFormWithYup } from '../schemas/validation';
import type { Bank } from '../types/apiTypes';
import { theme } from '../utils/constants';

const BankPage: React.FC = () => {
  // Data states
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Form states
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Bank | null>(null);
  const [formData, setFormData] = useState<BankFormData>({
    bank_name: '',
    account_title: '',
    account_number: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Bank | null>(null);

  // Load banks
  const loadBanks = async () => {
    setLoading(true);
    try {
      const response = await bankService.getAll({ limit: 100 });
      console.log("DATA", response.data.items);
      
      setBanks(response.data.items);
    } catch (error) {
      console.error('Failed to load banks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = await validateFormWithYup(bankSchema, formData);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        await bankService.update(editingItem._id!, formData);
      } else {
        await bankService.create(formData);
      }

      await loadBanks();
      resetForm();
    } catch (error) {
      console.error('Failed to save bank:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      bank_name: '',
      account_title: '',
      account_number: ''
    });
    setFormErrors({});
    setEditingItem(null);
    setShowForm(false);
  };

  // Handle edit
  const handleEdit = (item: Bank) => {
    setFormData({
      bank_name: item.bank_name,
      account_title: item.account_title,
      account_number: item.account_number
    });
    setEditingItem(item);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await bankService.delete(itemToDelete._id!);
      await loadBanks();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete bank:', error);
    }
  };

  // Filter banks by search
  const filteredBanks = banks?.filter(item =>
    item.bank_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.account_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.account_number.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Banks</h1>
          <p className="text-gray-600">Manage beneficiary bank accounts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.secondary }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bank
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search banks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      {/* Banks List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        ) : filteredBanks?.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No banks found matching your search' : 'No banks found'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBanks?.map((item) => (
              <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {item.bank_name}
                    </h3>
                    <p className="text-gray-600 mb-1">Title: {item.account_title}</p>
                    <p className="text-gray-600">Account #: {item.account_number}</p>
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
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'Edit Bank' : 'Add New Bank'}
                </h2>
                <button onClick={resetForm} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Bank Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                      formErrors.bank_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Meezan Bank"
                  />
                  {formErrors.bank_name && <p className="mt-1 text-sm text-red-500">{formErrors.bank_name}</p>}
                </div>

                {/* Account Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Title *</label>
                  <input
                    type="text"
                    name="account_title"
                    value={formData.account_title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                      formErrors.account_title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="PSV Welfare Fund"
                  />
                  {formErrors.account_title && <p className="mt-1 text-sm text-red-500">{formErrors.account_title}</p>}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                      formErrors.account_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0123456789"
                  />
                  {formErrors.account_number && <p className="mt-1 text-sm text-red-500">{formErrors.account_number}</p>}
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
              <h2 className="text-lg font-bold text-gray-800 mb-4">Delete Bank</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{itemToDelete.bank_name}"? This action cannot be undone.
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

export default BankPage;
