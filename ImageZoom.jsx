import React, { useEffect, useReducer, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ImageZoom = ({ image, setCroppedImageUrl }) => {
// const ImageZoom = ({ image, setCrop }) => {
    const imgRef = useRef();
    const [img, setImg] = useState();
    const [crop, setCrop] = useState();
    // const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const cropData = useRef();

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImg({ src: reader.result });
            });
            reader.readAsDataURL(image);
        }
    }, [image]);

    const onZoomComplete = (ref, event) => {
        makeZoomImage(ref);
    }
    
    const makeZoomImage = async (ref) => {
        const { positionX, positionY, scale } = ref.state;
        const { width, height } = imgRef.current;

        if (imgRef.current && width && height) {
            const crop = { 
                x: positionX / scale, 
                y: positionY / scale,
                width: width / scale, 
                height: height / scale,
                scale 
            };

            // cropData.current = crop;
            setCrop({ 
                x: Math.abs(crop.x),
                y: Math.abs(crop.y),
                width: crop.width,
                height: crop.height,
                unit:'px' 
            });
            // onCropImage();
        }
    }

    const onCropImage = async () => {
        setCrop({ 
            x: Math.abs(cropData.current.x),
            y: Math.abs(cropData.current.y),
            width: cropData.current.width,
            height: cropData.current.height,
            unit:'px' 
        });
    }

    useEffect(() => {
        makeClientCrop();
    }, [crop]);

    // TODO: TEST
    const makeClientCrop = async () => {
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

    return (
        <>
            <TransformWrapper
                onZoomStop={(ref, event) => onZoomComplete(ref, event)}
                onPanningStop={(ref, event) => onZoomComplete(ref, event)}
            >
                <TransformComponent>
                    {img && <img ref={imgRef} src={img.src} style={{ maxWidth: '100%' }} />}
                </TransformComponent>
            </TransformWrapper>
        </>
    );
};

export default ImageZoom;