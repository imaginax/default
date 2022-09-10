var patrolpoint = require('data.patrolpoints');

var roleGuard = {

    /** @param {Creep} creep **/
    run: function(creep) {

    var hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: function(object){ return object.owner != "Source Keeper";}});
    if (hostile){
        creep.say("Hostile!");
        if (creep.attack(hostile) == ERR_NOT_IN_RANGE){
            creep.moveTo(hostile);
        }
        creep.rangedAttack(hostile);
    }

    var structure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,{filter: function(object){return object.structureType != STRUCTURE_CONTROLLER && object.structureType != STRUCTURE_KEEPER_LAIR;}});
    if (!hostile && structure){
        console.log(structure + creep.attack(structure));
        if (creep.attack(structure) == ERR_NOT_IN_RANGE){
            creep.moveTo(structure);
        }    
    }


    if (hostile == null && structure == null){
        // If no memory, set first point (which is a zero)
        if (creep.memory.patrolpoint == null)
        {
            creep.memory.patrolpoint = 0;
        }
        // Move towards the point in memory

  

        creep.moveTo(patrolpoint.patrolpoints[creep.memory.patrolpoint]);

        

        //If we are not there yet
        if (String(creep.pos) == patrolpoint.patrolpoints[creep.memory.patrolpoint]){
            creep.say('Arrived ' + creep.memory.patrolpoint);
            creep.memory.patrolpoint = creep.memory.patrolpoint + 1;
            if (creep.memory.patrolpoint >= patrolpoint.patrolpoints.length)
            {
                creep.memory.patrolpoint = 0;
            }
        } else {
            // else say we've arrived
            creep.say('Patrol ' + creep.memory.patrolpoint);
            //console.log (creep.name + ' heading for ' + patrol[creep.memory.patrolpoint] + ' and at ' + creep.pos);
        }

    }

    }
};
module.exports = roleGuard;

