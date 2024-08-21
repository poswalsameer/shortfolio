// import { createImage, getCroppedImg } from 'react-easy-crop';




          {/* // <div className=" h-60 w-60 rounded-full "> */}
          {/* //   <img */}
          {/* //     src={userImage} */}
          {/* //     alt="" */}
          {/* //     className="h-full w-full rounded-full" */}
          {/* //   /> */}
          {/* // </div> */}
          {/* <div className="relative h-60 w-60 rounded-full">
            {!editMode ? (
              <img
                src={userImage}
                alt=""
                className="h-full w-full rounded-full"
              />
            ) : (
              <Cropper
                image={userImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}

            <button
              className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>

            {editMode && (
              <div className="absolute top-full left-0 mt-2 flex space-x-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={saveCroppedImage}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div> */}






function createImage(url: string): Promise<HTMLImageElement>{
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.setAttribute('crossOrigin', 'anonymous'); // To avoid CORS issues
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
}

export default async function getCroppedImg(imageSrc: any, crop: any): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx?.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      const fileUrl = window.URL.createObjectURL(blob);
      resolve(fileUrl);
    }, 'image/jpeg');
  });
}
