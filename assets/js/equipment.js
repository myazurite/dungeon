const createEquipment = () => {
    const equipment = {
        category: null,
        attribute: null,
        type: null,
        rarity: null,
        lvl: null,
        tier: null,
        value: null,
        stats: [],
    };

    // Generate random equipment attribute
    const equipmentAttributes = ["Damage", "Defense"];
    equipment.attribute = equipmentAttributes[Math.floor(Math.random() * equipmentAttributes.length)];

    // Generate random equipment name and type based on attribute
    if (equipment.attribute == "Damage") {
        const equipmentCategories = ["Sword", "Axe", "Hammer", "Dagger", "Flail", "Scythe"];
        equipment.category = equipmentCategories[Math.floor(Math.random() * equipmentCategories.length)];
        equipment.type = "Weapon";
    } else if (equipment.attribute == "Defense") {
        const equipmentTypes = ["Armor", "Shield", "Helmet"];
        equipment.type = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
        if (equipment.type == "Armor") {
            const equipmentCategories = ["Plate", "Chain", "Leather"];
            equipment.category = equipmentCategories[Math.floor(Math.random() * equipmentCategories.length)];
        } else if (equipment.type == "Shield") {
            const equipmentCategories = ["Tower", "Kite", "Buckler"];
            equipment.category = equipmentCategories[Math.floor(Math.random() * equipmentCategories.length)];
        } else if (equipment.type == "Helmet") {
            const equipmentCategories = ["Great Helm", "Horned Helm"];
            equipment.category = equipmentCategories[Math.floor(Math.random() * equipmentCategories.length)];
        }
    }

    // Generate random equipment rarity
    const rarityChances = {
        "Common": 0.5,
        "Uncommon": 0.3,
        "Rare": 0.09,
        "Epic": 0.06,
        "Legendary": 0.03,
        "Heirloom": 0.02,
    };

    const randomNumber = Math.random();
    let cumulativeChance = 0;

    for (let rarity in rarityChances) {
        cumulativeChance += rarityChances[rarity];
        if (randomNumber <= cumulativeChance) {
            equipment.rarity = rarity;
            break;
        }
    }

    // Determine number of times to loop based on equipment rarity
    let loopCount;
    switch (equipment.rarity) {
        case "Common":
            loopCount = 3;
            break;
        case "Uncommon":
            loopCount = 4;
            break;
        case "Rare":
            loopCount = 5;
            break;
        case "Epic":
            loopCount = 6;
            break;
        case "Legendary":
            loopCount = 7;
            break;
        case "Heirloom":
            loopCount = 10;
            break;
    }

    // Generate and append random stats to the stats array
    const physicalStats = ["atk", "atkSpd", "vamp", "critRate", "critDmg"];
    const damageyStats = ["atk", "atk", "critRate", "critDmg", "critDmg"];
    const speedyStats = ["atkSpd", "atkSpd", "atk", "critRate", "critRate", "critDmg"];
    const defenseStats = ["hp", "hp", "def", "def", "atk"];
    const dmgDefStats = ["hp", "def", "atk", "atk", "critRate", "critDmg"];
    let statTypes;
    if (equipment.attribute == "Damage") {
        if (equipment.category == "Axe" || equipment.category == "Scythe") {
            statTypes = damageyStats;
        } else if (equipment.category == "Dagger" || equipment.category == "Flail") {
            statTypes = speedyStats;
        } else if (equipment.category == "Hammer") {
            statTypes = dmgDefStats;
        } else {
            statTypes = physicalStats;
        }
    } else if (equipment.attribute == "Defense") {
        statTypes = defenseStats;
    }
    let equipmentValue = 0;
    for (let i = 0; i < loopCount; i++) {
        let statType = statTypes[Math.floor(Math.random() * statTypes.length)];

        // Stat scaling for equipment
        const maxLvl = dungeon.progress.floor * dungeon.settings.enemyLvlGap + (dungeon.settings.enemyBaseLvl - 1);
        const minLvl = maxLvl - (dungeon.settings.enemyLvlGap - 1);
        // Set equipment level with Lv.100 cap
        equipment.lvl = randomizeNum(minLvl, maxLvl);

        // Set stat scaling and equipment tier Tier 10 cap
        let enemyScaling = dungeon.settings.enemyScaling;
        if (enemyScaling > 2) {
            enemyScaling = 2;
        }
        let statMultiplier = (enemyScaling - 1) * equipment.lvl;
        equipment.tier = Math.round((enemyScaling - 1) * 10);
        let hpScaling = (70 * randomizeDecimal(0.5, 1.5)) + ((70 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let atkDefScaling = (70 * randomizeDecimal(0.5, 1.5)) + ((70 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let cdAtkSpdScaling = (3 * randomizeDecimal(0.5, 1.5)) + ((3 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let crVampScaling = (randomizeDecimal(0.3, 0.6)) + ((randomizeDecimal(0.3, 0.6)) * statMultiplier);

        // Set randomized numbers to respective stats and increment sell value
        if (statType === "hp") {
            statValue = randomizeNum(hpScaling * 0.5, hpScaling);
            equipmentValue += statValue * 4;
        } else if (statType === "atk") {
            statValue = randomizeNum(atkDefScaling * 0.5, atkDefScaling);
            equipmentValue += statValue * 5;
        } else if (statType === "def") {
            statValue = randomizeNum(atkDefScaling * 0.5, atkDefScaling);
            equipmentValue += statValue * 3.5;
        } else if (statType === "atkSpd") {
            statValue = randomizeDecimal(cdAtkSpdScaling * 0.5, cdAtkSpdScaling);
            if (statValue > 15) {
                statValue = 15 * randomizeDecimal(0.5, 1);
                loopCount++;
            }
            equipmentValue += statValue * 8.33;
        } else if (statType === "vamp") {
            statValue = randomizeDecimal(crVampScaling * 0.5, crVampScaling);
            if (statValue > 4) {
                statValue = 4 * randomizeDecimal(0.5, 1);
                loopCount++;
            }
            equipmentValue += statValue * 20.83;
        } else if (statType === "critRate") {
            statValue = randomizeDecimal(crVampScaling * 0.3, crVampScaling);
            if (statValue > 4) {
                statValue = 4 * randomizeDecimal(0.3, 1);
                loopCount++;
            }
            equipmentValue += statValue * 20.83;
        } else if (statType === "critDmg") {
            statValue = randomizeDecimal(cdAtkSpdScaling * 0.5, cdAtkSpdScaling);
            equipmentValue += statValue * 8.33;
        }

        // Cap maximum stat rolls for equipment rarities
        if (equipment.rarity == "Common" && loopCount > 3) {
            loopCount--;
        } else if (equipment.rarity == "Uncommon" && loopCount > 4) {
            loopCount--;
        } else if (equipment.rarity == "Rare" && loopCount > 5) {
            loopCount--;
        } else if (equipment.rarity == "Epic" && loopCount > 6) {
            loopCount--;
        } else if (equipment.rarity == "Legendary" && loopCount > 7) {
            loopCount--;
        } else if (equipment.rarity == "Heirloom" && loopCount > 9) {
            loopCount--;
        }

        //TODO stopped here 28/10/2023
        // Check if stat type already exists in stats array
        let statExists = false;
        for (let j = 0; j < equipment.stats.length; j++) {
            if (Object.keys(equipment.stats[j])[0] == statType) {
                statExists = true;
                break;
            }
        }

        // If stat type already exists, add values together
        if (statExists) {
            for (let j = 0; j < equipment.stats.length; j++) {
                if (Object.keys(equipment.stats[j])[0] == statType) {
                    equipment.stats[j][statType] += statValue;
                    break;
                }
            }
        }

        // If stat type does not exist, add new stat to stats array
        else {
            equipment.stats.push({ [statType]: statValue });
        }
    }
    equipment.value = Math.round(equipmentValue * 3);
    player.inventory.equipment.push(JSON.stringify(equipment));

    saveData();
    showInventory();
    showEquipment();

    const itemShow = {
        category: equipment.category,
        rarity: equipment.rarity,
        lvl: equipment.lvl,
        tier: equipment.tier,
        icon: equipmentIcon(equipment.category),
        stats: equipment.stats
    }
    return itemShow;
}

const createRelicReplica = () => {
    const relicReplica = {
        category: null,
        attribute: null,
        type: null,
        rarity: null,
        lvl: null,
        tier: null,
        value: null,
        stats: [],
    };

    // Generate random relic replica attribute
    const relicReplicaAttributes = ["Damage", "Defense"];
    relicReplica.attribute = relicReplicaAttributes[Math.floor(Math.random() * relicReplicaAttributes.length)];

    // Generate random relic name and type based on attribute
    if (relicReplica.attribute === "Damage") {
        const relicReplicaCategories = ["Athena Core", "Purification Core", "Royal Arm", "Zodiac Curtana", "Yoshimitsu"];
        relicReplica.category = relicReplicaCategories[Math.floor(Math.random() * relicReplicaCategories.length)];
        relicReplica.type = "Weapon";
    } else if (relicReplica.attribute === "Defense") {
        const relicReplicaTypes = ["Module", "Shield", "Trinket"];
        relicReplica.type = relicReplicaTypes[Math.floor(Math.random() * relicReplicaTypes.length)];
        if (relicReplica.type === "Module") {
            const relicReplicaCategories = ["Omega Module",];
            relicReplica.category = relicReplicaCategories[Math.floor(Math.random() * relicReplicaCategories.length)];
        } else if (relicReplica.type === "Shield") {
            const relicReplicaCategories = ["Epsilon Shield",];
            relicReplica.category = relicReplicaCategories[Math.floor(Math.random() * relicReplicaCategories.length)];
        } else if (relicReplica.type === "Trinket") {
            const relicReplicaCategories = ["Alpha Trinket",];
            relicReplica.category = relicReplicaCategories[Math.floor(Math.random() * relicReplicaCategories.length)];
        }
    }

    // Generate random replica rarity
    const rarityChances = {
        "Relic Replica": 1,
    };

    const randomNumber = Math.random();
    let cumulativeChance = 0;

    for (let rarity in rarityChances) {
        cumulativeChance += rarityChances[rarity];
        if (randomNumber <= cumulativeChance) {
            relicReplica.rarity = rarity;
            break;
        }
    }

    // Determine number of times to loop based on equipment rarity
    let loopCount;
    switch (relicReplica.rarity) {
        case "Relic Replica":
            loopCount = 15;
            break;
    }

    // Generate and append random stats to the stats array
    const physicalStats = ["atk", "atkSpd", "vamp", "critRate", "critDmg"];
    const damageyStats = ["atk", "atk", "critRate", "critDmg", "critDmg"];
    const speedyStats = ["atkSpd", "atkSpd", "atk", "critRate", "critRate", "critDmg"];
    const defenseStats = ["hp", "hp", "def", "def", "atk"];
    const dmgDefStats = ["hp", "def", "atk", "atk", "critRate", "critDmg"];
    let statTypes;
    if (relicReplica.attribute === "Damage") {
        if (relicReplica.category === "Athena Core") {
            statTypes = damageyStats;
        } else if (relicReplica.category === "Dagger" || relicReplica.category === "Yoshimitsu") {
            statTypes = speedyStats;
        } else if (relicReplica.category === "Purification Core") {
            statTypes = dmgDefStats;
        } else {
            statTypes = physicalStats;
        }
    } else if (relicReplica.attribute === "Defense") {
        statTypes = defenseStats;
    }
    let relicReplicaValue = 0;
    for (let i = 0; i < loopCount; i++) {
        let statType = statTypes[Math.floor(Math.random() * statTypes.length)];

        // Stat scaling for relic
        const maxLvl = dungeon.progress.floor * dungeon.settings.enemyLvlGap + (dungeon.settings.enemyBaseLvl - 1);
        const minLvl = maxLvl - (dungeon.settings.enemyLvlGap - 1);

        // Set relic level
        relicReplica.lvl = randomizeNum(minLvl, maxLvl);

        // Set stat scaling and relic tier 10 cap
        let enemyScaling = dungeon.settings.enemyScaling;
        let statMultiplier = (enemyScaling - 1) * relicReplica.lvl;
        relicReplica.tier = Math.round((enemyScaling - 1) * 10);
        let hpScaling = (50 * randomizeDecimal(0.5, 1.5)) + ((50 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let atkDefScaling = (20 * randomizeDecimal(0.5, 1.5)) + ((20 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let cdAtkSpdScaling = (3 * randomizeDecimal(0.5, 1.5)) + ((3 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let crVampScaling = (1.5 * randomizeDecimal(0.5, 1.5)) + ((1.5 * randomizeDecimal(0.5, 1.5)) * statMultiplier);

        // Set randomized numbers to respective stats and increment sell value
        if (statType === "hp") {
            statValue = randomizeNum(hpScaling * 0.5, hpScaling);
            relicReplicaValue += statValue;
        } else if (statType === "atk") {
            statValue = randomizeNum(atkDefScaling * 0.5, atkDefScaling);
            relicReplicaValue += statValue * 2.5;
        } else if (statType === "def") {
            statValue = randomizeNum(atkDefScaling * 0.5, atkDefScaling);
            relicReplicaValue += statValue * 2.5;
        } else if (statType === "atkSpd") {
            statValue = randomizeDecimal(cdAtkSpdScaling * 0.5, cdAtkSpdScaling);
            if (statValue > 15) {
                statValue = 15 * randomizeDecimal(0.5, 1);
                loopCount++;
            }
            relicReplicaValue += statValue * 8.33;
        } else if (statType === "vamp") {
            statValue = randomizeDecimal(crVampScaling * 0.5, crVampScaling);
            if (statValue > 8) {
                statValue = 8 * randomizeDecimal(0.5, 1);
                loopCount++;
            }
            relicReplicaValue += statValue * 20.83;
        } else if (statType === "critRate") {
            statValue = randomizeDecimal(crVampScaling * 0.5, crVampScaling);
            if (statValue > 10) {
                statValue = 10 * randomizeDecimal(0.5, 1);
                loopCount++;
            }
            relicReplicaValue += statValue * 20.83;
        } else if (statType === "critDmg") {
            statValue = randomizeDecimal(cdAtkSpdScaling * 0.5, cdAtkSpdScaling);
            relicReplicaValue += statValue * 8.33;
        }

        // Cap maximum stat rolls for equipment rarities
        if (relicReplica.rarity === "Relic Replica" && loopCount > 16) {
            loopCount--;
        }

        // Check if stat type already exists in stats array
        let statExists = false;
        for (let j = 0; j < relicReplica.stats.length; j++) {
            if (Object.keys(relicReplica.stats[j])[0] == statType) {
                statExists = true;
                break;
            }
        }

        // If stat type already exists, add values together
        if (statExists) {
            for (let j = 0; j < relicReplica.stats.length; j++) {
                if (Object.keys(relicReplica.stats[j])[0] == statType) {
                    relicReplica.stats[j][statType] += statValue;
                    break;
                }
            }
        }

        // If stat type does not exist, add new stat to stats array
        else {
            relicReplica.stats.push({ [statType]: statValue });
        }
    }
    relicReplica.value = Math.round(relicReplicaValue * 10);
    player.inventory.equipment.push(JSON.stringify(relicReplica));

    saveData();
    showInventory();
    showEquipment();

    return {
        category: relicReplica.category,
        rarity: relicReplica.rarity,
        lvl: relicReplica.lvl,
        tier: relicReplica.tier,
        icon: relicReplicaIcon(relicReplica.category),
        stats: relicReplica.stats
    };
}

const createRelic = () => {
    const relic = {
        category: null,
        attribute: null,
        type: null,
        rarity: null,
        lvl: null,
        tier: null,
        value: null,
        stats: [],
    };

    // Generate random relic attribute
    const relicAttributes = ["Damage", "Defense"];
    relic.attribute = relicAttributes[Math.floor(Math.random() * relicAttributes.length)];

    // Generate random relic name and type based on attribute
    if (relic.attribute === "Damage") {
        const relicCategories = ["Athena Core", "Purification Core", "Royal Arm", "Zodiac Curtana", "Yoshimitsu"];
        relic.category = relicCategories[Math.floor(Math.random() * relicCategories.length)];
        relic.type = "Weapon";
    } else if (relic.attribute === "Defense") {
        const relicTypes = ["Module", "Shield", "Trinket"];
        relic.type = relicTypes[Math.floor(Math.random() * relicTypes.length)];
        if (relic.type === "Module") {
            const relicCategories = ["Omega Module",];
            relic.category = relicCategories[Math.floor(Math.random() * relicCategories.length)];
        } else if (relic.type === "Shield") {
            const relicCategories = ["Epsilon Shield",];
            relic.category = relicCategories[Math.floor(Math.random() * relicCategories.length)];
        } else if (relic.type === "Trinket") {
            const relicCategories = ["Alpha Trinket",];
            relic.category = relicCategories[Math.floor(Math.random() * relicCategories.length)];
        }
    }

    const rarityChances = {
        "Relic": 1
    };

    const randomNumber = Math.random();
    let cumulativeChance = 0;

    for (let rarity in rarityChances) {
        cumulativeChance += rarityChances[rarity];
        if (randomNumber <= cumulativeChance) {
            relic.rarity = rarity;
            break;
        }
    }

    // Determine number of times to loop based on equipment rarity
    let loopCount;
    switch (relic.rarity) {
        case "Relic":
            loopCount = 50;
            break;
    }

    // Generate and append random stats to the stats array
    const physicalStats = ["atk", "atkSpd", "vamp", "critRate", "critDmg"];
    const damageyStats = ["atk", "atk", "critRate", "critDmg", "critDmg"];
    const speedyStats = ["atkSpd", "atkSpd", "atk", "critRate", "critRate", "critDmg"];
    const defenseStats = ["hp", "hp", "def", "def", "atk"];
    const dmgDefStats = ["hp", "def", "atk", "atk", "critRate", "critDmg"];
    let statTypes;
    if (relic.attribute === "Damage") {
        if (relic.category === "Athena Core") {
            statTypes = damageyStats;
        } else if (relic.category === "Dagger" || relic.category === "Yoshimitsu") {
            statTypes = speedyStats;
        } else if (relic.category === "Purification Core") {
            statTypes = dmgDefStats;
        } else {
            statTypes = physicalStats;
        }
    } else if (relic.attribute === "Defense") {
        statTypes = defenseStats;
    }
    let relicValue = 0;
    for (let i = 0; i < loopCount; i++) {
        let statType = statTypes[Math.floor(Math.random() * statTypes.length)];

        // Stat scaling for relic
        const maxLvl = dungeon.progress.floor * dungeon.settings.enemyLvlGap + (dungeon.settings.enemyBaseLvl - 1);
        const minLvl = maxLvl - (dungeon.settings.enemyLvlGap - 1);
        // Set relic level with Lv.100 cap
        relic.lvl = randomizeNum(minLvl, maxLvl);
        // if (relic.lvl > 100) {
        //     relic.lvl = 100;
        // }
        // Set stat scaling and relic tier 10 cap
        let enemyScaling = dungeon.settings.enemyScaling;
        let statMultiplier = (enemyScaling - 1) * relic.lvl;
        relic.tier = Math.round((enemyScaling - 1) * 10);
        let hpScaling = (100 * randomizeDecimal(0.5, 1.5)) + ((100 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let atkDefScaling = (100 * randomizeDecimal(0.5, 1.5)) + ((100 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let cdAtkSpdScaling = (3.5 * randomizeDecimal(0.5, 1.5)) + ((3.5 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let crVampScaling = (2 * randomizeDecimal(0.5, 1.5)) + ((2 * randomizeDecimal(0.5, 1.5)) * statMultiplier);

        // Set randomized numbers to respective stats and increment sell value
        if (statType === "hp") {
            statValue = randomizeNum(hpScaling * 0.5, hpScaling);
            relicValue += statValue;
        } else if (statType === "atk") {
            statValue = randomizeNum(atkDefScaling * 0.5, atkDefScaling);
            relicValue += statValue * 2.5;
        } else if (statType === "def") {
            statValue = randomizeNum(atkDefScaling * 0.5, atkDefScaling);
            relicValue += statValue * 2.5;
        } else if (statType === "atkSpd") {
            statValue = randomizeDecimal(cdAtkSpdScaling * 0.5, cdAtkSpdScaling);
            if (statValue > 15) {
                statValue = 15 * randomizeDecimal(0.5, 1);
                loopCount++;
            }
            relicValue += statValue * 8.33;
        } else if (statType === "vamp") {
            statValue = randomizeDecimal(crVampScaling * 0.5, crVampScaling);
            if (statValue > 8) {
                statValue = 8 * randomizeDecimal(0.5, 1);
                loopCount++;
            }
            relicValue += statValue * 20.83;
        } else if (statType === "critRate") {
            statValue = randomizeDecimal(crVampScaling * 0.5, crVampScaling);
            if (statValue > 10) {
                statValue = 10 * randomizeDecimal(0.5, 1);
                loopCount++;
            }
            relicValue += statValue * 20.83;
        } else if (statType === "critDmg") {
            statValue = randomizeDecimal(cdAtkSpdScaling * 0.5, cdAtkSpdScaling);
            relicValue += statValue * 8.33;
        }

        // Cap maximum stat rolls for equipment rarities
        if (relic.rarity === "Relic" && loopCount > 51) {
            loopCount--;
        }

        // Check if stat type already exists in stats array
        let statExists = false;
        for (let j = 0; j < relic.stats.length; j++) {
            if (Object.keys(relic.stats[j])[0] == statType) {
                statExists = true;
                break;
            }
        }

        // If stat type already exists, add values together
        if (statExists) {
            for (let j = 0; j < relic.stats.length; j++) {
                if (Object.keys(relic.stats[j])[0] == statType) {
                    relic.stats[j][statType] += statValue;
                    break;
                }
            }
        }

        // If stat type does not exist, add new stat to stats array
        else {
            relic.stats.push({ [statType]: statValue });
        }
    }
    relic.value = Math.round(relicValue * 10);
    player.inventory.equipment.push(JSON.stringify(relic));

    saveData();
    showInventory();
    showEquipment();

    const itemShow = {
        category: relic.category,
        rarity: relic.rarity,
        lvl: relic.lvl,
        tier: relic.tier,
        icon: relicIcon(relic.category),
        stats: relic.stats
    }
    return itemShow;
}

const equipmentIcon = (equipment) => {
    if (equipment == "Sword") {
        return '<i class="ra ra-relic-blade"></i>';
    } else if (equipment == "Axe") {
        return '<i class="ra ra-axe"></i>';
    } else if (equipment == "Hammer") {
        return '<i class="ra ra-flat-hammer"></i>';
    } else if (equipment == "Dagger") {
        return '<i class="ra ra-bowie-knife"></i>';
    } else if (equipment == "Flail") {
        return '<i class="ra ra-chain"></i>';
    } else if (equipment == "Scythe") {
        return '<i class="ra ra-scythe"></i>';
    } else if (equipment == "Plate") {
        return '<i class="ra ra-vest"></i>';
    } else if (equipment == "Chain") {
        return '<i class="ra ra-vest"></i>';
    } else if (equipment == "Leather") {
        return '<i class="ra ra-vest"></i>';
    } else if (equipment == "Tower") {
        return '<i class="ra ra-shield"></i>';
    } else if (equipment == "Kite") {
        return '<i class="ra ra-heavy-shield"></i>';
    } else if (equipment == "Buckler") {
        return '<i class="ra ra-round-shield"></i>';
    } else if (equipment == "Great Helm") {
        return '<i class="ra ra-knight-helmet"></i>';
    } else if (equipment == "Horned Helm") {
        return '<i class="ra ra-helmet"></i>';
    }
}

const relicReplicaIcon = (relicReplica) => {
    if (relicReplica == "Athena Core") {
        return '<i class="ra ra-grappling-hook"></i>';
    } else if (relicReplica == "Purification Core") {
        return '<i class="ra ra-fireball-sword"></i>';
    }else if (relicReplica == "Royal Arm") {
        return '<i class="ra ra-all-for-one"></i>';
    } else if (relicReplica == "Zodiac Curtana") {
        return '<i class="ra ra-dripping-sword"></i>';
    } else if (relicReplica == "Omega Module") {
        return '<i class="ra ra-site"></i>';
    } else if (relicReplica == "Alpha Trinket") {
        return '<i class="ra ra-barrier"></i>';
    } else if (relicReplica == "Epsilon Shield") {
        return '<i class="ra ra-eye-shield"></i>';
    } else if (relicReplica == "Yoshimitsu") {
        return '<i class="ra ra-daggers"></i>';
    }
}

const relicIcon = (relic) => {
    if (relic == "Athena Core") {
        return '<i class="ra ra-grappling-hook"></i>';
    } else if (relic == "Purification Core") {
        return '<i class="ra ra-fireball-sword"></i>';
    }else if (relic == "Royal Arm") {
        return '<i class="ra ra-all-for-one"></i>';
    } else if (relic == "Zodiac Curtana") {
        return '<i class="ra ra-dripping-sword"></i>';
    } else if (relic == "Omega Module") {
        return '<i class="ra ra-site"></i>';
    } else if (relic == "Alpha Trinket") {
        return '<i class="ra ra-barrier"></i>';
    } else if (relic == "Epsilon Shield") {
        return '<i class="ra ra-eye-shield"></i>';
    } else if (relic == "Yoshimitsu") {
        return '<i class="ra ra-daggers"></i>';
    }
}

// Show full detail of the item
const showItemInfo = (item, icon, relic_icon, relic_replica_icon, type, i) => {
    sfxOpen.play();

    dungeon.status.exploring = false;
    let itemInfo = document.querySelector("#equipmentInfo");
    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let dimContainer = document.querySelector(`#inventory`);
    if (item.tier == undefined) {
        item.tier = 1;
    }
    itemInfo.style.display = "flex";
    dimContainer.style.filter = "brightness(50%)";
    let renderItemRarity;

    switch (item.rarity) {
        case "Relic":
            renderItemRarity = relic_icon;
            break;
        case "Relic Replica":
            renderItemRarity = relic_replica_icon;
            break;
        default:
            renderItemRarity = icon;
            break;
    }
    itemInfo.innerHTML = `
            <div class="content">
                <h3 class="${item.rarity}">${renderItemRarity}${item.rarity} ${item.category}</h3>
                <h5 class="lvltier ${item.rarity}"><b>Lv.${item.lvl} Tier ${item.tier}</b></h5>
                <ul>
                ${item.stats.map(stat => {
        if (Object.keys(stat)[0] === "critRate" || Object.keys(stat)[0] === "critDmg" || Object.keys(stat)[0] === "atkSpd" || Object.keys(stat)[0] === "vamp") {
            return `<li>${Object.keys(stat)[0].toString().replace(/([A-Z])/g, ".$1").replace(/crit/g, "c").toUpperCase()}+${stat[Object.keys(stat)[0]].toFixed(2).replace(rx, "$1")}%</li>`;
        }
        else {
            return `<li>${Object.keys(stat)[0].toString().replace(/([A-Z])/g, ".$1").replace(/crit/g, "c").toUpperCase()}+${stat[Object.keys(stat)[0]]}</li>`;
        }
    }).join('')}
                </ul>
                <div class="button-container">
                    <button id="un-equip">${type}</button>
                    <button id="sell-equip"><i class="fas fa-coins" style="color: #FFD700;"></i>${nFormatter(item.value)}</button>
                    <button id="close-item-info">Close</button>
                </div>
            </div>`;

    // Equip/Unequip button for the item
    let unEquip = document.querySelector("#un-equip");
    unEquip.onclick = function () {
        if (type == "Equip") {
            // Remove the item from the inventory and add it to the equipment
            if (player.equipped.length >= 6) {
                sfxDeny.play();
            } else {
                sfxEquip.play();

                // Equip the item
                player.inventory.equipment.splice(i, 1);
                player.equipped.push(item);

                itemInfo.style.display = "none";
                dimContainer.style.filter = "brightness(100%)";
                playerLoadStats();
                saveData();
                continueExploring();
            }
        } else if (type == "Unequip") {
            sfxUnequip.play();

            // Remove the item from the equipment and add it to the inventory
            player.equipped.splice(i, 1);
            player.inventory.equipment.push(JSON.stringify(item));

            itemInfo.style.display = "none";
            dimContainer.style.filter = "brightness(100%)";
            playerLoadStats();
            saveData();
            continueExploring();
        }
    };

    // Sell equipment
    let sell = document.querySelector("#sell-equip");
    sell.onclick = function () {
        sfxOpen.play();
        itemInfo.style.display = "none";
        defaultModalElement.style.display = "flex";
        defaultModalElement.innerHTML = `
        <div class="content">
            <p>Sell <span class="${item.rarity}">${renderItemRarity}${item.rarity} ${item.category}</span>?</p>
            <div class="button-container">
                <button id="sell-confirm">Sell</button>
                <button id="sell-cancel">Cancel</button>
            </div>
        </div>`;

        let confirm = document.querySelector("#sell-confirm");
        let cancel = document.querySelector("#sell-cancel");
        confirm.onclick = function () {
            sfxSell.play();

            // Sell the equipment
            if (type == "Equip") {
                player.gold += item.value;
                player.inventory.equipment.splice(i, 1);
            } else if (type == "Unequip") {
                player.gold += item.value;
                player.equipped.splice(i, 1);
            }

            defaultModalElement.style.display = "none";
            defaultModalElement.innerHTML = "";
            dimContainer.style.filter = "brightness(100%)";
            playerLoadStats();
            saveData();
            continueExploring();
        }
        cancel.onclick = function () {
            sfxDecline.play();
            defaultModalElement.style.display = "none";
            defaultModalElement.innerHTML = "";
            itemInfo.style.display = "flex";
            continueExploring();
        }
    };

    // Close item info
    let close = document.querySelector("#close-item-info");
    close.onclick = function () {
        sfxDecline.play();

        itemInfo.style.display = "none";
        dimContainer.style.filter = "brightness(100%)";
        continueExploring();
    };
}

// Show inventory
const showInventory = () => {
    // Clear the inventory container
    let playerInventoryList = document.getElementById("playerInventory");
    playerInventoryList.innerHTML = "";

    if (player.inventory.equipment.length == 0) {
        playerInventoryList.innerHTML = "There are no items available.";
    }

    for (let i = 0; i < player.inventory.equipment.length; i++) {
        const item = JSON.parse(player.inventory.equipment[i]);

        // Create an element to display the item's name
        let itemDiv = document.createElement('div');
        let icon = equipmentIcon(item.category);
        let relic_icon = relicIcon(item.category);
        let relic_replica_icon = relicReplicaIcon(item.category);

        let renderItemRarity;
        switch (item.rarity) {
            case "Relic":
                renderItemRarity = relic_icon;
                break;
            case "Relic Replica":
                renderItemRarity = relic_replica_icon;
                break;
            default:
                renderItemRarity = icon;
                break;
        }

        itemDiv.className = "items";
        itemDiv.innerHTML = `<p class="${item.rarity}">${renderItemRarity}${item.rarity} ${item.category}</p>`;
        itemDiv.addEventListener('click', function () {
            let type = "Equip";
            showItemInfo(item, icon, relic_icon, relic_replica_icon, type, i);
        });

        // Add the itemDiv to the inventory container
        playerInventoryList.appendChild(itemDiv);
    }
}

// Show equipment
const showEquipment = () => {
    // Clear the inventory container
    let playerEquipmentList = document.getElementById("playerEquipment");
    playerEquipmentList.innerHTML = "";

    // Show a message if a player has no equipment
    if (player.equipped.length == 0) {
        playerEquipmentList.innerHTML = "Nothing equipped.";
    }

    for (let i = 0; i < player.equipped.length; i++) {
        const item = player.equipped[i];

        // Create an element to display the item's name
        let equipDiv = document.createElement('div');
        let icon = equipmentIcon(item.category);
        let relic_icon = relicIcon(item.category);
        let relic_replica_icon = relicReplicaIcon(item.category);
        let renderItemRarity;
        switch (item.rarity) {
            case "Relic":
                renderItemRarity = relic_icon;
                break;
            case "Relic Replica":
                renderItemRarity = relic_replica_icon;
                break;
            default:
                renderItemRarity = icon;
                break;
        }
        equipDiv.className = "items";
        equipDiv.innerHTML = `<button class="${item.rarity}">${renderItemRarity}</button>`;
        equipDiv.addEventListener('click', function () {
            let type = "Unequip";
            showItemInfo(item, icon, relic_icon, relic_replica_icon, type, i);
        });

        // Add the equipDiv to the inventory container
        playerEquipmentList.appendChild(equipDiv);
    }
}

// Apply the equipment stats to the player
const applyEquipmentStats = () => {
    // Reset the equipment stats
    player.equippedStats = {
        hp: 0,
        atk: 0,
        def: 0,
        atkSpd: 0,
        vamp: 0,
        critRate: 0,
        critDmg: 0
    };

    for (let i = 0; i < player.equipped.length; i++) {
        const item = player.equipped[i];

        // Iterate through the stats array and update the player stats
        item.stats.forEach(stat => {
            for (const key in stat) {
                player.equippedStats[key] += stat[key];
            }
        });
    }
    calculateStats();
}

const unequipAll = () => {
    for (let i = player.equipped.length - 1; i >= 0; i--) {
        const item = player.equipped[i];
        player.equipped.splice(i, 1);
        player.inventory.equipment.push(JSON.stringify(item));
    }
    playerLoadStats();
    saveData();
}

const sellAll = (rarity) => {
    if (rarity == "All") {
        if (player.inventory.equipment.length !== 0) {
            sfxSell.play();
            for (let i = 0; i < player.inventory.equipment.length; i++) {
                const equipment = JSON.parse(player.inventory.equipment[i]);
                player.gold += equipment.value;
                player.inventory.equipment.splice(i, 1);
                i--;
            }
            playerLoadStats();
            saveData();
        } else {
            sfxDeny.play();
        }
    } else {
        let rarityCheck = false;
        for (let i = 0; i < player.inventory.equipment.length; i++) {
            const equipment = JSON.parse(player.inventory.equipment[i]);
            if (equipment.rarity === rarity) {
                rarityCheck = true;
                break;
            }
        }
        if (rarityCheck) {
            sfxSell.play();
            for (let i = 0; i < player.inventory.equipment.length; i++) {
                const equipment = JSON.parse(player.inventory.equipment[i]);
                if (equipment.rarity === rarity) {
                    player.gold += equipment.value;
                    player.inventory.equipment.splice(i, 1);
                    i--;
                }
            }
            playerLoadStats();
            saveData();
        } else {
            sfxDeny.play();
        }
    }
}

const createEquipmentPrint = (condition) => {
    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let item = createEquipment();
    let panel = `
        <div class="primary-panel" style="padding: 0.5rem; margin-top: 0.5rem;">
                <h4 class="${item.rarity}"><b>${item.icon}${item.rarity} ${item.category}</b></h4>
                <h5 class="${item.rarity}"><b>Lv.${item.lvl} Tier ${item.tier}</b></h5>
                <ul>
                ${item.stats.map(stat => {
        if (Object.keys(stat)[0] === "critRate" || Object.keys(stat)[0] === "critDmg" || Object.keys(stat)[0] === "atkSpd" || Object.keys(stat)[0] === "vamp") {
            return `<li>${Object.keys(stat)[0].toString().replace(/([A-Z])/g, ".$1").replace(/crit/g, "c").toUpperCase()}+${stat[Object.keys(stat)[0]].toFixed(2).replace(rx, "$1")}%</li>`;
        }
        else {
            return `<li>${Object.keys(stat)[0].toString().replace(/([A-Z])/g, ".$1").replace(/crit/g, "c").toUpperCase()}+${stat[Object.keys(stat)[0]]}</li>`;
        }
    }).join('')}
            </ul>
        </div>`;
    if (condition == "combat") {
        addCombatLog(`
        ${enemy.name} dropped <span class="${item.rarity}">${item.rarity} ${item.category}</span>.<br>${panel}`);
    } else if (condition == "dungeon") {
        addDungeonLog(`
        You got <span class="${item.rarity}">${item.rarity} ${item.category}</span>.<br>${panel}`);
    }
}

const createRelicPrint = (condition) => {
    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let item = createRelic();
    let panel = `
        <div class="primary-panel" style="padding: 0.5rem; margin-top: 0.5rem;">
                <h4 class="${item.rarity}"><b>${item.icon}${item.rarity} ${item.category}</b></h4>
                <h5 class="${item.rarity}"><b>Lv.${item.lvl} Tier ${item.tier}</b></h5>
                <ul>
                ${item.stats.map(stat => {
        if (Object.keys(stat)[0] === "critRate" || Object.keys(stat)[0] === "critDmg" || Object.keys(stat)[0] === "atkSpd" || Object.keys(stat)[0] === "vamp") {
            return `<li>${Object.keys(stat)[0].toString().replace(/([A-Z])/g, ".$1").replace(/crit/g, "c").toUpperCase()}+${stat[Object.keys(stat)[0]].toFixed(2).replace(rx, "$1")}%</li>`;
        }
        else {
            return `<li>${Object.keys(stat)[0].toString().replace(/([A-Z])/g, ".$1").replace(/crit/g, "c").toUpperCase()}+${stat[Object.keys(stat)[0]]}</li>`;
        }
    }).join('')}
            </ul>
        </div>`;
    if (condition == "combat") {
        addCombatLog(`Got <span class="${item.rarity}">${item.rarity} ${item.category}</span> from ${enemy.name} as trial reward!<br>${panel}`);
    }
}

const createRelicReplicaPrint = (condition) => {
    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let item = createRelicReplica();
    let panel = `
        <div class="primary-panel" style="padding: 0.5rem; margin-top: 0.5rem;">
                <h4 class="${item.rarity}"><b>${item.icon}${item.rarity} ${item.category}</b></h4>
                <h5 class="${item.rarity}"><b>Lv.${item.lvl} Tier ${item.tier}</b></h5>
                <ul>
                ${item.stats.map(stat => {
        if (Object.keys(stat)[0] === "critRate" || Object.keys(stat)[0] === "critDmg" || Object.keys(stat)[0] === "atkSpd" || Object.keys(stat)[0] === "vamp") {
            return `<li>${Object.keys(stat)[0].toString().replace(/([A-Z])/g, ".$1").replace(/crit/g, "c").toUpperCase()}+${stat[Object.keys(stat)[0]].toFixed(2).replace(rx, "$1")}%</li>`;
        }
        else {
            return `<li>${Object.keys(stat)[0].toString().replace(/([A-Z])/g, ".$1").replace(/crit/g, "c").toUpperCase()}+${stat[Object.keys(stat)[0]]}</li>`;
        }
    }).join('')}
            </ul>
        </div>`;
    if (condition == "shop") {
        addDungeonLog(`
        You got <span class="${item.rarity}">${item.rarity} ${item.category}</span>.<br>${panel}`);
    }
}