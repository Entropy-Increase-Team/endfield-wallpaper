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
        document.getElementById('box0').classList.remove('box0ad3');
    }
    if (adapt == 2) {
        document.getElementById('box0').classList.add('box0ad2');
        document.getElementById('box0').classList.remove('box0ad3');
    }
    if (adapt == 3) {
        document.getElementById('box0').classList.remove('box0ad2');
        document.getElementById('box0').classList.add('box0ad3');
    }
}

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


async function loadDBsetting() {
    try {
        const [savedQuality, savedAdapt, savedIsDark] = await Promise.all([
            dbStore.get(DB_KEYS.QUALITY),
            dbStore.get(DB_KEYS.ADAPT),
            dbStore.get(DB_KEYS.IS_DARK)
        ]);

        if (savedQuality !== null) {
            setquality(savedQuality);
        }
        if (savedAdapt !== null) {
            setadapt(savedAdapt);
        }
        if (savedIsDark !== null) {
            darkmode = savedIsDark;
            changemode(savedIsDark);
        }
    } catch (e) {}
}