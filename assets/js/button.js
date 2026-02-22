let pause = false;
document.getElementById("button2stage").addEventListener('click', () => {

    const v1 = document.getElementById('video1');
    const v0 = document.getElementById('kanrinin');
    const logo = document.getElementById('button20');
    if (pause == false) {
        showNotice("已暂停所有动画播放");
        v1.pause();
        v0.pause();
        logo.src = 'assets/image/button21.png';
        document.getElementById("image0").classList.add("pause");
        document.getElementById("image00").classList.add("pause");
        pause = true;
    } else {
        showNotice("已恢复所有动画播放");
        v1.play();
        v0.play();
        logo.src = 'assets/image/button20.png';
        document.getElementById("image0").classList.remove("pause");
        document.getElementById("image00").classList.remove("pause");
        pause = false;
    }
});

let darkmode = false;
document.getElementById("button1").addEventListener('click', () => {
    if (!darkmode) {
        showNotice("已切换到 深色模式 ");
        darkmode = true;
        changemode(true);
    } else{
        showNotice("已切换到 浅色模式 ");
        darkmode = false;
        changemode(false);
    }
});