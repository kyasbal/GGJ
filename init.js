const sound = new Howl({
    src: ['./audio/wind.mp3'],
    loop: true,
    volume: 0.5
});var manager;
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
     manager= new ItemManager();
    manager.register("apple");
    manager.register("gull");
    setTimeout(putNew,3000);
});

function putNew(){
  const rnd = Math.random();
  manager.set(Math.random() < 0.5 ?"apple":"gull");
  setTimeout(
    putNew,
  rnd * 2000);
}

var waitZ = 100;

function ItemManager(name) {
    this.name = name;
    this.items = [];
    this.$$ = gr("#sea");
}
ItemManager.prototype.register = function (item) {
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
