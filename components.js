const C = {
    eyeMax: 100,
    eyeMin: -3,
    ampl: 3
};

function waveMain(o) {
    const t = Date.now() / 1000;
    return Math.sin(o / 50 * Math.PI + t);
}

gr.registerComponent("Wave", {
    attributes: {
        offset: {
            converter: "Number",
            default: 0
        }
    },
    $mount: function() {
        this.transform = this.node.getComponent("Transform");
        this.initialY = this.transform.getAttribute("position").Y;
    },
    $update: function() {
        const p = this.transform.getAttribute("position");
        p.Y = waveMain(this.getAttribute("offset")) * C.ampl;
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
            this._transform.setAttribute("position", [p.X, p.Y - e.deltaY * this.sensibility / 100.0, p.Z]);
        });
    }
});

gr.registerComponent("MoveCameraForward", {
    attributes: {
        speed: {
            converter: "Number",
            default: 1.0
        },
        order: {
            converter: "Number",
            default: 99
        }
    },
    $mount: function() {
        this.getAttributeRaw("speed").boundTo("speed");
        this.getAttributeRaw("order").boundTo("order");
        this.lastTime = Date.now();
        this._transform = this.node.getComponent("Transform");
        this.li = 0;
    },
    $update: function() {
        const t = Date.now();
        const delta = t - this.lastTime;
        const p = this._transform.getAttribute("position");
        const cz = p.Z - delta / 1000. * this.speed;
        const backIndex = Math.floor((-cz) % 100);
        if (backIndex !== this.li) {
            this.order = this.li;
            WAVES[this.li].setAttribute("position", [0, 0, Math.floor(cz) - 100]);
            WAVES[this.li].setAttribute("offset", -Math.floor(cz));
            this.offset = this.li;
        }
        this._transform.setAttribute("position", [p.X, p.Y, cz]);
        this.lastTime = t;
        this.li = backIndex;
    }
})
gr.registerComponent("SyncWave", {
    attributes: {
        order: {
            default: 99,
            converter: "Number"
        }
    },
    $mount: function() {
        this.transform = this.node.getComponent("Transform");
    },
    $update: function() {
        // const p = this.transform.getAttribute("position");
        // p.Y = waveMain(this.order) * C.ampl + 1;
        // this.transform.setAttribute("position", [p.X, p.Y, p.Z]);
    }
});

gr.registerNode("item", ["SyncWave"], {}, "mesh");

gr.registerNode("wave-cube", ["Wave"], {
    geometry: "wave",
    scale: "1,1,1",
    material: "new(lambert)"
}, "mesh");

gr.registerNode("scroll-camera", ["CameraControl"], {}, "camera");