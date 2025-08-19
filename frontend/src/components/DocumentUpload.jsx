import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadDocument } from '../services/api.js';

const DocumentUpload = ({ onUploaded, persona }) => {
    const [content, setContent] = useState('');
    const [metadata, setMetadata] = useState({
        title: '',
        author: '',
        category: '',
        tags: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setUploadStatus('error');
            setStatusMessage('Please enter document content');
            return;
        }

        setIsUploading(true);
        setUploadStatus('idle');

        try {
            // Process metadata
            const processedMetadata = {
                ...metadata,
                tags: metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                timestamp: new Date().toISOString(),
                contentLength: content.length,
                persona: persona.name
            };

            const response = await uploadDocument(content, processedMetadata);

            setUploadStatus('success');
            setStatusMessage(`Document uploaded successfully! Created ${response.chunks} chunks.`);

            // Reset form
            setContent('');
            setMetadata({
                title: '',
                author: '',
                category: '',
                tags: ''
            });

            // Notify parent component
            onUploaded();

            // Clear success message after 5 seconds
            setTimeout(() => {
                setUploadStatus('idle');
                setStatusMessage('');
            }, 5000);

        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
            setStatusMessage(error instanceof Error ? error.message : 'Failed to upload document');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result;
                setContent(text);

                // Auto-fill metadata from filename
                const fileName = file.name.replace(/\.[^/.]+$/, '');
                setMetadata(prev => ({
                    ...prev,
                    title: fileName,
                    category: file.type || 'text'
                }));
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="document-upload">
            <div className="upload-header">
                <h2>Upload {persona.name}'s Documents</h2>
                <p>Add interviews, articles, videos, and professional documents to {persona.name}'s knowledge base</p>
            </div>

            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label htmlFor="file-upload">Upload File (Optional)</label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".txt,.md,.csv"
                        onChange={handleFileUpload}
                        className="file-input"
                    />
                    <small>Supported formats: .txt, .md, .csv</small>
                </div>

                <div className="form-group">
                    <label htmlFor="content">Document Content *</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`Paste ${persona.name}'s document content here or upload a file above...`}
                        rows={10}
                        required
                        className="content-textarea"
                    />
                </div>

                <div className="metadata-section">
                    <h3>Document Metadata</h3>
                    <div className="metadata-grid">
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                value={metadata.title}
                                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Document title"
                                className="metadata-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="author">Author</label>
                            <input
                                id="author"
                                type="text"
                                value={metadata.author}
                                onChange={(e) => setMetadata(prev => ({ ...prev, author: e.target.value }))}
                                placeholder={`${persona.name} or document author`}
                                className="metadata-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <input
                                id="category"
                                type="text"
                                value={metadata.category}
                                onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                                placeholder="Interview, Article, Video, etc."
                                className="metadata-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">Tags</label>
                            <input
                                id="tags"
                                type="text"
                                value={metadata.tags}
                                onChange={(e) => setMetadata(prev => ({ ...prev, tags: e.target.value }))}
                                placeholder="AI, ML, technology, leadership, etc."
                                className="metadata-input"
                            />
                        </div>
                    </div>
                </div>

                {uploadStatus !== 'idle' && (
                    <div className={`status-message ${uploadStatus}`}>
                        {uploadStatus === 'success' ? (
                            <CheckCircle size={20} />
                        ) : (
                            <AlertCircle size={20} />
                        )}
                        <span>{statusMessage}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isUploading || !content.trim()}
                    className="upload-button"
                >
                    {isUploading ? (
                        <>
                            <div className="spinner"></div>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload size={20} />
                            Upload to {persona.name}'s Knowledge Base
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default DocumentUpload;
