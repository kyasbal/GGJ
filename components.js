const C = {
    eyeMax: 25,
    eyeMin: 0,
    ampl: 3
};
let isDobonPlaying = false;
const Audios = {
    dobon: new Howl({
        src: ['./audio/dobon.mp3'],
        volume: 0.5,
        onend: function() {
            isDobonPlaying = false;
        }
    })
};

function waveMain(o) {
    const t = Date.now() / 1000;
    return Math.sin(o / 50 * Math.PI + t) * C.ampl;
}

gr.registerComponent("Wave", {
    attributes: {
        offset: {
            converter: "Number",
            default: 0
        },
        yOffset: {
            converter: "Number",
            default: 0
        }
    },
    $mount: function() {
        this.transform = this.node.getComponent("Transform");
        this.initialY = this.transform.getAttribute("position").Y;
        this.getAttributeRaw("yOffset").boundTo("yOffset");
    },
    $update: function() {
        const p = this.transform.getAttribute("position");
        p.Y = waveMain(this.getAttribute("offset")) + this.yOffset;
        this.transform.setAttribute("position", [p.X, p.Y, p.Z]);
    }
});

gr.registerComponent("CameraControl", {
    attributes: {
        sensibility: {
            converter: "Number",
            default: 1.0
        }
    },
    $mount: function() {
        this.__bindAttributes();
        this._transform = this.node.getComponent("Transform");
        document.body.addEventListener("wheel", (e) => {
            const p = this._transform.getAttribute("position");
            const y = Math.max(C.eyeMin, Math.min(C.eyeMax, p.Y - e.deltaY * this.sensibility / 100.0));
            this._transform.setAttribute("position", [p.X, y, p.Z]);
        });
    },
    $update:function(){
      const p = this._transform.getAttribute("position");
      this._transform.setAttribute("rotation", `x(-${Math.atan(p.Y/100)}rad)`);
    }
});

gr.registerComponent("MoveCameraForward", {
    attributes: {
        speed: {
            converter: "Number",
            default: 1.0
        },
        penalty: {
            converter: "Number",
            default: 800
        }
    },
    $mount: function() {
        this.getAttributeRaw("speed").boundTo("speed");
        this.getAttributeRaw("penalty").boundTo("penalty");
        this.lastTime = Date.now();
        this._transform = this.node.getComponent("Transform");
        this.li = 0;
        this.hold = false;
        this.duration = 0;
        this.backSpeed = 0;
    },
    $update: function() {
        const t = Date.now();
        const delta = t - this.lastTime;
        const p = this._transform.getAttribute("position");
        const cz = p.Z - delta / 1000. * this.speed;
        const backIndex = Math.floor((-cz) % 100);
        if (backIndex !== this.li) {
            WAVES[this.li].setAttribute("position", [0, 0, Math.floor(cz) - 100]);
            WAVES[this.li].setAttribute("offset", -Math.floor(cz));
            this.offset = this.li;
        }

        if (this.hold) {
          const y = p.Y + this.backSpeed;
          this._transform.setAttribute("position",[p.X,y,cz]);
          this.duration --;
          if(this.duration<= Date.now()){
            this.hold = false;
          }
        } else {
            this._transform.setAttribute("position", [p.X, p.Y, cz]);
            this.lastTime = t;
            this.li = backIndex;
            this.order = this.li;
            if (waveMain(-cz) > p.Y - 2.0) {
                if (!isDobonPlaying) {
                    isDobonPlaying = true;
                    Audios.dobon.play();
                    $("html,body").animate({
                        scrollTop: $('body').offset().top
                    }, this.penalty);
                    this.hold = true;
                    this.backSpeed = (C.eyeMax - p.Y) / this.penalty;
                    this.duration = Date.now() + this.penalty;
                }
            }
        }
    }
})

gr.registerNode("wave-cube", ["Wave"], {
    geometry: "wave",
    scale: "1,1,1",
    material: "new(lambert)"
}, "mesh");

gr.registerNode("scroll-camera", ["CameraControl"], {}, "camera");
gr.registerNode("apple", ["Wave"], {
    scale: "0.02",
    src: "./models/apple.gltf",
    yOffset: 1
}, "model");
