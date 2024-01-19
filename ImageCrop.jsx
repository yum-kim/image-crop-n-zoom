import Layout from "@layout/Layout";
import Header from "@layout/Header";
import ReactCrop from "react-image-crop";
import { useEffect, useRef, useState } from "react";
// import 'react-image-crop/dist/ReactCrop.css';

/**
 * 
 * @param {object} image: upload된 File object 
 * @returns 
 */
const ImageCrop = ({ image, cropData }) => {
    const imgRef = useRef(null);
    const [img, setImg] = useState({
        src: null,
        crop: {
            unit: '%',
            // width: 100, //크롭되는 가로 영역 고정
            // height: 100, //크롭되는 세로 영역 고정
            aspect: 5 / 5 
        }
    });
    const [crop, setCrop] = useState();
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);

    const makeClientCrop = async (crop) => {
        if (imgRef.current && crop.width && crop.height) {
            const cropped = await getCroppedImg(
                imgRef.current,
                crop,
                'newFile.jpeg'
            );
            setCroppedImageUrl(cropped);
        }
    }

    const getCroppedImg = (image, crop, fileName) => {
        const canvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }

                blob.name = fileName;
                URL.revokeObjectURL(fileUrl);
                const fileUrl = URL.createObjectURL(blob);
                resolve(fileUrl);
            },
            'image/jpeg',
            1
            );
        });
    }

    const onImageLoaded = (image) => {
        imgRef.current = image;
    }

    /**
     * 
     * @param {object} crop
     * {
     *   unit:'px' or '%'
     *   x: number
     *   y: number
     *   width: number
     *   height: number
     * }
     */
    const onCropComplete = (crop) => {
        makeClientCrop(crop);
    }

    /**
     * 
     * @param {*} crop : px 기준으로 crop된 object 정보
     * @param {*} percentCrop : % 기준으로 crop된 object 정보
     */
    const onCropChange = (crop, percentCrop) => {
        setCrop({ ...percentCrop, ...img.crop });
    }

    useEffect(() => {
        console.log('ImageCrop', cropData);
        setCrop(cropData);
    }, [cropData]);

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImg({ ...image, src: reader.result });
            });
            reader.readAsDataURL(image);
        }
    }, [image]);

    return (
        <>
            <div>
                <ReactCrop
                    src={img.src}
                    crop={crop}
                    onImageLoaded={onImageLoaded}
                    onComplete={onCropComplete}
                    onChange={onCropChange}
                >
                    <img ref={imgRef} src={img.src}  />
                </ReactCrop>
            </div> 
            <div>
                {croppedImageUrl && (
                    <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
                )}
            </div>
        </>
    )
}

export default ImageCrop;