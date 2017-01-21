gr(function() {
    const $$ = gr("#sea");
    const container = $$(".wave-container").get(0);
    WAVES = [];
    for (let i = 0; i < 100; i++) {
        WAVES.push(container.addChildByName("wave-cube", {
            position: `0,0,-${i}`,
            color: "cyan",
            offset: i,
            id: "wave-" + i
        }));
    }
    const canvas = document.getElementsByTagName("canvas")[0];
    const box = document.getElementById("gr_container");
    const pos = (window.innerWidth - canvas.width) / 2;
    box.style.left = pos + "px";
    setInterval(function() {
        itemGenerate();
    }, 300);
});

function itemGenerate() {
    const $$ = gr("#sea");
    const camera = $$("#main-camera");
    const min = -7;
    const max = 8;
    const offset = -100;
    const posX = Math.floor((Math.random() * ((max + 1) - min)) + min);
    const order = camera.get(0).getComponent("MoveCameraForward").getAttribute("order");
    const pos = $$(`#wave-${i}`).getAttribute("position");
    const scene = $$("scene").first();
    scene.addChildByName('item', {
        color: 'white',
        geometry: 'sphere',
        position: `${posX},${pos.Y + 4},${pos.Z}`,
        scale: '1',
        order: order
    });
};