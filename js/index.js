var img = document.getElementById('targetImage');
var content = document.getElementsByClassName('content')[0];
var points = [];
var canvas = document.getElementById('myCanvas');
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
        var s = Math.pow((point.x-scaleX),2)+Math.pow((point.y-scaleY),2);
        console.log('+++++'+s)
        if (s<0.001) {
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

//撤销操作
undo.onclick = function (e) {
    if (points.length > 0) {
        points.pop();
        draw(points);
    }
};

//删除操作
clear.onclick = function (e) {
    points.splice(0,points.length);
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