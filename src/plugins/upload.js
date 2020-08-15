export default function uploadImage(file) {
    var url = `https://api.cloudinary.com/v1_1/partywatch/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var url = response.secure_url;
            var tokens = url.split("/");
            tokens.splice(-2, 0, "w_150,c_scale");
            var img = new Image();
            img.src = tokens.join("/");
        }
    };

    fd.append("upload_preset", "iumctgbb");
    fd.append("tags", "browser_upload");
    fd.append("file", file);
    xhr.send(fd);
    alert("Uploaded");
}