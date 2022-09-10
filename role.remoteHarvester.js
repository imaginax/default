var roleRemoteHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // The remote harvester goes to the next room, fills up on energy and brings it back to the container.
        // Currently a very custom, very hard coded role

        destinationRoom = 'W9N8';
        homeRoom = 'W9N9';

        targetSource = new RoomPosition(19, 31, 'W9N8');
        targetContainer = new RoomPosition(16, 39, 'W9N9');

        
        /*
              
        States, their variables and what that means

        -- Room States -- 

        homeRoom            creep.memory.homeRoom           TRUE means The creep is in the home room
        destinationRoom     creep.memory.destinationRoom    TRUE means the creep is in the destination room

        -- Activity States -- 
        
        harvesting          creep.memory.harvesting         TRUE means the creep should be harvesting
        storing             creep.memory.storing            TRUE means the creep should be storing
        
        */

        // Set room states

        if (creep.room.name == homeRoom){
            creep.memory.homeRoom = true;
            creep.memory.destinationRoom = false;
        } else 
        {
            if (creep.room.name == destinationRoom){
                creep.memory.homeRoom = false;
                creep.memory.destinationRoom = true;
            }
        }

        // Set activity states

        // if the creep is completely empty, it should be getting some more energy
        if (creep.store.getUsedCapacity()==0) 
        {
            creep.memory.harvesting = true;
            creep.memory.storing = false;
        }

        // if the creep is completely full, it's time to head home and store it
        if (creep.store.getFreeCapacity()==0) 
        {
            creep.memory.harvesting = false;
            creep.memory.storing = true;
        }


        // if the creep is partially empty it could be mid way through emptying into a container or harvesting itself so let's not judge based on that alone!


        // if the creep is not in the destination room and should be harvesting, get to the destination room
        if (creep.memory.destinationRoom==false && creep.memory.harvesting == true)
        {
            creep.say ('-> Source');
            creep.moveTo((targetSource), {visualizePathStyle: {stroke: '#ffaa00'}});
        }

        // if the creep is in the destination room and should be havesting, head to the source
        if (creep.memory.destinationRoom == true && creep.memory.harvesting == true) {
            creep.say('🔄 harvest');
            //var sources = creep.pos.findClosestByPath(FIND_SOURCES);//creep.room.find(FIND_SOURCES);
            var closestsource   = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(creep.harvest(closestsource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestsource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
    
        }

        // if the creep is not in the home room and should be storing, head to the home room
        if (creep.memory.homeRoom==false && creep.memory.storing == true)
        {
            creep.say ('-> Home');
            creep.moveTo((targetContainer), {visualizePathStyle: {stroke: '#ffaa00'}});
        }

        // if the creep is in the home room and should be storing, head to the store and dump stuff!
        if (creep.memory.homeRoom==true && creep.memory.storing == true)
        {
            creep.say ('Storing');

            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
                });

            //console.log (' Remote harv is home and heading to :' + targets[0]);
            var transferResult = creep.transfer(targets[0], RESOURCE_ENERGY)
            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                if (creep.memory.startedAt > 0) {
                    creep.memory.lastTripLength = Game.time - creep.memory.startedAt;
                    console.log (creep.name + ' will live for ' + creep.ticksToLive + ' and the last trip took ' + creep.memory.lastTripLength);
                    
                    Memory.remoteHarvTripLast = creep.memory.lastTripLength;
                    Memory.remoteHarvTripTotal = Memory.remoteHarvTripTotal + creep.memory.lastTripLength;
                    Memory.remoteHarvTripsCounted = Memory.remoteHarvTripsCounted + 1;
                    
                    if (creep.ticksToLive < (creep.memory.lastTripLength+5)){
                        console.log('...it has to be done');
                        creep.say ('Noooo!');
                        creep.suicide();
                    }

                }
                creep.memory.startedAt = Game.time;
            }
        }


         



	}
};

module.exports = roleRemoteHarvester;