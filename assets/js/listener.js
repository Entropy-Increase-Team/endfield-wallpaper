window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.quality) {
            setquality(properties.quality.value);
        }
        if (properties.api) {
            auth.setApi(properties.api.value);
        }
    },
};