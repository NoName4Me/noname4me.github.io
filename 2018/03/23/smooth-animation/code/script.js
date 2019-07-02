(function () {
    function query(s) {
        return document.querySelector(s);
    }
    var element = query('#element'),
        initPos = {
            x: 0,
            y: 0
        };

    function stopEvent(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        e.preventDefault();
        //e.returnValue = false;
    }
    element.addEventListener('mousedown', mouseDown);
    var dragOffset = {
        x: 0,
        y: 0
    };

    function updateDragPos(e) {
        dragOffset.x = e.clientX;
        dragOffset.y = e.clientY;
    }

    function mouseDown(e) {
        updateDragPos(e);
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
        // stopEvent(e);
    }

    // random 0ms ~ 30ms
    function delay() {
        let start = +new Date;
        let factor = Math.random(10);
        for (let i = 0; i < factor * 400; i++) {
            for (let j = 0; j < 100000; j++) {

            }
        }
        console.log(+new Date - start);
    }

    function moveTarget() {
        element.style.left = initPos.x + 'px';
        element.style.top = initPos.y + 'px';
        scheduledAnimationFrame = false;
        requestAnimationFrame(moveTarget);
    }
    var scheduledAnimationFrame = false;
    function mouseMove(e) {
        
        // 阻止同一帧内多次触发回掉
        if (scheduledAnimationFrame) {
            return;
        }
        scheduledAnimationFrame = true;
        requestAnimationFrame(moveTarget);

        //
        var deltaX = e.clientX - dragOffset.x;
        var deltaY = e.clientY - dragOffset.y;
        updateDragPos(e);
        initPos.x += deltaX;
        initPos.y += deltaY;
        // element.style.left = initPos.x + 'px';
        // element.style.top = initPos.y + 'px';
        // delay();
        
        // stopEvent(e);
    }

    function mouseUp(e) {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    }
})();