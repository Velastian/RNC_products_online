import { fileToBase64 } from "@/utils";
import { useState, useRef } from "react";

const useImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      const base64Image = await fileToBase64(file);

      setImage(file);
      setImagePreview(base64Image);
    }
  };

  const handleChangeImageClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    };
  };

  const handleRemoveImageClick = (): void => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImage(null);
    setImagePreview(null);
  };

  return {
    image,
    imagePreview,
    fileInputRef,
    handleFileChange,
    handleChangeImageClick,
    handleRemoveImageClick,
  };
};

export default useImageUpload;