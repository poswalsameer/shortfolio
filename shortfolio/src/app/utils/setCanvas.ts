const setCanvasPreview = (
    image: any,
    canvas: any,
    crop: any
) => {

    const context = canvas.getContext('2d');

    if( !context ){
        throw new Error("No context found");
    }

    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor( crop.width * scaleX * pixelRatio );
    canvas.height = Math.floor( crop.height * scaleY * pixelRatio );

    context.scale(pixelRatio, pixelRatio);
    context.imageSmoothingQuality = "high";
    context.save();

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    context.translate(-cropX, -cropY);
    context.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
    );
    
    context.restore();

}

export default setCanvasPreview;