# Fruits'n'Duck — Flux de données internes

Schémas de référence pour comprendre comment un objet passe de son apparition à
son effet. Deux vues : le **flux collision → objectEvent**, et le **graphe des
modules**.

---

## 1. Apparition → collision → effet

Un objet apparaît par l'une de deux fonctions, ce qui détermine son **tag** de
collision. Le tag décide quel handler le capte. Le handler décide si (et comment)
l'`objectEvent` de l'objet se déclenche.

```mermaid
flowchart TD
    %% APPARITION
    addObject["addObject(type)<br/>tombe du ciel<br/>tag = 'objectContainer'"]
    addPlant["addPlant(sprite)<br/>pousse au sol<br/>tag = nom du sprite"]
    addTree["addTree()<br/>tag = 'tree'"]
    addFlower["addFlower()<br/>tag = 'flower'"]

    %% HANDLERS
    H1["onCollide('objectContainer')<br/>— fruitcombo.js"]
    H2["onCollide('thistle' / 'dandelionChrono')<br/>— game.js"]
    H3["onCollide('tree')<br/>— game.js"]
    HX["aucun handler<br/>(décoratif)"]

    addObject --> H1
    addPlant --> H2
    addTree --> H3
    addFlower --> HX

    %% HANDLER objectContainer
    H1 --> UC{"updateCombo<br/>type = commonFruit<br/>ou superFruitT1 ?"}
    UC -->|non| GDU
    UC -->|oui| INV["addFruit → inventaire"]
    INV --> FULL{"3 fruits ?"}
    FULL -->|non| GDU
    FULL -->|oui| CAT{"classifyCombo"}
    CAT -->|perfectCombo| OE1(["objectEvent() — DÉCLENCHEUR 1"])
    CAT -->|base / unPerfect / nearPerfect| LOOT["resolveCombo → loots.js"]

    GDU{"getDefinitiveUpgrade<br/>sprite dans le tableau<br/>upgrades ?"}
    GDU -->|oui| OE2(["objectEvent(source) — DÉCLENCHEUR 2"])
    GDU -->|non| REST["applyScore + buffEnemy + destroy"]
    OE1 --> REST
    OE2 --> REST
    LOOT --> REST

    %% HANDLER plantes
    H2 --> OE3(["objectEvent(source) — DÉCLENCHEUR 3"])
    OE3 --> DES2["destroy"]

    %% HANDLER arbre
    H3 --> TREE["si 'fruity' : lâche fruits<br/>+ repousse un arbre"]
```

### Les 3 déclencheurs de `objectEvent`

| # | Où | Condition | Qui passe |
|---|----|-----------|-----------|
| 1 | fruitcombo.js — `updateCombo` | trio `perfectCombo` (3 superFruitT1 identiques) | sGrape1, sKumquat1, sPiment1, sPlum1, sTomato1 |
| 2 | fruitcombo.js — `getDefinitiveUpgrade` | sprite ∈ `upgrades` | heartIngame, superHeart, superTomatoArmor, superPiment, samaraSpeed, superStar |
| 3 | game.js — handler plantes | tag ∈ `['thistle', 'dandelionChrono']` | thistle, dandelionChrono |

### ⚠️ Objets dont l'`objectEvent` ne se déclenche JAMAIS

Ces objets ont un `objectEvent` défini mais aucun chemin ne l'appelle :

- **acorn** — spawné en `objectContainer`, mais son sprite n'est pas dans `upgrades`
  et son type n'est ni `commonFruit` ni `superFruitT1`.
- **virus3Red** — même raison (type `virus`, absent de `upgrades`).

Pour les brancher : soit les ajouter au tableau `upgrades`, soit modifier
`getDefinitiveUpgrade` pour tester l'`objectType` au lieu du nom de sprite.

---

## 2. Graphe des dépendances entre modules

Sens des flèches = « importe ». La boucle `generators ↔ objects` est le seul
cycle (bénin aujourd'hui, mais à surveiller).

```mermaid
flowchart LR
    main --> scenes
    scenes["scenes/*"] --> fruitcombo
    scenes --> generators
    scenes --> objects
    scenes --> timer
    scenes --> ui
    scenes --> player
    scenes --> enemy

    fruitcombo --> objects
    fruitcombo --> loots
    fruitcombo --> inventory
    fruitcombo --> ui

    objects --> generators
    objects --> ui
    objects --> timer
    objects --> helpers
    objects --> player

    generators --> objects
    generators --> player
    generators --> helpers

    loots --> objects
    loots --> generators

    inventory --> ui
    ui --> player

    linkStyle default stroke:#888
```

> Le cycle `objects → generators → objects` fonctionne parce que les fonctions
> concernées (`addObject`, `addTree`, `addFlower`) ne sont appelées qu'au runtime,
> jamais au chargement du module.

---

## 3. États partagés (singletons de module)

Ces objets vivent au niveau module et sont lus/mutés depuis plusieurs fichiers.
C'est là que se logent les bugs de « fuite entre parties ».

| État | Défini dans | Muté depuis | Réinitialisé ? |
|------|-------------|-------------|----------------|
| `playerStats` | player.js | objects.js, game.js | ❌ non |
| `inventorySlots` | inventory.js | fruitcombo.js, player.js | ✅ `initInventory` |
| `scoreStats` | appInit.js | game.js, fruitcombo.js | partiel (`comboCount` seul) |
| timer courant | timer.js | objects.js (`addGameTime`) | recréé par `createTimer` |
