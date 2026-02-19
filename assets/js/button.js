let pause = false;
document.getElementById("button2stage").addEventListener('click', () => {

    const v1 = document.getElementById('video1');
    const v0 = document.getElementById('kanrinin');
    const logo = document.getElementById('button20');
    if (pause == false) {
        v1.pause();
        v0.pause();
        logo.src = 'assets/image/button21.png';
        document.getElementById("image0").classList.add("pause");
        document.getElementById("image00").classList.add("pause");
        pause = true;
    } else {
        v1.play();
        v0.play();
        logo.src = 'assets/image/button20.png';
        document.getElementById("image0").classList.remove("pause");
        document.getElementById("image00").classList.remove("pause");
        pause = false;
    }
});