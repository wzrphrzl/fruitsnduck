import kaplay from "kaplay";

// Initialiser Kaplay et récupérer le contexte
const k = kaplay();

// Exposer toutes les fonctions/objets Kaplay en global
const loadSprite = k.loadSprite.bind(k);
const add = k.add.bind(k);
const onLoad = k.onLoad.bind(k);
const debug = k.debug;
const getSpriteOutline = k.getSpriteOutline.bind(k);
const buildConvexHull = k.buildConvexHull.bind(k);
const pos = k.pos.bind(k);
const center = k.center.bind(k);
const scale = k.scale.bind(k);
const anchor = k.anchor.bind(k);
const rotate = k.rotate.bind(k);
const sprite = k.sprite.bind(k);
const area = k.area.bind(k);
const vec2 = k.vec2.bind(k);

// CODE DU TEST (depuis tightspritearea.js)
loadSprite("cbanana", "/img/cbanana.png");

const bean = add([
    sprite("cbanana"), // add sprite
    pos(center()), // set position, center of the screen
    scale(2), // set scale
    anchor("center"), // set anchor, pivot
    rotate(0), // set rotation
    area(),
]);

onLoad(() => {
    bean.area.shape = getSpriteOutline("cbanana", 0, true, 1);
    bean.area.shape.pts = buildConvexHull(bean.area.shape.pts);
    bean.area.offset = vec2(-bean.width / 2, -bean.height / 2);
});

debug.inspect = true;
