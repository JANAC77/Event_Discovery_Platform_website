import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, MapPin, Building, Globe, User, Tag, Upload, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';

const CATEGORY_OPTIONS = ['Conference', 'Exhibition', 'Trade Show', 'Summit', 'Workshop'];
const INDUSTRY_OPTIONS = ['Technology', 'Healthcare', 'Finance', 'Green Energy', 'Design', 'Cybersecurity', 'Smart Cities', 'Logistics & Retail'];
const STATUS_OPTIONS = ['UPCOMING', 'ONGOING', 'COMPLETED', 'DRAFT'];

const PRESET_IMAGES = [
  { name: 'Tech Conference', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Green Energy Expo', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Fintech Summit', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Healthcare Congress', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Design Masterclass', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80' },
];

export default function AdminEventModal({ isOpen, onClose, onSubmit, eventToEdit, isLoading }) {
  if (!isOpen) return null;

  const isEditing = Boolean(eventToEdit);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Conference',
    industry: 'Technology',
    startDate: '',
    endDate: '',
    venue: '',
    city: '',
    country: '',
    organizer: '',
    website: '',
    image: PRESET_IMAGES[0].url,
    status: 'UPCOMING'
  });

  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url' | 'presets'
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      const formatISO = (dateStr) => {
        try {
          const date = new Date(dateStr);
          return date.toISOString().slice(0, 16);
        } catch (e) {
          return '';
        }
      };

      setFormData({
        name: eventToEdit.name || '',
        description: eventToEdit.description || '',
        category: eventToEdit.category || 'Conference',
        industry: eventToEdit.industry || 'Technology',
        startDate: formatISO(eventToEdit.startDate),
        endDate: formatISO(eventToEdit.endDate),
        venue: eventToEdit.venue || '',
        city: eventToEdit.city || '',
        country: eventToEdit.country || '',
        organizer: eventToEdit.organizer || '',
        website: eventToEdit.website || '',
        image: eventToEdit.image || PRESET_IMAGES[0].url,
        status: eventToEdit.status || 'UPCOMING'
      });
    } else {
      const now = new Date();
      const tomorrow = new Date(now.setDate(now.getDate() + 1)).toISOString().slice(0, 16);
      const dayAfter = new Date(now.setDate(now.getDate() + 2)).toISOString().slice(0, 16);

      setFormData({
        name: '',
        description: '',
        category: 'Conference',
        industry: 'Technology',
        startDate: tomorrow,
        endDate: dayAfter,
        venue: '',
        city: '',
        country: '',
        organizer: '',
        website: '',
        image: PRESET_IMAGES[0].url,
        status: 'UPCOMING'
      });
    }
    setErrorMsg('');
  }, [eventToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return setErrorMsg('Please select a valid image file (PNG, JPG, WEBP, GIF)');
    }

    setIsCompressing(true);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setFormData(prev => ({ ...prev, image: compressedBase64 }));
        setIsCompressing(false);
      };

      img.onerror = () => {
        setErrorMsg('Invalid image file');
        setIsCompressing(false);
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      setErrorMsg('Failed to read file');
      setIsCompressing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) return setErrorMsg('Event name is required');
    if (!formData.description.trim()) return setErrorMsg('Event description is required');
    if (!formData.venue.trim()) return setErrorMsg('Venue name is required');
    if (!formData.city.trim()) return setErrorMsg('City is required');
    if (!formData.country.trim()) return setErrorMsg('Country is required');
    if (!formData.organizer.trim()) return setErrorMsg('Organizer name is required');

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return setErrorMsg('End date cannot be earlier than Start date');
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Box */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isEditing ? 'Edit Event Details' : 'Create New Event'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isEditing ? 'Update parameters in MongoDB Atlas database' : 'Add new conference or exhibition to MongoDB database'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Global Tech Summit 2026"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-purple-600 cursor-pointer"
              >
                {STATUS_OPTIONS.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-purple-600 cursor-pointer"
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-purple-600 cursor-pointer"
              >
                {INDUSTRY_OPTIONS.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Description *
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of event keynotes, schedule, and exhibitors..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-4 rounded-2xl text-sm font-normal focus:bg-white focus:ring-2 focus:ring-purple-600 leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Venue *
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Convention Center"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="San Francisco"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Organizer Name *
              </label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="TechEx Events Group"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Website URL
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>Event Banner Image (Base64)</span>
              </label>

              <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    uploadMode === 'file' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Base64 File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    uploadMode === 'url' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Paste URL
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('presets')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    uploadMode === 'presets' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Presets
                </button>
              </div>
            </div>

            {uploadMode === 'file' && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-2xl p-6 text-center cursor-pointer bg-purple-50/50 hover:bg-purple-100/50 transition-all group"
                >
                  {isCompressing ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-bold text-purple-700">Optimizing Base64 image encoding...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-black text-slate-800">
                        Click to select image file (Auto Base64 & Canvas Compressed)
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Image stored directly in MongoDB Atlas as Base64 Data URL
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {uploadMode === 'url' && (
              <div>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-purple-600"
                />
              </div>
            )}

            {uploadMode === 'presets' && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setFormData(prev => ({ ...prev, image: preset.url }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      formData.image === preset.url
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            )}

            {/* Preview */}
            {formData.image && (
              <div className="space-y-2 mt-3">
                <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                  <img
                    src={formData.image}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 text-emerald-700 border border-emerald-300 backdrop-blur-md flex items-center gap-1 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Base64 Ready</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isCompressing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Event')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
