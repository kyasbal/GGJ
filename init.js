const sound = new Howl({
    src: ['./audio/wind.mp3'],
    loop: true,
    volume: 0.5
});
gr(function() {
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
    manager.register("apple");
    manager.register("gull");

    setInterval(function() {
        manager.set("apple");
        manager.set("gull");
    }, 100);

});

var waitZ = 100;

function ItemManager(name) {
    this.name = name;
    this.items = [];
    this.ITEMS = [];
    this.$$ = gr("#sea");
}
ItemManager.prototype.register = function(item) {
    this.items.push(item);
    var self = this;
    const itemContainer = this.$$(".item-container").first();
    for (var j = 0; j < 50; j++) {
        this.ITEMS.push({
            node: itemContainer.addChildByName(item, {
                position: [0, 0, waitZ],
                id: item + "-" + j
            }).on("reset", (e) => {
                const n = e.getAttribute("id");
                const reg = n.split("-");
                var j = reg[reg.length - 1];
                self.ITEMS[j].node.setAttribute("position", [0, 0, waitZ]);
            }),
        });
    }
}
ItemManager.prototype.addInstance = function(name, index) {
    //TODO
}

ItemManager.prototype.set = function(itemName) {
    const $$ = gr("#sea");
    const camera = $$("#main-camera").first();
    const pos = camera.getAttribute("position");
    const far = camera.getAttribute("far");
    var aaaaa;
    for (var i = 0; i < this.ITEMS.length; i++) {
        var target = this.ITEMS[i];
        var targetPos = target.node.getAttribute("position");

        if (targetPos.Z > waitZ / 2 && this.ITEMS[i].node.name.name === itemName) {
            // console.log(itemName)
            aaaaa = target;
            break;
            // target.node.setAttribute("position", [0,3,pos.Z - far -10]);
            // console.log(target.node.getAttribute("position").Z)
        } else if (i === this.ITEMS.length - 1) {
            aaaaa = this.addInstance(itemName);
            // console.error("All items are in use!");
        }
    }
    aaaaa.node.setAttribute("position", [0, 3, pos.Z - far - 10]);
}