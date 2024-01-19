import Layout from "@layout/Layout";
import Header from "@layout/Header";
import ReactCrop from "react-image-crop";
import { useEffect, useRef, useState } from "react";
import 'react-image-crop/dist/ReactCrop.css';
import ImageCrop from "@component/ImageCrop";
import ImageZoom from "@component/ImageZoom";

const ImageCropPage = () => {
    const inputRef = useRef();
    const [imageFile, setImageFile] = useState();
    const [crop, setCrop] = useState();

    const onSelectFile = (e) => {
        if (e.target.files?.length > 0) {
            setImageFile(e.target.files[0]);
        }
    }
    
    return (
        <>
         <Layout requireLogin header>
            <Header />
            <input ref={inputRef} type="file" accept="image/*" onChange={onSelectFile} />
            <h1>Image Crop</h1>
            {imageFile && crop && <ImageCrop image={imageFile} cropData={crop} />}

            <h1>Image Pinch Zoom</h1>
            {imageFile && <ImageZoom image={imageFile} setCrop={setCrop} />}

            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit, sint ipsum non error, tenetur molestiae sed commodi alias, nisi voluptatum tempore consequuntur eveniet voluptatem. Fuga totam dignissimos ab dolorum. At.
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus suscipit, iste hic expedita fugit aliquid rerum. Perspiciatis inventore unde quisquam molestias magni illum exercitationem error ab voluptatum. Quos, iure beatae.
            </p>
        </Layout>
        </>
    )
}

export default ImageCropPage;