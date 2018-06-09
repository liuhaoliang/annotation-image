var img = document.getElementById('targetImage');
var content = document.getElementsByClassName('content')[0];
var points = [];
var canvas = document.getElementById('myCanvas');
var undo = document.getElementById('undo');

canvas.onclick = function (e) {
    var offsetX = e.offsetX;
    var offsetY = e.offsetY;
    var image = e.target;
    var width = image.width;
    var height = image.height;
    var scaleX = offsetX / width;
    var scaleY = offsetY / height;
    points.push({
        x: scaleX,
        y: scaleY
    })
    draw(points);
};

undo.onclick = function (e) {
    if (points.length > 0) {
        points.pop();
        draw(points);
    }
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
    ctx.lineWidth = 2;
    var radius = 4;
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