var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFighter = require('role.fighter');
var roleGuard = require('role.guard');
var roleRemoteHarvester = require('role.remoteHarvester');

var patrolpoint = require('data.patrolpoints');

var printDebug = true;

module.exports.loop = function () {

    const attackFlags = _.filter(Game.flags, (f) => f.color = COLOR_RED);


 
    var tower = Game.getObjectById('63199a7258728e061a69ad77');
    
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < 1000//structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    var targetharvesters = 8;
    var targetbuilders = 5;
    var targetupgraders = 7;
    var targetfighters = 0;
    var targetguards = 1;
    var targetremoteHarvs = 5;

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var fighters = _.filter(Game.creeps, (creep) => creep.memory.role == 'fighter');
    var guards = _.filter(Game.creeps, (creep) => creep.memory.role == 'guard');
    var remoteHarvs = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteHarv');

    var spawnenergy = Game.spawns.Spawn1.energy;
    
    var totalenergy = spawnenergy;
    var totalpossibleenergy = Game.spawns.Spawn1.energyCapacity;
    

    var extensions = _.filter(Game.structures , (structure) => structure.structureType == STRUCTURE_EXTENSION);

    for (let i = 0; i < extensions.length; i++) {
      totalenergy = totalenergy + extensions[i].store.getUsedCapacity(RESOURCE_ENERGY);
      totalpossibleenergy = totalpossibleenergy + extensions[i].store.getCapacity(RESOURCE_ENERGY);
    }

    if (printDebug) {
        console.log("Energy (" + totalenergy + " / " + totalpossibleenergy + ') including ' + extensions.length + ' extensions |-| ' 

        + 'Harvesters: ' + harvesters.length + ' / ' + targetharvesters + ' | Builders: ' + builders.length + ' / ' + targetbuilders +' | Upgraders: ' + upgraders.length + ' / ' 
        + targetupgraders +' | Fighters: ' + fighters.length + ' / ' + targetfighters + ' | Guards: ' + guards.length + ' / ' + targetguards + ' | RemoteHarvs: ' + remoteHarvs.length + ' / ' + targetremoteHarvs);
    }




    if((harvesters.length < targetharvesters && totalenergy >= 500) || (harvesters.length < 5 && totalenergy >= 300)) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        if (totalenergy>=650) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'harvester'}})
            };

        if (totalenergy>=450) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], newName, {memory: {role: 'harvester'}})
            };

        if (totalenergy>=400) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,MOVE,CARRY,MOVE], newName, {memory: {role: 'harvester'}})
            };

        if (totalenergy>=350) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName, {memory: {role: 'harvester'}})
            };

        if (totalenergy>=300) { 
            Game.spawns['Spawn1'].spawnCreep([MOVE,WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}})
            };
    }

    if(upgraders.length < targetupgraders && harvesters.length > 2 && totalenergy == totalpossibleenergy) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new Upgrader: ' + newName);
        if (totalenergy>=800) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'upgrader'}});
            };

        if (totalenergy>=550) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'upgrader'}});
            };

        if (totalenergy==450) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], newName, {memory: {role: 'upgrader'}})
            };

        if (totalenergy==400) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}})
            };

        if (totalenergy==350) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE], newName, {memory: {role: 'upgrader'}})
            };

        if (totalenergy==300) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}})
            };
    
    }

    if(builders.length < targetbuilders && harvesters.length > 3 && totalenergy == totalpossibleenergy) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new Builder: ' + newName);

       if (totalenergy>=500) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName, {memory: {role: 'builder'}})
            };

        if (totalenergy==450) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], newName, {memory: {role: 'builder'}})
            };

        if (totalenergy==400) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}})
            };

        if (totalenergy==350) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE], newName, {memory: {role: 'builder'}})
            };

        if (totalenergy==300) { 
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}})
            };   
    }

    if(fighters.length < targetfighters && harvesters.length > 3 && totalenergy == totalpossibleenergy) {
        var newName = 'Fighter' + Game.time;
        console.log('Spawning new fighter: ' + newName);
        if (totalenergy>=500) { 
            Game.spawns['Spawn1'].spawnCreep([RANGED_ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'fighter'}})
            };

        if (totalenergy==450) { 
            Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE], newName, {memory: {role: 'fighter'}})
            };

        if (totalenergy==400) { 
            Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,MOVE,MOVE], newName, {memory: {role: 'fighter'}})
            };

        if (totalenergy==350) { 
            Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,MOVE,MOVE,MOVE], newName, {memory: {role: 'fighter'}})
            };

        if (totalenergy==300) { 
            Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,MOVE,MOVE], newName, {memory: {role: 'fighter'}})
            };
    }
    if(guards.length < targetguards && harvesters.length > 2 && totalenergy == totalpossibleenergy) {
        var newName = 'Guard' + Game.time;
        console.log('Spawning new guard: ' + newName);
        if (totalenergy>=500) { 
            Game.spawns['Spawn1'].spawnCreep([RANGED_ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'guard'}})
            };

        if (totalenergy==450) { 
            Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE], newName, {memory: {role: 'guard'}})
            };

        if (totalenergy==400) { 
            Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,MOVE,MOVE], newName, {memory: {role: 'guard'}})
            };

        if (totalenergy==350) { 
            Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,MOVE,MOVE,MOVE], newName, {memory: {role: 'guard'}})
            };

        if (totalenergy==300) { 
            Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,MOVE,MOVE], newName, {memory: {role: 'guard'}})
            };
    }

    if(harvesters.length > 5 && totalenergy == totalpossibleenergy && remoteHarvs.length < targetremoteHarvs) {
       if (totalenergy>=1300) { 
            var newName = 'RemoteHarv' + Game.time;
            console.log('Spawning new RemoteHarv: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, {memory: {role: 'remoteHarv'}})
            };
    
    }
    

    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'fighter') {
            roleFighter.run(creep,fighterpatrol);
        }
        if(creep.memory.role == 'guard') {
            roleGuard.run(creep);
        }
        if(creep.memory.role == 'remoteHarv') {
            roleRemoteHarvester.run(creep);
        }

    }
}