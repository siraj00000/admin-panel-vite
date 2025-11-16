import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  User,
  X,
  Facebook,
  Instagram,
  Upload,
  ChevronDown,
  Check
} from 'lucide-react';
import { businessService } from '../services/apiService';
import { businessSchema, type BusinessFormData, validateFormWithYup } from '../schemas/validation';
import type { Business } from '../types/apiTypes';
import { theme } from '../utils/constants';

// Business Type Component
interface BusinessTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onCustomInput?: (value: string) => void;
}

const BusinessTypeSelector: React.FC<BusinessTypeSelectorProps> = ({ 
  value, 
  onChange, 
  onCustomInput 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  console.log('Custom Input Function:', showCustomInput);
  const directoryItems = [
    "Architect",
    "Automobile",
    "Bank",
    "Bulldozer",
    "Business & Finance",
    "Compliance",
    "Dinning Hall",
    "Document",
    "Electrician",
    "Ellipsis",
    "Express Delivery",
    "Fashion",
    "Fences",
    "Foster Family",
    "Online Learning",
    "Online Test",
    "Plumber",
    "Residential",
    "Salon",
    "Solar Energy",
    "Technical Support",
    "Transportation"
  ];

  const filteredItems = directoryItems.filter(item =>
    item.toLowerCase().includes(customValue.toLowerCase())
  );

  const handleSelect = (item: string) => {
    onChange(item);
    setIsOpen(false);
    setShowCustomInput(false);
    setCustomValue('');
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      if (onCustomInput) {
        onCustomInput(customValue.trim());
      } else {
        onChange(customValue.trim());
      }
      setIsOpen(false);
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 flex items-center justify-between bg-white"
      >
        <span className={value ? 'text-gray-800' : 'text-gray-500'}>
          {value || 'Select business type'}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* Search/Custom Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Search or type custom type..."
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-yellow-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomSubmit();
                  }
                }}
              />
              {customValue && !directoryItems.includes(customValue) && (
                <button
                  onClick={handleCustomSubmit}
                  className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Add
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="py-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between ${
                    value === item ? 'bg-yellow-50 text-yellow-700' : 'text-gray-700'
                  }`}
                >
                  <span>{item}</span>
                  {value === item && <Check className="h-4 w-4" />}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Business Page Component
const BusinessPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Business | null>(null);
  const [formData, setFormData] = useState<BusinessFormData>({
    title: '',
    business_type: '',
    business_detail: '',
    address: '',
    contact_person: '',
    services: [],
    phone_number: '',
    email: '',
    website: '',
    fb_id: '',
    insta_id: '',
    portfolio_images: []
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Business | null>(null);

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const response = await businessService.getAll({ limit: 100 });
      setBusinesses(response.data.items);
    } catch (error) {
      console.error('Failed to load businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBusinessTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, business_type: value.toLowerCase() }));
    
    if (formErrors.business_type) {
      setFormErrors(prev => ({ ...prev, business_type: '' }));
    }
  };

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...(formData.services || [])];
    newServices[index] = value;
    setFormData(prev => ({ ...prev, services: newServices }));
  };

  const addServiceField = () => {
    setFormData(prev => ({ 
      ...prev, 
      services: [...(prev.services || []), ''] 
    }));
  };

  const removeServiceField = (index: number) => {
    const newServices = (formData.services || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, services: newServices }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = await validateFormWithYup(businessSchema, formData);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('business_type', formData.business_type || '');
      formDataToSend.append('business_detail', formData.business_detail || '');
      formDataToSend.append('address', formData.address || '');
      formDataToSend.append('contact_person', formData.contact_person || '');
      formDataToSend.append('phone_number', formData.phone_number || '');
      formDataToSend.append('email', formData.email || '');
      formDataToSend.append('website', formData.website || '');
      formDataToSend.append('fb_id', formData.fb_id || '');
      formDataToSend.append('insta_id', formData.insta_id || '');
      
      const filteredServices = formData.services?.filter(service => service.trim() !== '') || [];
      filteredServices.forEach((service, index) => {
        formDataToSend.append(`services[${index}]`, service);
      });
      
      selectedFiles.forEach((file) => {
        formDataToSend.append('portfolio_images', file);
      });

      if (editingItem) {
        await businessService.update(editingItem._id!, formDataToSend);
      } else {
        await businessService.create(formDataToSend);
      }
      
      await loadBusinesses();
      resetForm();
    } catch (error) {
      console.error('Failed to save business:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      business_type: '',
      business_detail: '',
      address: '',
      contact_person: '',
      services: [],
      phone_number: '',
      email: '',
      website: '',
      fb_id: '',
      insta_id: '',
      portfolio_images: []
    });
    setSelectedFiles([]);
    setFormErrors({});
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: Business) => {
    setFormData({
      title: item.title,
      business_type: item.business_type || '',
      business_detail: item.business_detail || '',
      address: item.address || '',
      contact_person: item.contact_person || '',
      services: item.services || [],
      phone_number: item.phone_number || '',
      email: item.email || '',
      website: item.website || '',
      fb_id: item.fb_id || '',
      insta_id: item.insta_id || '',
      portfolio_images: item.portfolio_images || []
    });
    setSelectedFiles([]);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await businessService.delete(itemToDelete._id!);
      await loadBusinesses();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete business:', error);
    }
  };

  const filteredBusinesses = businesses.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.business_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.business_detail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Business Directory</h1>
          <p className="text-gray-600">Manage Islamic businesses and services</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.secondary }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Business
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search businesses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No businesses found matching your search' : 'No businesses found'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBusinesses.map((item) => (
              <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      {item.business_type && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full"
                              style={{ backgroundColor: theme.primary + '20', color: theme.primary }}>
                          {item.business_type}
                        </span>
                      )}
                    </div>

                    {item.business_detail && (
                      <p className="text-gray-600 mb-3">
                        {item.business_detail}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      {item.contact_person && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>{item.contact_person}</span>
                        </div>
                      )}
                      
                      {item.phone_number && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{item.phone_number}</span>
                        </div>
                      )}
                      
                      {item.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{item.email}</span>
                        </div>
                      )}
                      
                      {item.address && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{item.address}</span>
                        </div>
                      )}

                      {item.website && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          <span>{item.website}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        {item.fb_id && (
                          <div className="flex items-center">
                            <Facebook className="h-4 w-4 mr-1" />
                            <span>Facebook</span>
                          </div>
                        )}
                        {item.insta_id && (
                          <div className="flex items-center">
                            <Instagram className="h-4 w-4 mr-1" />
                            <span>Instagram</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {item.services && item.services.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.services.map((service, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.portfolio_images && item.portfolio_images.length > 0 && (
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span>{item.portfolio_images.length} portfolio image(s)</span>
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'Edit Business' : 'Add New Business'}
                </h2>
                <button onClick={resetForm} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                        formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter business name"
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                    <BusinessTypeSelector
                      value={formData.business_type || ''}
                      onChange={handleBusinessTypeChange}
                    />
                    {formErrors.business_type && <p className="mt-1 text-sm text-red-500">{formErrors.business_type}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                  <textarea
                    name="business_detail"
                    value={formData.business_detail}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="Describe your business"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                    <input
                      type="text"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      placeholder="Contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                        formErrors.phone_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+92 300 1234567"
                    />
                    {formErrors.phone_number && <p className="mt-1 text-sm text-red-500">{formErrors.phone_number}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="Business address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      // type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="business@example.com"
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook ID</label>
                    <input
                      type="text"
                      name="fb_id"
                      value={formData.fb_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      placeholder="facebook-page-id"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram ID</label>
                    <input
                      type="text"
                      name="insta_id"
                      value={formData.insta_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      placeholder="instagram-handle"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Services</label>
                    <button
                      type="button"
                      onClick={addServiceField}
                      className="text-sm text-yellow-600 hover:text-yellow-700"
                    >
                      + Add Service
                    </button>
                  </div>
                  
                  {formData.services?.map((service: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={service}
                        onChange={(e) => handleServiceChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                        placeholder="Enter service name"
                      />
                      <button
                        type="button"
                        onClick={() => removeServiceField(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Images</label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="portfolio-upload"
                    />
                    <label
                      htmlFor="portfolio-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload portfolio images or drag and drop
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP up to 50MB each
                      </span>
                    </label>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-600 truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editingItem && formData.portfolio_images && formData.portfolio_images.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Existing Images:</p>
                      {formData.portfolio_images.map((_, index) => (
                        <div key={index} className="flex items-center bg-blue-50 p-2 rounded">
                          <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-sm text-blue-600 truncate">Existing image {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: theme.secondary }}
                  >
                    {submitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Delete Business</h2>
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

export default BusinessPage;