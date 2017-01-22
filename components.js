const C = {
    eyeMax: 25,
    eyeMin: 0,
    ampl: 3,
    bigAmpl: 2,
    focus: 70
};
let Camera;

function resetSpeed() {
    const moveCamera = Camera.getComponent("MoveCameraForward");
    moveCamera.resetSpeed();
}

function waveMain(o) {
    var bigWaveParam = o / 1000 * Math.PI * 2;
    var bigWave = Math.sin(bigWaveParam);
    bigWave = bigWave * bigWave;
    bigWave = bigWave * bigWave;
    bigWave = bigWave * bigWave;
    bigWave = bigWave * bigWave;
    bigWave = bigWave * bigWave;
    bigWave = bigWave * bigWave * bigWave * bigWave * C.bigAmpl;
    // return bigWave

    var w1 = Math.sin(o / 57 * Math.PI);
    var w2 = Math.sin(o / 31 * Math.PI);
    var w3 = Math.sin(o / 17 * Math.PI);
    return (w1 + 0.6 * w2 + 0.8 * w3 + bigWave) * C.ampl;
}

gr.registerComponent("Wave", {
    attributes: {
        yOffset: {
            converter: "Number",
            default: 0
        },
        smallWave: {
            converter: "Number",
            default: 1.0
        }
    },
    $mount: function () {
        this.transform = this.node.getComponent("Transform");
        this.initialY = this.transform.getAttribute("position").Y;
        this.getAttributeRaw("yOffset").boundTo("yOffset");
        this.getAttributeRaw("smallWave").boundTo("smallWave");
        this.random = Math.random() * 1000;
    },
    $update: function () {
        const p = this.transform.getAttribute("position");
        p.Y = waveMain(p.Z) + this.yOffset + this.smallWave * Math.sin(Date.now() / 1000. + this.random);
        this.transform.setAttribute("position", [p.X, p.Y, p.Z]);
    },
    $resetPosition: function () {
        var count = WAVES.length;
        var d = 1;
        var p = this.node.getAttribute("position");
        this.node.setAttribute("position", [p.X, p.Y, p.Z - count * d]);
    }
});

gr.registerComponent("CameraControl", {
    attributes: {
        sensibility: {
            converter: "Number",
            default: 1.0
        }
    },
    $mount: function () {
        this.__bindAttributes();
        this._transform = this.node.getComponent("Transform");
    },
    $update: function () {
        const distance = document.documentElement.getBoundingClientRect().height - window.innerHeight;
        const heightRatio = $(window).scrollTop() / distance;
        const p = this._transform.getAttribute("position");
        this._transform.setAttribute("position", [p.X, C.eyeMin + (C.eyeMax - C.eyeMin) * heightRatio, p.Z]);
        this._transform.setAttribute("rotation", `x(-${Math.atan(p.Y/C.focus)}rad)`);
    }
});

gr.registerComponent("Item", {
    attributes: {
        score: {
            default: 100,
            converter: "Number"
        },
        sounds: {
            default: "",
            converter: "String"
        },
        hitX:{
          default:2.0,
          converter:"Number"
        },
        hitY: {
            default: 3,
            converter: "Number"
        },
        hitZ: {
            default: 3,
            converter: "Number"
        },
        hasPenalty:{
          default:false,
          converter:"Boolean"
        }
    },
    $mount:function(){
      this.getAttributeRaw("hasPenalty").boundTo("hasPenalty");
      this.getAttributeRaw("hitX").boundTo("hitX");
      this.getAttributeRaw("hitY").boundTo("hitY");
      this.getAttributeRaw("hitZ").boundTo("hitZ");
    },
    $update: function () {
        const pos = this.node.getAttribute("position");
        const cameraPos = Camera.getAttribute("position");
        const dZ = Math.abs(pos.Z - cameraPos.Z);
        const dY = Math.abs(pos.Y - cameraPos.Y);
        const dX = Math.abs(pos.X - cameraPos.X);
        if (dZ < this.hitZ && dY < this.hitY && dX < this.hitX) {
            console.log(`player hit ${this.node.name.name}`);
            // const score = this.getAttribute("score");
            GM.addScore(this);
            Audios[this.getAttribute("sounds")].play();
            this.node.emit("reset", this.node);
            if(this.hasPenalty){
              Camera.getComponent("MoveCameraForward").execPenalty();
            }
            return;
        }
        if (pos.Z !== 100 && pos.Z - cameraPos.Z > 50) {
            this.node.emit("reset", this.node);
        }
    }
});


