import React, { useState } from 'react';
import { X, UploadCloud, File, AlertCircle, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

const SUPPORTED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'ppt', 'pptx'];
const MAX_FILE_SIZE_MB = 25;

export const UploadModal = ({ isOpen, onClose, onFileUploaded }) => {
  const { uploadDocument, uploadProgress } = useOrders();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const validateAndSetFile = (file) => {
    setValidationError('');
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      setValidationError(`Unsupported file format .${ext}. Supported formats: PDF, DOC, DOCX, JPG, PNG, PPT.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setValidationError(`File size must be less than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const fileUrl = await uploadDocument(selectedFile);
      setIsUploading(false);
      onFileUploaded({
        file: selectedFile,
        fileName: selectedFile.name,
        fileType: selectedFile.type || selectedFile.name.split('.').pop(),
        fileSize: selectedFile.size,
        fileUrl: fileUrl
      });
      setSelectedFile(null);
    } catch (err) {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Upload Document for Printing</h3>
            <p className="text-xs text-slate-400">Select file to configure print requirements</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Box */}
        <div className="mt-6 space-y-4">
          {validationError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                  : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileInput}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.ppt,.pptx"
                className="hidden"
              />
              
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center mb-4 border border-indigo-500/20">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h4 className="text-sm font-semibold text-slate-200">
                Drag and drop your file here, or{' '}
                <label htmlFor="file-upload" className="text-indigo-400 font-bold hover:underline cursor-pointer">
                  browse files
                </label>
              </h4>
              <p className="text-xs text-slate-400 mt-2">
                Supported: PDF, DOC, DOCX, JPG, PNG, PPT (Max size: {MAX_FILE_SIZE_MB}MB)
              </p>
            </div>
          ) : (
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <File className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-100 max-w-[280px] truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400">{formatFileSize(selectedFile.size)} • {selectedFile.type || 'Document'}</p>
                  </div>
                </div>

                {!isUploading && (
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>Uploading securely...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>

            <button
              onClick={handleUploadSubmit}
              disabled={!selectedFile || isUploading}
              className={`px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                selectedFile && !isUploading
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{isUploading ? 'Uploading...' : 'Configure Printing Preferences'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
