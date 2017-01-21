function ItemManager() {
    this.items = [];
    this.weights = [];
    this.waitZ = 100;
}
ItemManager.prototype.clear = function () {
    this.items = [];
    this.weights = [];
}
ItemManager.prototype.register = function (item, weight) {
    this.weights.push({ name: item, w: weight });
    for (var j = 0; j < 10; j++) {
        this.addInstance(item);
    }
}
ItemManager.prototype.addInstance = function (name) {
    const itemContainer = gr("#sea")(".item-container").first();
    var node = itemContainer.addChildByName(name, {
        position: [0, 0, this.waitZ]
    });
    node.on("reset", () => {
        node.setAttribute("position", [0, 0, this.waitZ]);
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
    this.set(targetName, Math.random() * 40 - 20);
}

ItemManager.prototype.set = function (itemName, x) {
    const camera = gr("#sea")("#main-camera").first();
    const pos = camera.getAttribute("position");
    const far = camera.getAttribute("far");
    var inst;
    for (var i = 0; i < this.items.length; i++) {
        var target = this.items[i];
        var targetPos = target.getAttribute("position");

        if (targetPos.Z > this.waitZ / 2 && target.name.name === itemName) {
            inst = target;
            break;
        } else if (i === this.items.length - 1) {
            inst = this.addInstance(itemName);
        }
    }
    inst.setAttribute("position", [x ? x : 0, 3, pos.Z - far - 10]);
}
