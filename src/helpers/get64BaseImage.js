export default function get64BaseImage(photo) {
    let url  =  window.URL.createObjectURL(photo);
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    const setState = this.setState.bind(this);
    img.onload = function(){
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0);
        const base64 = canvas.toDataURL(photo.type);
        setState({
            fileName: photo.name,
            newAvatar: base64,
        });
    };
    img.src = url;
}