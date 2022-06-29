window.onload = function () {
    let content = document.getElementsByClassName('content')[0]
    let wrapper = document.getElementsByClassName('wrapper')[0]
    let radius = document.getElementsByClassName('radius')[0]
    let prev = document.getElementsByClassName('prev')[0]
    let next = document.getElementsByClassName('next')[0]
    let swiperText = document.getElementsByClassName('swiperTitle')[0]
    let imgs = document.querySelectorAll(".swiper>.content>.wrapper li img")
    //获取一个图片的宽度
    let imgWidth = wrapper.children[0].offsetWidth
    // 当前轮播到第几个图片
    let wrapIndex = 0
    //轮播的过渡动画定时器
    var timer = null
    //悬停显隐
    content.onmouseover = function () {
        clearInterval(timer)
        next.style.opacity = "1";
        prev.style.opacity = "1";
    }
    content.onmouseout = function () {
        timer = setInterval(function () {
            next.onclick()
        }, 3500)
        next.style.opacity = "0";
        prev.style.opacity = "0";
    }


    //动态创建圆点指示器
    function createLi() {
        for (let i = 0; i < wrapper.children.length - 1; i++) {
            let li = document.createElement("li")
            radius.appendChild(li)
        }
        radius.children[0].className = 'radius-active'
    }
    createLi()

    //指示器响应
    function cirAction(wrapIndex) {
        //每次进来先消除所有的小圆点
        for (let i = 0; i < radius.children.length; i++) {
            radius.children[i].classList.remove("radius-active")
        }
        //如果当前轮播位置和我们图片最后一个图片位置相等 那么说明一轮已经完毕
        //更新小圆点到第一个
        if (wrapIndex === wrapper.children.length - 1) {
            radius.children[0].className = 'radius-active'
        }
        //渲染当前小圆点的位置
        else {
            radius.children[wrapIndex].className = 'radius-active'
        }
    }

    //指示器控制
    function cirMouse() {
        for (let i = 0; i < radius.children.length; i++) {
            radius.children[i].onmouseover = function () {
                clearInterval(timer);
                //计算出每个小圆点代表的偏移距离 传到动画函数里
                console.log(-i * imgWidth);
                // animate(wrapper, -i * imgWidth);
                //更新当前的图片轮播位置
                wrapper.style.left = -i * imgWidth + 'px'
                swiperText.innerHTML = ""
                swiperText.innerHTML = swiperTextlist[i]
                wrapIndex = i;
                //渲染小圆点
                cirAction(wrapIndex)
            }
        }
    }
    cirMouse()
    //滑动动画

    /*
    前进意味着 整体向后偏移 所以偏移量必须时一个负值
    后退意味着 整体向前偏移 所以偏移量必须是一个正值

    每次计算出剩余距离绝对值 当这个值小于单次移动的距离时 说明移动完毕 那就直接停止动画

    */
    function animate(el, target) {
        clearInterval(el.timer)
        el.timer = setInterval(function () {
            //每次定时器的一次将要偏移的距离
            let move = 20;
            //因为此时wrapper是相对于conten
            //所以此时时得到的是wrapper基于content的偏移距离
            let present = wrapper.offsetLeft;
            //判断是回退还是前进 
            move = present > target ? -move : move;
            //累加上上一次的偏移距离 然后在本次中将距离渲染出来
            present += move;
            // console.log(present, target, move);
            if (Math.abs(present - target) > Math.abs(move)) {
                wrapper.style.left = present + 'px'
            }
            else {
                clearInterval(el.timer);
                wrapper.style.left = target + 'px'

            }
        }, 5)
    }
    //创建swiperTitle数据
    let swiperTextlist = []
    for (let i = 0; i < imgs.length; i++) {
        swiperTextlist.push(imgs[i].alt)
    }
    function title() {
        swiperText.innerHTML = ""
        swiperText.innerHTML = swiperTextlist[wrapIndex]
    }

    //next控制
    next.onclick = function () {
        if (wrapIndex === wrapper.children.length - 1) {
            wrapIndex = 0;
            wrapper.style.left = 0 + 'px';
        }
        wrapIndex++;
        title()
        animate(wrapper, -wrapIndex * imgWidth);
        cirAction(wrapIndex);

    }

    //prev控制
    prev.onclick = function () {
        if (wrapIndex === 0) {
            wrapIndex = wrapper.children.length - 1;
            wrapper.style.left = -wrapIndex * imgWidth + 'px';
        }

        wrapIndex--;
        title()
        animate(wrapper, -wrapIndex * imgWidth);
        cirAction(wrapIndex)

    }

    //自动滑动
    var timer = setInterval(function () {
        next.onclick()
    }, 2500)
}