gr.registerComponent("MoveCameraForward", {
    attributes: {
        speed: {
            converter: "Number",
            default: 1.0
        },
        acceralation: {
            converter: "Number",
            default: 1.0
        },
        penalty: {
            converter: "Number",
            default: 1800
        },
        maxSpeed: {
            converter: "Number",
            default: 300
        }
    },
    $mount: function () {
        Camera = this.node;
        this.getAttributeRaw("speed").boundTo("speed");
        this.getAttributeRaw("penalty").boundTo("penalty");
        this.getAttributeRaw("acceralation").boundTo("acceralation");
        this.getAttributeRaw("maxSpeed").boundTo("maxSpeed");
        this.lastTime = Date.now();
        this._transform = this.node.getComponent("Transform");
        this.hold = false;
        this.duration = 0;
        this.backSpeed = 0;
        // document.body.addEventListener("wheel", (function (e) {
        //     if (this.hold) {
        //         e.preventDefault();
        //     }
        // }).bind(this));
        this.currentSpeed = this.speed;
        this.resetTime = Date.now();
    },
    $update: function () {
        const t = Date.now();
        this.currentSpeed = Math.min(this.maxSpeed, this.speed + (t - this.resetTime) / 1000 * this.acceralation);
        const delta = t - this.lastTime;
        this.lastTime = t;
        const p = this._transform.getAttribute("position");
        const cz = p.Z - delta / 1000. * this.currentSpeed;
        WAVES.forEach(function (w) {
            if (w.getAttribute("position").Z > cz) {
                w.sendMessage("resetPosition");
            }
        });

        var cameraMinHeight = waveMain(cz) + 2;
        if (!this.hold && cameraMinHeight > p.Y) {
            this._transform.setAttribute("position", [p.X, p.Y, cz]);
            GM.commbo = 0;
            Audios.dobon.play();
            this.execPenalty();
        } else {
            var newY = this.hold ? Math.max(p.Y + this.backSpeed, cameraMinHeight) : p.Y;
            this._transform.setAttribute("position", [p.X, newY, cz]);
            if (this.duration <= Date.now()) {
                this.hold = false;
            }
        }
    },
    reset: function () {
        this.currentSpeed = this.getAttribute("speed");
        this.resetTime = Date.now();
    },
    execPenalty:function(){
      const p = this._transform.getAttribute("position");
      $("html,body").animate({
          scrollTop: $(document).height()
      }, this.penalty);
      this.hold = true;
      this.backSpeed = (C.eyeMax - p.Y) / this.penalty;
      this.duration = Date.now() + this.penalty;
      this.reset();
    }
});

gr.registerNode("wave-cube", ["Wave"], {
    geometry: "wave",
    scale: "1,1,1",
    material: "new(lambert)"
}, "mesh");



gr.registerNode("scroll-camera", ["CameraControl"], {}, "camera");
gr.registerNode("apple", ["Wave", "Item"], {
    scale: "0.02",
    src: "./models/apple.gltf",
    yOffset: 1,
    score: 10,
    sounds: "piyopiyo"
}, "model");


gr.registerNode("carrot", ["Wave", "Item"], {
    src: "./models/carrot.gltf",
    yOffset: 1,
    score: 10,
    sounds: "piyopiyo"
}, "model");

gr.registerNode("fish", ["Wave", "Item"], {
    src: "./models/fish.gltf",
    yOffset: 1.7,
    smallWave: 10,
    score: 50,
    sounds: "piyopiyo"
}, "model");
gr.registerNode("gull", ["Wave", "Item"], {
    src: "./models/gull.gltf",
    yOffset: 1.7,
    sounds: "piyopiyo"
}, "model");
gr.registerNode("lotusRoot", ["Wave", "Item"], {
    src: "./models/lotusRoot.gltf",
    score: 30,
    yOffset: 1.5,
    scale: 200,
    sounds: "piyopiyo"
}, "model");
gr.registerNode("yacht", ["Wave", "Item"], {
    src: "./models/yacht.gltf",
    scale: "2",
    score: -20,
    yOffset: 1.5,
    hitY:13,
    sounds: "shipCollision",
    hasPenalty:true
}, "model");
gr.registerNode("turtle", ["Wave", "Item"], {
    rotation: "y(90d)",
    src: "./models/turtle.gltf",
    score: -20,
    yOffset: 1.2,
    smallWave: 0.2,
    sounds: "kame"
}, "model");
