/**
 * UI 数据渲染与条形进度条控制
 */
function setBar(san_num, san_max, act, pass, level, username, useruid) {
    const format = (n) => String(n).padStart(2, '0');

    document.getElementById('sanity-num').textContent = format(san_num);
    document.getElementById('act-num').textContent = format(act);
    document.getElementById('pass-num').textContent = format(pass);
    document.getElementById('level-num').textContent = format(level);
    document.getElementById('sanity-max').textContent = format(san_max);

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
    copyToClipboard(currentAuthUrl);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotice("链接已复制到剪贴板！")
        ;}).catch(err => {
        console.error('Copy Failed:', err);
        showNotice("复制失败......");
    });
}

function handleLogout() {
    document.getElementById('tips-modal').style.display = 'flex';
    document.getElementById('tips-modal').innerHTML = `
            <div class="modal-content" style="width: 400px;">
                <div class="modal-header" style="padding: 15px 25px;">
                    <span class="modal-title">操作确认 | CONFIRM</span>
                </div>
                <div class="modal-body" style="padding: 25px; font-size: 16px; color: #686868;">
                    <p style="color:#e74c3c; font-size: 25px; margin-top:5px;">是否确认登出？</p>
                    <p style="font-size: 16px; margin-top:-10px;">注意，此操作仅清理本地凭证。如果你使用授权登入，则登出不会清除你的授权信息。</p>
                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                        <button id="confirm-logout" class="logout-btn" onclick="confirmLogout()" style="letter-spacing:30px; text-indent: 30px;">确认</button>
                        <button id="cancel-logout" class="logout-btn" onclick="cancelLogout()" style="letter-spacing:30px; text-indent: 30px;">取消</button>
                    </div>
                </div>
            </div>`;
}
function confirmLogout() {
    auth.logout();
    document.getElementById('tips-modal').style.display = 'none';
    renderModal();
    setBar(0, 1, 0, 0, 0, 'UserNotFound', '0000000000');
    document.getElementById('usericon').src = 'assets/image/noneuser.png';
}
function cancelLogout() { document.getElementById('tips-modal').style.display = 'none'; }

function showNotice(text) {
    const notice = document.getElementById('notice-stage');
    const msg = document.getElementById('notice-msg');

    if (!notice || !msg) return;
    msg.innerText = text;
    notice.classList.remove('notice-active');
    void notice.offsetWidth; 
    notice.classList.add('notice-active');
}

function rebootTerminal() {
    showNotice("正在重启终端......");
    setTimeout(() => {location.reload();}, 1000);
}