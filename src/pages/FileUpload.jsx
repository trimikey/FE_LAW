import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const FileUpload = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'other',
    documentType: '',
    description: '',
    isOriginal: false
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Vui lòng chọn ít nhất một file');
      return;
    }

    try {
      setUploading(true);
      
      // Upload từng file
      for (const file of files) {
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('caseId', caseId);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('documentType', formData.documentType);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('isOriginal', formData.isOriginal);

        await api.post('/documents/upload', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      toast.success(`Upload ${files.length} file thành công`);
      navigate(`/cases/${caseId}`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Lỗi khi upload file');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <button
          onClick={() => navigate(`/cases/${caseId}`)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Quay lại
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Upload Tài Liệu</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn File
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              />
              <p className="mt-1 text-xs text-gray-500">
                Chấp nhận: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (tối đa 10MB/file)
              </p>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm font-medium mb-2">Files đã chọn ({files.length}):</p>
                <ul className="space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {file.name} ({formatFileSize(file.size)})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="original">Bản gốc</option>
                <option value="copy">Bản sao</option>
                <option value="power_of_attorney">Ủy quyền</option>
                <option value="evidence">Chứng cứ</option>
                <option value="contract">Hợp đồng</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại tài liệu
              </label>
              <input
                type="text"
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                placeholder="Ví dụ: CMND, CCCD, Giấy phép..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Mô tả về file..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Is Original */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isOriginal"
                checked={formData.isOriginal}
                onChange={(e) => setFormData({ ...formData, isOriginal: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isOriginal" className="ml-2 block text-sm text-gray-700">
                Đây là bản gốc
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(`/cases/${caseId}`)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={uploading || files.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Đang upload...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
