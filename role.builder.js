var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {


       /*
              
        States, their variables and what that means

        -- Activity States -- 
        
        harvesting          creep.memory.harvesting         TRUE means the creep should be harvesting, because the storage container has run out
        building            creep.memory.building           TRUE means the creep should be building
        collecting          creep.memory.collecting         TRUE means the creep should be collecting energy from a storage container with some in

        */

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
            });

        // !! To Do - we could do with some logic here to see how much longer the builder will live for and whether we should suicide


        // Set activity states
        // if the creep is completely empty, it should be getting some more energy
        if (creep.store.getUsedCapacity()==0){

            // if there is a container with some in, use that
            if (targets.length > 0) 
            {
                creep.memory.collecting = true;
                creep.memory.building = false;
                creep.memory.harvesting = false;
                creep.say('🔄 collect');

            } else { // There's no container with energy in so go help yourself and harvest
                if(targets.length == 0){
                    creep.memory.collecting = false;
                    creep.memory.building = false;
                    creep.memory.harvesting = true;
                    creep.say('🔄 harvest');    
                }

            }
        }

        // if the creep is completely full, it's time to go and build
        if (creep.store.getFreeCapacity()==0) 
        {
            creep.memory.collecting = false;
            creep.memory.building = true;
            creep.memory.harvesting = false;
            creep.say('🚧 build');
        }

        // If it is anything other than empty or full we shouldn't mess with the states until it transitions by finishing an action

        // Now act based on those states and potentialling trigger a transition to another state

	    if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        
	        var extensions =  _.filter(creep.room.find(FIND_CONSTRUCTION_SITES), ({ 'structureType': 'extension'})) ;
            var roads =  _.filter(creep.room.find(FIND_CONSTRUCTION_SITES), ({ 'structureType': 'road'})) ;
            var containers =  _.filter(creep.room.find(FIND_CONSTRUCTION_SITES), ({ 'structureType': 'container'})) ;

            if (containers.length > 0 )
                {targets = containers;} else
                if (extensions.length > 0 )
                    {targets = extensions;} else 
                        if (roads.length > 0 )
                            {targets = roads;} 
            
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                } else {creep.moveTo(11,31);}
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
};

module.exports = roleBuilder;