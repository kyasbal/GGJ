function Util() {

}

Util.prototype.animate = function (begin, end, duration, func, endCallback) { //TODO:fix
    var d = (end - begin);
    const span = 1000 / 60;
    var count = Math.floor(duration / span);
    var dd = d / count;
    // console.log(d, count);
    var v = begin;
    var f = function () {
        func(v);
        v += dd;
        count--;
        if (count > 0) {
            setTimeout(f, span);
        } else if (endCallback) {
            endCallback();
        }
    }
    f();
}


Util.prototype.itemFreq = function (obj) {
    for (var key in obj) {
        // console.log(key);
        const changes = obj[key];
        GM.addTimetable(key, function () {
            for (var name in changes) {
                console.log(`change:${name} to ${changes[name]}`);
                GM.itemManager.setWeight(name, changes[name]);
            }
        });
    }
}

// ******** example: *******
// Util.itemFreq({
//     20: {
//         kame: 100,
//         apple: 200
//     },
//     30: {
//         apple: 1
//     }
// })
const UT = new Util();
