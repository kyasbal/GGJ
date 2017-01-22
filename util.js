function Util() {

}

Util.prototype.itemFreq = function (obj) {
    for (var key in obj) {
        console.log(key);
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
