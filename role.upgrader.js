var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

       /*
              
        States, their variables and what that means

        -- Activity States -- 
        
        harvesting          creep.memory.harvesting         TRUE means the creep should be harvesting, because the storage container has run out
        upgrading           creep.memory.upgrading          TRUE means the creep should be upgrading
        collecting          creep.memory.collecting         TRUE means the creep should be collecting energy from a storage container with some in

        */

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
            });

        //Check if we should kill the creep every time they are empty and have just finished upgrading
        if (creep.store.getUsedCapacity()==0 && creep.memory.upgrading){
            // First time this runs (on creep spawn) then this won't mean anything but every subseuent time is because the creep has just offloaded
            // We don't want the creep to take energy and die on the way though so if it looks like it won't live through another trip, the creep does the honourable thing
            // It's a kindness really
            if (creep.memory.startedAt > 0) {
                creep.memory.lastTripLength = Game.time - creep.memory.startedAt;
                console.log (creep.name + ' will live for ' + creep.ticksToLive + ' and the last trip took ' + creep.memory.lastTripLength);
                
                Memory.upgraderTripLast = creep.memory.lastTripLength;
                Memory.upgraderTripTotal = Memory.upgraderTripTotal + creep.memory.lastTripLength;
                Memory.upgraderHarvTripsCounted = Memory.upgraderHarvTripsCounted + 1;
                
                if (creep.ticksToLive < (creep.memory.lastTripLength+5)){
                    console.log('...it has to be done');
                    creep.say ('Noooo!');
                    creep.suicide();
                }

            }
            creep.memory.startedAt = Game.time;
        }


        // Set activity states
        // if the creep is completely empty, it should be getting some more energy
        if (creep.store.getUsedCapacity()==0){

            // if there is a container with some in, use that
            if (targets.length > 0) 
            {
                creep.memory.collecting = true;
                creep.memory.upgrading = false;
                creep.memory.harvesting = false;
                creep.say('🔄 collect');

            } else { // There's no container with energy in so go help yourself and harvest
                if(targets.length == 0){
                    creep.memory.collecting = false;
                    creep.memory.upgrading = false;
                    creep.memory.harvesting = true;
                    creep.say('🔄 harvest');    
                }

            }
        }

        // if the creep is completely full, it's time to go and upgrade
        if (creep.store.getFreeCapacity()==0) 
        {
            creep.memory.collecting = false;
            creep.memory.upgrading = true;
            creep.memory.harvesting = false;
            creep.say('⚡ upgrade');
        }

        // If it is anything other than empty or full we shouldn't mess with the states until it transitions by finishing an action

        // Now act based on those states and potentialling trigger a transition to another state

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            } 
        }

        if(creep.memory.collecting){
            var transferResult = creep.withdraw(targets[0], RESOURCE_ENERGY);
            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }       
        }

        if(creep.memory.harvesting){
            var closestsource   = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(closestsource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestsource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}



module.exports = roleUpgrader;