window.onload = function() {
  var filesUpload = document.getElementById("files-upload"), 
  dropArea = document.getElementById("file-drop"), 
  fileList = document.getElementById("file-list");

  function uploadFile(file) {
    var li = document.createElement("li"), 
    div = document.createElement("div"), 
    img, 
    progressBarContainer = document.createElement("div"), 
    progressBar = document.createElement("div"), 
    reader, 
    xhr, 
    fileInfo;

    li.appendChild(div);

    progressBarContainer.className = "progress-bar-container";
    progressBar.className = "progress-bar";
    progressBarContainer.appendChild(progressBar);
    li.appendChild(progressBarContainer);

    /*
     파일이 이미지고 브라우저엔진이 FileReader를 지원하면 file_list에 
     미리보기 이미지가 보여진다.
     */
    if ( typeof FileReader !== "undefined" && (/image/i).test(file.type)) {
      img = document.createElement("img");
      li.appendChild(img);
      reader = new FileReader();
      reader.onload = ( function(theImg) {
          return function(evt) {
            theImg.src = evt.target.result;
          };
        }(img));
      reader.readAsDataURL(file);
    }

    // Firefox, Google Chrome 과 Safari 지원
    xhr = new XMLHttpRequest();

    // progress bar 진행 
    xhr.upload.addEventListener("progress", function(evt) {
      if (evt.lengthComputable) {
        progressBar.style.width = (evt.loaded / evt.total) * 100 + "%";
      } else {
        // 
      }
    }, false);

    // 업로드 완료
    xhr.addEventListener("load", function() {
      progressBarContainer.className += " uploaded";
      progressBar.innerHTML = "Uploaded!";
    }, false);

    xhr.open("post", "/upload", true);

    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.setRequestHeader("X-File-Name", file.name);
    xhr.setRequestHeader("X-File-Size", file.size);
    xhr.setRequestHeader("X-File-Type", file.type);

    // 파일 전송 (doh)
    xhr.send(file);

    // 파일 정보 표시
    fileInfo = "<div><strong>Name:</strong> " + file.name + "</div>";
    fileInfo += "<div><strong>Size:</strong> " + parseInt(file.size / 1024, 10) + " kb</div>";
    fileInfo += "<div><strong>Type:</strong> " + file.type + "</div>";
    div.innerHTML = fileInfo;

    fileList.appendChild(li);
  }

  function traverseFiles(files) {
    if ( typeof files !== "undefined") {
      for (var i = 0, l = files.length; i < l; i++) {
        uploadFile(files[i]);
      }
    } else {
      fileList.innerHTML = "브라우저가 File API 를 지원하지 않습니다.";
    }
  }


  filesUpload.addEventListener("change", function() {
    traverseFiles(this.files);
  }, false);

  dropArea.addEventListener("dragleave", function(evt) {
    var target = evt.target;

    if (target && target === dropArea) {
      this.className = "";
    }
    evt.preventDefault();
    evt.stopPropagation();
  }, false);

  dropArea.addEventListener("dragenter", function(evt) {
    this.className = "over";
    evt.preventDefault();
    evt.stopPropagation();
  }, false);

  dropArea.addEventListener("dragover", function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }, false);

  dropArea.addEventListener("drop", function(evt) {
    traverseFiles(evt.dataTransfer.files);
    this.className = "";
    evt.preventDefault();
    evt.stopPropagation();
  }, false);
}; 