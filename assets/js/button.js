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

function changemode(isdark){
    if (isdark){
        document.body.style.backgroundImage = "url('assets/image/background_d.png')";
        document.getElementById("clock").classList.add('dark');
        document.getElementById("date").classList.add('dark');
        document.getElementById("image0").src = 'assets/image/image0_d.png'
        document.getElementById("image00").src = 'assets/image/image0_d.png'
        document.getElementById("image3").src = 'assets/image/image3_d.png'
        document.getElementById("image6").src = 'assets/image/image6_d.png'
        document.getElementById("image7").src = 'assets/image/image7_d.png'
        document.getElementById("image8").src = 'assets/image/image8_d.png'
        document.getElementById("image9").src = 'assets/image/image9_d.png'
        document.getElementById("button0").src = 'assets/image/button0_d.png'
        document.getElementById("button1").src = 'assets/image/button1_d.png'
        document.getElementById("button2").src = 'assets/image/button2_d.png'
        document.getElementById("infoboard").src = 'assets/image/infoboard_d.png'
        document.getElementById("usercard").src = 'assets/image/usercard_d.png'
    } else{
        document.body.style.backgroundImage = "url('assets/image/background.png')";
        document.getElementById("clock").classList.remove('dark');
        document.getElementById("date").classList.remove('dark');
        document.getElementById("image0").src = 'assets/image/image0.png'
        document.getElementById("image00").src = 'assets/image/image0.png'
        document.getElementById("image3").src = 'assets/image/image3.png'
        document.getElementById("image6").src = 'assets/image/image6.png'
        document.getElementById("image7").src = 'assets/image/image7.png'
        document.getElementById("image8").src = 'assets/image/image8.png'
        document.getElementById("image9").src = 'assets/image/image9.png'
        document.getElementById("button0").src = 'assets/image/button0.png'
        document.getElementById("button1").src = 'assets/image/button1.png'
        document.getElementById("button2").src = 'assets/image/button2.png'
        document.getElementById("infoboard").src = 'assets/image/infoboard.png'
        document.getElementById("usercard").src = 'assets/image/usercard.png'
    }
}