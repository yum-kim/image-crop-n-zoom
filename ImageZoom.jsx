import React, { useEffect, useReducer, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ImageZoom = ({ image, setCrop }) => {
    const imgRef = useRef();
    const [img, setImg] = useState();
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
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

            cropData.current = crop;
            onCropImage();
        }
    }

    const onCropImage = async () => {
        //TODO: x, y가 이미지 전체보다 넘어가면 크롭 영역 잘려서 들어가기 처리 추가

        setCrop({ 
            x: Math.abs(cropData.current.x), 
            y: Math.abs(cropData.current.y), 
            width: cropData.current.width, 
            height: cropData.current.height, 
            unit:'px' 
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

            {/* {croppedImageUrl && <img src={croppedImageUrl} style={{ maxWidth: '100%' }} /> } */}
        </>
    );
};

export default ImageZoom;