const sound = new Howl({
    src: ['./audio/wind.mp3'],
    loop: true,
    volume: 0.5
});
gr(function () {
    const $$ = gr("#sea");
    const waveContainer = $$(".wave-container").get(0);
    const itemContainer = $$(".item-container").get(0);
    WAVES = [];
    ITEMS = [];
    for (let i = 0; i < 110; i++) {
        WAVES.push(waveContainer.addChildByName("wave-cube", {
            position: `${Math.random()*3},0,-${i}`,
            color: "#0084cf",
            offset: i,
            id: "wave-" + i
        }));
    }
    var manager = new ItemManager();
    manager.register("apple", 100);
    manager.register("gull", 100);

    setInterval(function () {
        console.log("asdasdasdasdasdasdasdasdasd");
        // manager.set("apple");
        // manager.set("gull");
        manager.randomPut()
    }, Math.random() * 1000);

});

var waitZ = 100;

function ItemManager(name) {
    this.name = name;
    this.items = [];
    this.weights = [];
    this.$$ = gr("#sea");
}
ItemManager.prototype.register = function (item, weight) {
    this.weights.push({ name: item, w: weight });
    for (var j = 0; j < 10; j++) {
        this.addInstance(item);
    }
}
ItemManager.prototype.addInstance = function (name) {
    const itemContainer = this.$$(".item-container").first();
    var node = itemContainer.addChildByName(name, {
        position: [0, 0, waitZ]
    });
    node.on("reset", () => {
        node.setAttribute("position", [0, 0, waitZ]);
    });
    this.items.push(node);
    return node;
}
ItemManager.prototype.randomPut = function () {
    var total = 0;
    this.weights.forEach(function (obj) {
        total += obj.w;
    });
    var k = Math.random() * total;
    var targetName;
    for (var i = 0; i < this.weights.length; i++) {
        if (this.weights[i].w > k) {
            targetName = this.weights[i].name;
            break;
        }
        k -= this.weights[i].w;
    }
    this.set(targetName);
}

ItemManager.prototype.set = function (itemName, x) {
    const camera = this.$$("#main-camera").first();
    const pos = camera.getAttribute("position");
    const far = camera.getAttribute("far");
    var inst;
    for (var i = 0; i < this.items.length; i++) {
        var target = this.items[i];
        var targetPos = target.getAttribute("position");

        if (targetPos.Z > waitZ / 2 && target.name.name === itemName) {
            inst = target;
            break;
        } else if (i === this.items.length - 1) {
            inst = this.addInstance(itemName);
        }
    }
    inst.setAttribute("position", [x ? x : 0, 3, pos.Z - far - 10]);
}
