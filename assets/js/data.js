/**
 * UI 数据渲染与条形进度条控制
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
    updateFill('passion-fill', Math.min(pass, 60), 60); 
    updateFill('level-fill', level, 60);
}

const modal = document.getElementById('login-modal');
const modalBody = document.getElementById('modal-body');
let currentAuthUrl = ""; // 全局变量，用于存储生成的授权链接

async function renderModal() {
    if (!auth.state.anonToken) {
        modalBody.innerHTML = '<div class="loading">正在关闭全舰防御系统......</div>';
        return;
    }

    // 状态 1: 已登录
    if (auth.state.isLoggedIn) {
        const name = document.getElementById('username').innerText;
        const uid = document.getElementById('useruid').innerText;
        modalBody.innerHTML = `
            <div class="account-info">
                <div class="label" style="color:#fffa00;font-size:25px;margin-top:5px;">壁纸终端:登录成功</div>
                <div class="label">用户名</div>
                <div class="value">${name}</div>
                <div class="label">UID</div>
                <div class="value">${uid}</div>
            </div>
            <button class="logout-btn" style="margin-top:20px;" onclick="handleLogout()">登出</button>
        `;
    } 
    // 状态 2: 选择登录方式
    else {
        modalBody.innerHTML = `
            <div class="auth-options" style="display: flex; gap: 20px; text-align: left;">
                <div style="flex: 1; border-right: 3px solid #333; padding-right: 20px;">
                    <div class="label" style="margin-top:0px; margin-bottom:10px">方法一：森空岛扫码</div>
                    <div id="qr-container" style="background:#fff; padding:5px; width:150px; height:150px; border-radius:10px; display:flex; align-items:center; justify-content:center;">
                        <img id="modal-qr-img" style="display:none; width:120px; height:120px;">
                        <span id="qr-loading" style="color:#000; font-size:20px;">LOADING...</span>
                    </div>
                </div>
                <div style="flex: 1;">
                    <div class="label" style="margin-top:0px; margin-bottom:10px">方法二：远程授权</div>
                    <p style="font-size:15px; color:#666;">填写你的终末地协议终端API，申请长期有效凭证。</p>
                    <button id="remote-init-btn" class="primary-btn" 
                            style="width:100%; padding:12px; background:#fffa00; border:none; border-radius:10px; font-size:16px; cursor:pointer; font-family: AlimamaShuHeiTi-Bold;" 
                            onclick="handleRemoteAuth()">申请授权</button>
                    
                    <div id="remote-link-area" style="display:none; margin-top:10px; border:2px dashed #fffa00; border-radius:10px; padding:10px; text-align:center;">
                        <a id="auth-target-url" href="javascript:void(0)" 
                           style="color:#fffa00; font-size:18px; text-decoration:none;" 
                           onclick="copyAuthUrl()">点击以复制授权链接</a>
                        <div id="copy-status" style="font-size:12px; color:#fffa00; margin-top:5px;">AWAITING_INIT...</div>
                    </div>
                </div>
            </div>
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

/**
 * 处理远程授权初始化
 */
async function handleRemoteAuth() {
    const btn = document.getElementById('remote-init-btn');
    const area = document.getElementById('remote-link-area');
    const status = document.getElementById('copy-status');
    
    btn.style.display = 'none';
    area.style.display = 'block';
    status.innerText = "GENERATING_LINK...";
    
    const url = await auth.createAuthRequest(); // 调用 auth.js 的授权申请接口
    if (url) {
        currentAuthUrl = url;
        status.innerText = "READY_CLICK_TO_COPY";
    } else {
        status.innerText = "GENERATE_FAILED";
        btn.style.display = 'block';
    }
}

/**
 * 复制到剪贴板函数
 */
function copyAuthUrl() {
    if (!currentAuthUrl) return;

    navigator.clipboard.writeText(currentAuthUrl).then(() => {
        const status = document.getElementById('copy-status');
        const link = document.getElementById('auth-target-url');
        
        // 成功反馈
        const originalText = link.innerText;
        link.innerText = "复制成功！请在浏览器打开";
        status.innerText = "PASTE_IN_BROWSER_TO_AUTHORIZE";
        
        setTimeout(() => {
            link.innerText = originalText;
            status.innerText = "PASTE_IN_BROWSER_TO_AUTHORIZE";
        }, 2000);
    }).catch(err => {
        console.error('Copy Failed:', err);
        document.getElementById('copy-status').innerText = "COPY_FAILED_PLEASE_MANUAL";
    });
}

function handleLogout() {
    auth.logout();
    modal.style.display = 'none';
    auth.refreshData();
}