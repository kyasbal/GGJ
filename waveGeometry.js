const GeometryFactory = gr.lib.fundamental.Geometry.GeometryFactory;
const Geometry = gr.lib.fundamental.Geometry.Geometry;
const GeometryUtility = gr.lib.fundamental.Geometry.GeometryUtility;
GeometryFactory.addType("wave",{
  count:{
    converter:"Number",
    default:10
  },
  margin:{
    converter:"Number",
    default:1
  }
},(gl,attr)=>{
  const geo = new Geometry(gl);
  const verticies = new Float32Array(attr.count * 7 * 24);
  const indicies = new Uint16Array(attr.count * 36);
  const wof = -((attr.count - 1) * attr.margin + attr.count * 2)/2;
  const bCube = [].concat.apply([], [
  GeometryUtility.plane([0, 0, 1], [0, 0, 1], [0, 1, 0], [1, 0, 0], 1, 1),
  GeometryUtility.plane([0, 0, -1], [0, 0, -1], [0, 1, 0], [-1, 0, 0], 1, 1),
  GeometryUtility.plane([0, 1, 0], [0, 1, 0], [0, 0, -1], [1, 0, 0], 1, 1),
  GeometryUtility.plane([0, -1, 0], [0, -1, 0], [0, 0, -1], [-1, 0, 0], 1, 1),
  GeometryUtility.plane([1, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, -1], 1, 1),
  GeometryUtility.plane([-1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, 0, 1], 1, 1)]);
  const bIndicies = [].concat.apply([], [
    GeometryUtility.planeIndex(0, 1, 1),
    GeometryUtility.planeIndex(4, 1, 1),
    GeometryUtility.planeIndex(2 * 4, 1, 1),
    GeometryUtility.planeIndex(3 * 4, 1, 1),
    GeometryUtility.planeIndex(4 * 4, 1, 1),
    GeometryUtility.planeIndex(5 * 4, 1, 1)]);
  for(let i = 0; i < attr.count; i++){
    const seed = Math.random();
    for(let j = 0; j < 24; j++){
        verticies[7 * 24 * i + j * 7 + 0] = bCube[8 * j + 0]+ attr.margin * i + 2*i + wof;
        verticies[7 * 24 * i + j * 7 + 1] = bCube[8 * j + 1];
        verticies[7 * 24 * i + j * 7 + 2] = bCube[8 * j + 2];
        verticies[7 * 24 * i + j * 7 + 3] = bCube[8 * j + 3];
        verticies[7 * 24 * i + j * 7 + 4] = bCube[8 * j + 4];
        verticies[7 * 24 * i + j * 7 + 5] = bCube[8 * j + 5];
        verticies[7 * 24 * i + j * 7 + 6] = seed;
    }
    for(let j = 0; j < 36; j++){
      indicies[36 * i + j] = bIndicies[j] + 24 * i;
    }
}
  geo.addAttributes(verticies,{
    POSITION:{
      size:3,
      stride:28
    },
    NORMAL:{
      size:3,
      stride:28,
      offset:12
    },
    SEED:{
      size:1,
      stride:28,
      offset:24
    }
  });
  geo.addIndex("default",indicies);
  return geo;
});
