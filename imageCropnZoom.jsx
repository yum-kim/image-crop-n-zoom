import { useEffect, useRef, useState } from "react";
import 'react-image-crop/dist/ReactCrop.css';
import ImageCrop from "@component/ImageCrop";
import ImageZoom from "@component/ImageZoom";
import styled from "styled-components";
import Layout from "@layout/Layout";

/**
 * 
 * @param {File} files : file 업로드 시 e.target.files
 * @param {boolean} setIsShow: zoom 컴포넌트 노출 여부
 * @param {Blob} setCompleteImageUrl: zoom된 이미지 blob url(상위 컴포넌트로 전달하여 로직 처리)
 * 
 */
const ImageCropnZoom = ({ files, setIsShow, setCompleteImageUrl }) => {
    const [imageFile, setImageFile] = useState();
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);

    useEffect(() => {
        if (files?.length > 0) {
            setImageFile(files[0]);
        }
    }, [files]);

    const onComplete = () => {
        setCompleteImageUrl(croppedImageUrl);
        setIsShow(false);
    };

    useEffect(() => {
        console.log('croppedImageUrl');
        console.log(croppedImageUrl);
    }, [croppedImageUrl]);

    return (
        <Layout>
          <Container>
            <Background>
                <CropContainer>
                    <h1>Image Pinch Zoom</h1>
                    {imageFile && <ImageZoom image={imageFile} setCroppedImageUrl={setCroppedImageUrl}  />}
                    <button onClick={onComplete}>확인</button>
                </CropContainer>
            </Background>
            </Container>
        </Layout>
    )
}

export default ImageCropnZoom;

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    font-family: "Pretendard-Regular";
`;

export const Background = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
`;

export const CropContainer = styled.div`
    max-width: 430px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;    