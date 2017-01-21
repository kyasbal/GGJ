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
    for (let i = 0; i < 100; i++) {
        WAVES.push(waveContainer.addChildByName("wave-cube", {
            position: `0,0,-${i}`,
            color: "#0084CF",
            offset: i,
            id: "wave-" + i
        }));
    }
    for(let i = 0; i < 8; i++){
      ITEMS.push(itemContainer.addChildByName("apple",{
        position:`0,0,-${i * 100}`
      }));
    }
    const canvas = document.getElementsByTagName("canvas")[0];
    const box = document.getElementById("gr_container");
    const pos = (window.innerWidth - canvas.width) / 2;
    box.style.left = pos + "px";
    sound.play();
});
