function setquality(quality) {
    if (quality == 3) {
        document.getElementById('video1-src').src = 'assets/video/video1_4k.webm';
        document.getElementById('video1').load();

        document.getElementById('kanrinin-src').src = 'assets/video/kanrinin_4k.webm';
        document.getElementById('kanrinin').load();

        document.getElementById('infoboard').classList.remove('lowblur');
        document.getElementById('infoboard').classList.add('highblur');
    }
    else if (quality == 1) {
        document.getElementById('video1-src').src = 'assets/video/video1_1k.webm';
        document.getElementById('video1').load();

        document.getElementById('kanrinin-src').src = 'assets/video/kanrinin_1k.webm';
        document.getElementById('kanrinin').load();

        document.getElementById('infoboard').classList.remove('highblur');
        document.getElementById('infoboard').classList.remove('lowblur');
    }
    else {
        document.getElementById('video1-src').src = 'assets/video/video1_2k.webm';
        document.getElementById('video1').load();

        document.getElementById('kanrinin-src').src = 'assets/video/kanrinin_2k.webm';
        document.getElementById('kanrinin').load();

        document.getElementById('infoboard').classList.remove('highblur');
        document.getElementById('infoboard').classList.add('lowblur');
    }
}

function setadapt(adapt) {
    if (adapt == 1) {
        document.getElementById('box0').classList.remove('box0ad2');
    }
    if (adapt == 2) {
        document.getElementById('box0').classList.add('box0ad2');
    }
    if (adapt == 3) {
        document.getElementById('box0').classList.remove('box0ad2');
    }
}