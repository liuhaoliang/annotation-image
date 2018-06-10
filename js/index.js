var imgs = [];
var points = [];

var img = document.getElementById('targetImage');
var content = document.getElementsByClassName('content')[0];
var canvas = document.getElementById('myCanvas');

var openFile = document.getElementById('openFile');
var openDir = document.getElementById('openDir');
var next = document.getElementById('next');
var prev = document.getElementById('prev');
var save = document.getElementById('save');

next
var undo = document.getElementById('undo');
var clear = document.getElementById('clear');
//设置接头半径
var radius = 4;
//设置线宽
var lineWidth = 2;
//设置误差范围
var eviation = 0.001;

canvas.onclick = function (e) {
    var offsetX = e.offsetX;
    var offsetY = e.offsetY;
    var image = e.target;
    var width = image.width;
    var height = image.height;
    var scaleX = offsetX / width;
    var scaleY = offsetY / height;

    points.forEach((point, idx) => {
        var s = Math.pow((point.x - scaleX), 2) + Math.pow((point.y - scaleY), 2);
        if (s < eviation) {
            scaleX = point.x;
            scaleY = point.y;
        }
    });

    points.push({
        x: scaleX,
        y: scaleY
    })
    draw(points);
};



//选择文件操作
openFile.onclick = function (e) {
    var inputObj = document.createElement('input')
    inputObj.setAttribute('type', 'file');
    inputObj.setAttribute('multiple', 'true');
    inputObj.setAttribute('accept', 'image/png, image/jpeg, image/jpg');
    inputObj.setAttribute("style", 'visibility:hidden');

    document.body.appendChild(inputObj);
    var imgs = [];
    inputObj.onchange = function (e) {
        readFiles(inputObj.files);
    };
    inputObj.click();
};

openDir.onclick = function (e) {
    var inputObj = document.createElement('input')
    inputObj.setAttribute('type', 'file');
    inputObj.setAttribute('webkitdirectory', 'true');
    inputObj.setAttribute('directory', 'true');
    inputObj.setAttribute("style", 'visibility:hidden');
    document.body.appendChild(inputObj);
    var imgs = [];
    inputObj.onchange = function (e) {
        readFiles(inputObj.files);
    };
    inputObj.click();
};

let readFiles = function(files){
    for (let key in files) {
        let file = files[key];
        if (typeof file == 'object' && /\.(jpe?g|png)$/i.test(file.name)){
            let reader = new FileReader();
            reader.onload = function (e) {
                let imgFile = {
                    name: file.name,
                    src: e.target.result
                };
                imgs.push(imgFile);
                console.log('++++++' + JSON.stringify(imgFile));
            }
            reader.readAsDataURL(file);
        } 
    }
}

next.onclick = function (e) {

};

prev.onclick = function (e) {

};

save.onclick = function (e) {

};

//撤销操作
undo.onclick = function (e) {
    if (points.length > 0) {
        points.pop();
        draw(points);
    }
};

//删除操作
clear.onclick = function (e) {
    points.splice(0, points.length);
    draw(points);
};

if (img.height == 0) {
    targetImage.load(function (s) {
        draw([])
    });
} else {
    draw([])
}

function draw(points) {
    canvas.style.left = (content.clientWidth - targetImage.width) * 0.5 + 'px';
    canvas.style.top = (content.clientHeight - targetImage.height) * 0.5 + 'px';
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.fillStyle = 'cyan';
    ctx.strokeStyle = 'red';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    if (points.length > 0) {
        var arcX = points[0].x * canvas.width;
        var arcY = points[0].y * canvas.height;
        ctx.moveTo(arcX, arcY);
        points.forEach((point, idx) => {
            if (idx != 0) {
                var nextArcX = point.x * canvas.width;
                var nextArcY = point.y * canvas.height;
                ctx.lineTo(nextArcX, nextArcY);
            }
        });
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(arcX, arcY, radius, 0, 2 * Math.PI, false);
        ctx.fill();
        points.forEach((point, idx) => {
            if (idx != 0) {
                ctx.beginPath();
                var nextArcX = point.x * canvas.width;
                var nextArcY = point.y * canvas.height;
                ctx.arc(nextArcX, nextArcY, radius, 0, 2 * Math.PI, false);
                ctx.fill();
            }
        });
    }
}