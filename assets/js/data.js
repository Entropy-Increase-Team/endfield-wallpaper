/**
 * UI 数据渲染与弹窗控制
 */
function setBar(san_num, san_max, act, pass, level, username, useruid) {
    document.getElementById('sanity-num').textContent = san_num;
    document.getElementById('act-num').textContent = act;
    document.getElementById('pass-num').textContent = pass;
    document.getElementById('level-num').textContent = level;
    document.getElementById('sanity-max').textContent = san_max;
    document.getElementById('username').textContent = username;
    document.getElementById('useruid').textContent = useruid;

    const updateFill = (id, cur, max) => {
        let per = Math.max(0, Math.min(100, (cur / max) * 100));
        document.getElementById(id).style.width = per + '%';
    };

    updateFill('sanity-fill', san_num, san_max);
    updateFill('action-fill', act, 100);
    updateFill('passion-fill', Math.min(pass, 60), 60); // 映射通行证等级
    updateFill('level-fill', level, 60);
}

const modal = document.getElementById('login-modal');
const modalBody = document.getElementById('modal-body');

/**
 * 渲染弹窗内容
 */
async function renderModal() {
    if (!auth.state.anonToken) {
        modalBody.innerHTML = '<div class="loading">SYNCING_TERMINAL...</div>';
        return;
    }

    if (auth.state.isLoggedIn) {
        const name = document.getElementById('username').innerText;
        const uid = document.getElementById('useruid').innerText;
        
        modalBody.innerHTML = `
            <div class="account-info">
                <div class="label" style="color:#fffa00">OPERATOR_AUTHORIZED</div>
                <div class="label" style="margin-top:15px">Operator_Name</div>
                <div class="value">${name}</div>
                <div class="label" style="margin-top:10px">Operator_UID</div>
                <div class="value">${uid}</div>
            </div>
            <button class="logout-btn" style="margin-top:15px;" onclick="handleLogout()">TERMINATE_SESSION</button>
        `;
    } else {
        modalBody.innerHTML = `
            <div class="status">AWAITING_AUTH</div>
            <div id="qr-wrap" style="min-height:180px; display:flex; align-items:center; justify-content:center; background:#fff; margin:15px 0;">
                <img id="modal-qr-img" src="" alt="QR" style="display:none; width:180px; height:180px;">
                <span id="qr-loading" style="color:#000">GENERATING...</span>
            </div>
            <div class="label">SCAN_WITH_SKLAND_APP</div>
        `;
        
        const qrSrc = await auth.getQRCode();
        const qrImg = document.getElementById('modal-qr-img');
        if (qrImg) {
            qrImg.src = qrSrc;
            qrImg.style.display = 'block';
            document.getElementById('qr-loading').style.display = 'none';
        }
    }
}

function handleLogout() {
    if (confirm("是否确认断开终端连接？")) {
        auth.logout();
        modal.style.display = 'none';
        document.getElementById('username').innerText = "UserNotFound";
        document.getElementById('useruid').innerText = "0000000000";
    }
}