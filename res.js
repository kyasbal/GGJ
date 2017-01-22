const data = window.location.search;
window.onload = function() {
    data.substr(1).split("&").forEach(function(v) {
        const w = v.split('=');
        var p;
        if ((p = document.getElementById("count-" + w[0])) !== null) {
            p.innerHTML = w[1];
        };
        if (w[0] === "hina") {
            const imageList = document.getElementsByClassName('seagull');
            for (var i = 0; i < w[1]; i++) {
                imageList[i].style.visibility = 'visible';
            }
        }
    });
}