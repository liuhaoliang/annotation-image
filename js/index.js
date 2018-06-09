var img = document.getElementById('targetImage');
var content = document.getElementsByClassName('content')[0];
var points = [];
var canvas = document.getElementById('myCanvas');
var undo = document.getElementById('undo');

canvas.onclick=function(e) {
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

undo.onclick=function(e) {
    if (points.length>0){
        points.pop();
        draw(points);
    }
};




if (img.height==0){
    targetImage.load(function(s){
        draw([])
    });
}else{
    draw([])
}

function draw(points) {

    canvas.style.left = (content.clientWidth-targetImage.width)*0.5+'px';
    canvas.style.top = (content.clientHeight-targetImage.height)*0.5+'px';

    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    // ctx.beginPath();
    ctx.drawImage(img,0,0,img.width,img.height);
    ctx.fillStyle = 'cyan';
    ctx.strokeStyle = 'red';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    var radius = 3;
    // ctx.save();
    if (points.length>0){
        var arcX = points[0].x * canvas.width;
        var arcY = points[0].y * canvas.height;
        ctx.strokeStyle = 'cyan';
        ctx.arc(arcX, arcY, radius, 0, 2*Math.PI, false);
        ctx.fill();

        points.forEach((point,idx) => {
            if (idx!=0){
                // ctx.beginPath();
                var nextArcX = point.x * canvas.width;
                var nextArcY = point.y * canvas.height;
                var lastArcX = points[idx-1].x*canvas.width;
                var lastArcY = points[idx-1].y*canvas.height;
                ctx.restore();
                ctx.moveTo(lastArcX,lastArcY)

                ctx.lineTo(nextArcX, nextArcY); //停止位置  
                
                //再描一次上次的点
                ctx.beginPath();
                ctx.arc(lastArcX, lastArcY, radius, 0, 2*Math.PI, false);
                ctx.arc(nextArcX, nextArcY, radius, 0, 2*Math.PI, false);

                ctx.fill();
                ctx.stroke();
            }
        });
    }
}