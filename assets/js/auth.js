const dbStore = {
    dbName: "EndfieldTerminalDB",
    storeName: "auth_settings",

    _open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: "id" });
                }
            };
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    },

    async get(key) {
        const db = await this._open();
        return new Promise((resolve) => {
            const transaction = db.transaction([this.storeName], "readonly");
            const request = transaction.objectStore(this.storeName).get(key);
            request.onsuccess = () => resolve(request.result ? request.result.value : null);
            request.onerror = () => resolve(null);
        });
    },

    async set(key, value) {
        const db = await this._open();
        const transaction = db.transaction([this.storeName], "readwrite");
        transaction.objectStore(this.storeName).put({ id: key, value: value });
    },

    async delete(key) {
        const db = await this._open();
        const transaction = db.transaction([this.storeName], "readwrite");
        transaction.objectStore(this.storeName).delete(key);
    }
};

class EndfieldAuth {
    constructor(config) {
        this.baseUrl = config.baseUrl || 'https://end-api.shallow.ink';
        this.onStatusChange = config.onStatusChange || (() => {});
        this.onDataUpdate = config.onDataUpdate || (() => {});
        
        this.API_KEY = '0';
        this.STORAGE_KEY = 'endfield_f_token'; 
        this.API_STORAGE_KEY = 'endfield_saved_api';
        
        this.state = {
            anonToken: null,
            frameworkToken: null,
            isLoggedIn: false,
            loginType: null
        };
    }

    async setApi(api) {
        this.API_KEY = api;
        await dbStore.set(this.API_STORAGE_KEY, api); // 存入数据库
    }

