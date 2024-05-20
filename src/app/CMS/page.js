"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "@firebase/firestore";
import { db } from "../API/firebase.config";

import Layout from "@/components/Layout";

const CMS = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gallery"));
        const imageData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(imageData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "gallery", id));
      setImages((prevImages) => prevImages.filter((image) => image.id !== id));
      setSelectedImage(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Layout>
      <div className="h-[100vh] min-h-[100vh] max-h-fit  w-full flex flex-col">
        <section className="py-6 mb-10 dark:text-gray-50">
          <div className="container grid grid-cols-2 gap-4 p-4 mx-auto md:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`relative ${index === 0 || index === images.length - 1 ? 'col-span-2 row-span-2 min-h-96' : 'min-h-48'} dark:bg-gray-500 aspect-square`}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full object-cover h-full rounded shadow-sm"
                  onClick={() => setSelectedImage(image.id)}
                />
                {selectedImage === image.id && (
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(image.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CMS;
