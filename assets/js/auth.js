/**
 * EndfieldAuth 插件 - 纯净扫码版
 */
class EndfieldAuth {
    constructor(config) {
        this.baseUrl = config.baseUrl || 'https://end-api.shallow.ink';
        this.onStatusChange = config.onStatusChange || (() => {});
        this.onDataUpdate = config.onDataUpdate || (() => {});
        
        this.state = {
            anonToken: null,
            frameworkToken: localStorage.getItem('endfield_f_token'),
            isLoggedIn: false
        };
    }

    // 1. 系统初始化
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

            // 如果本地有历史凭据，尝试直接同步
            if (this.state.frameworkToken) {
                this.refreshData();
            } else {
                this.onStatusChange("AWAITING_LOGIN");
            }
        } catch (err) {
            this.onStatusChange("API_ERROR");
            console.error("Auth Init Failed:", err);
        }
    }

    // 2. 抓取最新游戏数据
    async refreshData() {
        if (!this.state.frameworkToken) return;
        try {
            const res = await fetch(`${this.baseUrl}/api/endfield/note`, {
                headers: { 
                    'X-Anonymous-Token': this.state.anonToken,
                    'X-Framework-Token': this.state.frameworkToken 
                }
            });
            const result = await res.json();

            if (result.code === 0) {
                this.state.isLoggedIn = true;
                // 核心修复：先喂数据再改状态，确保 UI 渲染时能读到最新 DOM
                if (this.onDataUpdate) this.onDataUpdate(result.data);
                this.onStatusChange("ACTIVE");
            } else {
                this.logout(); // Token 失效则登出
            }
        } catch (err) {
            this.onStatusChange("SYNC_ERROR");
        }
    }

    // 3. 获取登录二维码
    async getQRCode() {
        try {
            const res = await fetch(`${this.baseUrl}/login/endfield/qr`, {
                headers: { 'X-Anonymous-Token': this.state.anonToken }
            });
            const result = await res.json();
            this._startPolling(result.data.framework_token);
            return result.data.qrcode;
        } catch (err) {
            this.onStatusChange("QR_ERROR");
        }
    }

    // 4. 注销登录
    logout() {
        localStorage.removeItem('endfield_f_token');
        this.state.frameworkToken = null;
        this.state.isLoggedIn = false;
        this.onStatusChange("AWAITING_LOGIN");
    }

    // --- 私有方法 ---
    _startPolling(fToken) {
        const timer = setInterval(async () => {
            const res = await fetch(`${this.baseUrl}/login/endfield/qr/status?framework_token=${fToken}`, {
                headers: { 'X-Anonymous-Token': this.state.anonToken }
            });
            const result = await res.json();

            if (result.data.status === 'done') {
                clearInterval(timer);
                this.state.frameworkToken = fToken;
                localStorage.setItem('endfield_f_token', fToken);
                this.refreshData();
            } else if (result.data.status === 'expired') {
                clearInterval(timer);
                this.onStatusChange("QR_EXPIRED");
            }
        }, 2000);
    }

    _generateFingerprint() {
        const canvas = document.createElement('canvas');
        return btoa(navigator.userAgent + screen.width + canvas.toDataURL()).substring(0, 32);
    }
}