    async init() {
        this.onStatusChange("INITIALIZING");
        try {
            // 1. 同时从 IndexedDB 获取 Token 和 API Key
            const [savedToken, savedApi] = await Promise.all([
                dbStore.get(this.STORAGE_KEY),
                dbStore.get(this.API_STORAGE_KEY)
            ]);

            this.state.frameworkToken = savedToken;
            if (savedApi) this.API_KEY = savedApi; // 恢复保存的 API

            // 2. 获取匿名令牌 (保持不变)
            const fingerprint = this._generateFingerprint();
            const res = await fetch(`${this.baseUrl}/api/v1/auth/anonymous-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fingerprint })
            });
            const result = await res.json();
            this.state.anonToken = result.data.token;

            // 3. 自动登录判定 (如果 API 还是 0，即便有 Token 也会报错，所以这里可以加个判定)
            if (this.state.frameworkToken && this.API_KEY !== '0') {
                await this.refreshData();
            } else {
                this.onStatusChange("AWAITING_LOGIN");
            }
        } catch (err) {
            this.onStatusChange("API_ERROR");
        }
    }

    // --- 模式 A: 远程授权请求 (Shared Token) ---
    async createAuthRequest() {
        if (this.API_KEY === 'Your Api Key' || this.API_KEY === '0') {
                document.getElementById('tips-modal').style.display = 'flex';
                document.getElementById('tips-modal').innerHTML = `
                        <div class="modal-content" style="width: 400px;">
                            <div class="modal-header" style="padding: 15px 25px;">
                                <span class="modal-title">错误 | ERROR</span>
                            </div>
                            <div class="modal-body" style="padding: 25px; font-size: 16px; color: #686868;">
                                <p style="color:#e74c3c; font-size: 25px; margin-top:5px;">API Key 未配置</p>
                                <p style="font-size: 16px; margin-top:-10px;">请在WallpaperEngine壁纸配置界面设置的API Key。获取API Key请前往 <a href="javascript:void(0)" style="color:#fffa00;" onclick="copyToClipboard('https://end.shallow.ink')";>终末地-协议终端</a> 申请</p>
                                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                                    <button id="confirm-logout" class="logout-btn" onclick="confirmLogout()" style="letter-spacing:30px; text-indent: 30px;">确定</button>
                                </div>
                            </div>
                        </div>`;
        } else {
            try {
            // 1. 获取操作系统名并生成 4 位随机码
            const os = this._getOSName();
            const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
            const terminalName = `${os}_${randomCode}`;

            const res = await fetch(`${this.baseUrl}/api/v1/authorization/requests`, {
                method: 'POST',
                headers: { 
                    'X-API-Key': this.API_KEY, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    client_id: `EFWP_${terminalName.toLowerCase()}`,
                    client_name: `终末地壁纸终端`, 
                    client_type: "app",
                    scopes: ["user_info", "game_data"]
                })
            });

            const result = await res.json();
            if (result.code === 0) {
                this._startRequestPolling(result.data.request_id);
                // 使用你确认的直连授权链接
                return `https://end.shallow.ink/authorize?request_id=${result.data.request_id}`;
            }
        } catch (e) { console.error("Auth Request Failed", e); }
        }
        return null;
    }

    /**
     * 辅助方法：仅识别操作系统
     */
    _getOSName() {
        const ua = navigator.userAgent;
        if (ua.indexOf("Win") !== -1) return "Windows";
        if (ua.indexOf("Mac") !== -1) return "macOS";
        if (ua.indexOf("Linux") !== -1) return "Linux";
        if (ua.indexOf("Android") !== -1) return "Android";
        if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) return "iOS";
        return "Unknown_OS";
    }

    // --- 模式 B: 扫码登录 (QR Code) ---
    async getQRCode() {
        try {
            const res = await fetch(`${this.baseUrl}/login/endfield/qr`, {
                headers: { 'X-Anonymous-Token': this.state.anonToken }
            });
            const result = await res.json();
            this._startQRPolling(result.data.framework_token);
            return result.data.qrcode;
        } catch (err) { this.onStatusChange("QR_ERROR"); }
    }

    async refreshData() {
        if (!this.state.frameworkToken) return;
        try {
            const res = await fetch(`${this.baseUrl}/api/endfield/note`, {
                headers: {
                    'X-Anonymous-Token': this.state.anonToken,
                    'X-API-Key': this.API_KEY,
                    'X-Framework-Token': this.state.frameworkToken
                }
            });
            const result = await res.json();
            if (result.code === 0) {
                this.state.isLoggedIn = true;
                if (this.onDataUpdate) this.onDataUpdate(result.data);
                this.onStatusChange("ACTIVE");
            } else {
                showNotice("登录认证失败，请重试");
            }
        } catch (e) { this.onStatusChange("SYNC_ERROR"); }
    }

    async logout() {
        await dbStore.delete(this.STORAGE_KEY);
        this.state.frameworkToken = null;
        this.state.isLoggedIn = false;
        this.onStatusChange("AWAITING_LOGIN");
    }

    // 轮询：远程授权
    _startRequestPolling(requestId) {
        const timer = setInterval(async () => {
            const res = await fetch(`${this.baseUrl}/api/v1/authorization/requests/${requestId}/status`, {
                headers: { 'X-API-Key': this.API_KEY }
            });
            const result = await res.json();
            if (result.data.status === 'approved' || result.data.status === 'used') {
                clearInterval(timer);
                this._completeLogin(result.data.framework_token, this.API_KEY, 'REMOTE');
            }
        }, 3000);
    }

    // 轮询：二维码
    _startQRPolling(fToken) {
        const timer = setInterval(async () => {
            const res = await fetch(`${this.baseUrl}/login/endfield/qr/status?framework_token=${fToken}`, {
                headers: { 'X-Anonymous-Token': this.state.anonToken }
            });
            const result = await res.json();
            if (result.data.status === 'done') {
                clearInterval(timer);
                this._completeLogin(fToken, 'null','QR');
            }
        }, 2000);
    }

    async _completeLogin(token, api, type) {
        this.state.frameworkToken = token;
        this.state.loginType = type;
        
        // 修正：将 api 存入对应的键名，且纠正 adStore 为 dbStore
        await Promise.all([
            dbStore.set(this.STORAGE_KEY, token),
            dbStore.set(this.API_STORAGE_KEY, api) 
        ]);
        
        await this.refreshData();
    }

    _generateFingerprint() {
        const canvas = document.createElement('canvas');
        return btoa(navigator.userAgent + screen.width + canvas.toDataURL()).substring(0, 32);
    }
}