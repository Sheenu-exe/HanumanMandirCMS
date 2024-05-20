
'use client'
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from '../API/firebase.config';
import Layout from "@/components/Layout";

const GalleryForm = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);

        const storageRef = ref(storage, `gallery/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Optional: Track progress here if needed
            },
            (error) => {
                setUploading(false);
                setError(error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    try {
                        await addDoc(collection(db, "gallery"), {
                            url: downloadURL,
                            name: file.name,
                            createdAt: new Date(),
                        });
                        setFile(null);
                        setUploading(false);
                        alert("File uploaded successfully!");
                    } catch (error) {
                        setUploading(false);
                        setError(error.message);
                    }
                });
            }
        );
    };

    return (
        <Layout>
            <div className='h-full w-full flex flex-col justify-center items-center py-10'>
                <h1 className='text-3xl font-bold mb-5'>Upload Picture</h1>
                <form onSubmit={handleSubmit} className='flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-80'>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className='mb-4 p-2 border border-gray-300 rounded'
                    />
                    <button 
                        type="submit" 
                        disabled={uploading} 
                        className={`px-4 py-2 rounded ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </form>
                {error && <p className='mt-4 text-red-500'>{error}</p>}
            </div>
        </Layout>
    );
};
export default GalleryForm;
