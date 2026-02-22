window.wallpaperPropertyListener = {
    applyUserProperties: async function(properties) {
        if (properties.quality) {
            const val = properties.quality.value;
            setquality(val);
            await dbStore.set(DB_KEYS.QUALITY, val);
        }
        if (properties.api) {
            auth.setApi(properties.api.value);
        }
        if (properties.adapt) {
            const val = properties.adapt.value;
            setadapt(val);
            await dbStore.set(DB_KEYS.ADAPT, val);
        }
        if (properties.mode) {
            const isDark = (properties.mode.value == 2);
            darkmode = isDark;
            changemode(isDark);
            await dbStore.set(DB_KEYS.IS_DARK, isDark);
        }
    },
};