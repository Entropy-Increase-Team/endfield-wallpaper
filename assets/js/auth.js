/**
 * EndfieldAuth - 综合鉴权版（支持 QR 与 远程授权）
 */
class EndfieldAuth {
    constructor(config) {
        this.baseUrl = config.baseUrl || 'https://end-api.shallow.ink';
        this.onStatusChange = config.onStatusChange || (() => {});
        this.onDataUpdate = config.onDataUpdate || (() => {});
        
        // 硬编码配置
        this.API_KEY = 'Your API Key Here'; // 替换为你的 API Key
        this.STORAGE_KEY = 'endfield_f_token'; 
        
        this.state = {
            anonToken: null,
            frameworkToken: localStorage.getItem(this.STORAGE_KEY),
            isLoggedIn: false,
            loginType: null // 'QR' 或 'REMOTE'
        };
    }

    async init() {
        this.onStatusChange("INITIALIZING");
        try {
            // 获取匿名令牌
            const fingerprint = this._generateFingerprint();
            const res = await fetch(`${this.baseUrl}/api/v1/auth/anonymous-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fingerprint })
            });
            const result = await res.json();
            this.state.anonToken = result.data.token;

            // 自动登录判定
            if (this.state.frameworkToken) {
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
                    // client_id 转为小写以符合 ID 规范，显示名保留大写
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
                this.logout();
            }
        } catch (e) { this.onStatusChange("SYNC_ERROR"); }
    }

    logout() {
        localStorage.removeItem(this.STORAGE_KEY);
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
                this._completeLogin(result.data.framework_token, 'REMOTE');
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
                this._completeLogin(fToken, 'QR');
            }
        }, 2000);
    }

    _completeLogin(token, type) {
        this.state.frameworkToken = token;
        this.state.loginType = type;
        localStorage.setItem(this.STORAGE_KEY, token);
        this.refreshData();
    }

    _generateFingerprint() {
        const canvas = document.createElement('canvas');
        return btoa(navigator.userAgent + screen.width + canvas.toDataURL()).substring(0, 32);
    }
}