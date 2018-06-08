var targetImage = $(".content img");
var img = targetImage['0'];
var content = document.getElementsByClassName('content')[0];
var points = [];
var myCanvas = $("#myCanvas");
var canvas = myCanvas['0'];

myCanvas.click(function (e) {
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
});


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
    ctx.beginPath();
    ctx.drawImage(img,0,0,img.width,img.height);
    ctx.fillStyle = '#FF0000';
    if (points.length>0){
        ctx.moveTo(points[0].x * canvas.width, points[0].y * canvas.height); //起始位置  
        points.forEach((point,idx) => {
            if (idx!=0){
                ctx.lineTo(point.x * canvas.width, point.y * canvas.height); //停止位置  
            }
        });
        ctx.stroke();
    }
}