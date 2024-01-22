    useEffect(async () => {
        if (completeImageUrl) {
            const response = await fetch(completeImageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'newFile', { type: blob.type });
            
            setIsUploading(true);
            _API.upload({
                aws,
                file: file,
                prefix: "POSTS",
                config: { setLoadPercent }
            })
                .then((res) => res.data)
                .then((img) => onImageUploaded(img))
                .catch((e) => {
                    swal({ text: e.message });
                    setIsUploading(false);
                })
        }
    }, [completeImageUrl])
