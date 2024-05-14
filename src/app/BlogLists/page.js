"use client"

import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc } from '@firebase/firestore';
import { db } from '../API/firebase.config';
import Layout from '@/components/Layout';
import { doc } from '@firebase/firestore';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const projectsRef = collection(db, 'blogs');
      const snapshot = await getDocs(projectsRef);
      const blogList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setBlogs(blogList);
    };
    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (id) => {
    const projectsRef = collection(db, 'projects');
    await deleteDoc(doc(projectsRef, id));
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <Layout>
    <div className="mt-6">
      <header className='h-[10vh]'><h2 className='text-2xl font-bold mx-3'>Added Blogs</h2></header>
      {blogs.length > 0 ? (
        <ul className='flex'>
          {blogs.map((blog) => (
            <li key={blog.id} className="flex m-3 justify-between items-center mb-2 h-full">
                <div className="max-w-xs rounded-md h-full shadow-md dark:dark:bg-gray-900 dark:dark:text-gray-100">
	<img src={blog.imageUrl} alt="" className="object-cover object-center w-full rounded-t-md h-72 dark:dark:bg-gray-500" />
	<div className="flex flex-col justify-between p-6 space-y-8">
		<div className="space-y-2">
			<h2 className="text-3xl font-semibold tracki">{blog.title} </h2>
			<p className="dark:dark:text-gray-100">{blog.description}</p>
		</div>
		<button onClick={() => handleDeleteBlog(blog.id)} type="button" className="flex items-center justify-center w-full p-3 font-semibold tracki rounded-md dark:dark:bg-purple-400 dark:dark:text-gray-900">Delete</button>
	</div>
</div>

              
            </li>
          ))}
        </ul>
      ) : (
        <p>No blogs added yet.</p>
      )}
    </div>
    </Layout>
  );
};

export default BlogList;
