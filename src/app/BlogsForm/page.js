"use client"
import React, { useState } from 'react';
import { db, storage } from '../API/firebase.config';
import { collection } from '@firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { addDoc } from '@firebase/firestore';
import Layout from '@/components/Layout';


const BlogForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        try {
            const projectsRef = collection(db, 'blogs');
    
            const imageRef = ref(storage, `blog-images/${image.name}`);
            await uploadBytes(imageRef, image); // Wait for upload to complete
    
            const imageUrl = await getDownloadURL(imageRef);
    
            await addDoc(projectsRef, {
                title: title,
                description: description,
                imageUrl: imageUrl
            });
            if (!image) {
                console.error('No image selected');
                return;
            }
    
            setTitle('');
            setDescription('');
            setImage(null);
        } catch (error) {
            console.error('Error adding project: ', error);
        }
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    return (
        <Layout>
        <div className='h-[90vh] w-[77vw] mx-5 mt-5 flex flex-col'>
           
                <h2 className="text-2xl mb-4">Add Blog Here</h2>
                <div className="space-y-4 w-full">
                    <div title="Add Project" index={0} className="h-[10vh]">
                        <form className="space-y-4 mt-0 flex flex-col gap-y-5 w-full" onSubmit={handleSubmit}>
                            <div className='mt-5'>
                            <label htmlFor="title" className="block text-gray-700 mb-2.5">Title:</label>
                                <input type="text" id="title" placeholder='Blog Title Here' value={title} onChange={(e) => setTitle(e.target.value)} className="w-full input rounded-none focus:border-x-0 focus:border-t-0 focus:border-b-[1px] focus:border-b-zinc-900 border-b-[1px] focus:outline-none focus:ring-0 border-b-zinc-400" required />
                            </div>
                            <div>
                            <label htmlFor="description" className="block text-gray-700 mb-2.5">Description:</label>
                                <textarea id="description" placeholder='Blog Description Here' value={description} onChange={(e) => setDescription(e.target.value)} className="w-full input rounded-none focus:border-x-0 focus:border-t-0 focus:border-b-[1px] focus:border-b-zinc-900 border-b-[1px] focus:outline-none focus:ring-0 border-b-zinc-400" required></textarea>
                            </div>
                            
                            <div>
                                <label htmlFor="image" className="block text-gray-700">Image:</label>
                                <input type="file" id="image"  onChange={handleImageChange} className="w-full border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" required />
                            </div>
                            <button type="submit" className="w-full bg-zinc-900 text-white rounded-md py-2 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">Submit</button>
                        </form>
                    </div>
                </div>
            
        </div>
        </Layout>
    );
};


export default BlogForm;
