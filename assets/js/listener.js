window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.quality) {
            setquality(properties.quality.value);
        }
        if (properties.api) {
            auth.setApi(properties.api.value);
        }
        if (properties.adapt){
            setadapt(properties.adapt.value);
        }
        if (properties.mode){
            if (properties.mode.value == 2) {
                darkmode = true;
                changemode(true);
            }
        }
    },
};