gr(function(){
  const $$ = gr("#sea");
  const container = $$(".wave-container").get(0);
  WAVES = [];
  for(let i = 0; i < 100; i++){
    WAVES.push(container.addChildByName("wave-cube",{
      position:`0,0,-${i}`,
      color:"cyan",
      offset:i
    }));
  }
  const canvas = document.getElementsByTagName("canvas")[0];
  const box = document.getElementById("gr_container");
  const pos = (window.innerWidth - canvas.width) / 2;
  box.style.left = pos + "px";
});
