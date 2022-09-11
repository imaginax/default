var roleLinkSender = {

    /** @param {Creep} creep **/
    run: function(creep) {

       /*          
        States, their variables and what that means

        -- Activity States -- 
        
        collecting          creep.memory.collecting         TRUE means the creep should be collecting energy from a storage container with some in
        transferring        creep.memory.transferring       TRUE means the creep should be transferring energy to a link
        harvesting          creep.memory.harvesting         TRUE means there is no enery in storage so creep has to self service
        */


        var links = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_LINK);
            }
            });

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
    


        var sourceLink = links[1];
        var destinationLink = links[0];
    

        // Set activity states
        // if the creep is completely empty, it should be getting some more energy
        if (creep.store.getUsedCapacity()==0){
            // if there is a container with some in, use that
            if (targets.length > 0) 
            {
                creep.memory.collecting = true;
                creep.memory.transferring = false;
                creep.memory.harvesting = false;
                creep.say('🔄 collect');

            } else { // There's no container with energy in so go help yourself and harvest
                if(targets.length == 0){
                    creep.memory.collecting = false;
                    creep.memory.transferring = false;
                    creep.memory.harvesting = true;
                    creep.say('🔄 harvest');    
                }
            }
        }

        // if the creep is completely full, it's time to go and store energy in the link
        if (creep.store.getFreeCapacity()==0) 
        {
            creep.memory.collecting = false;
            creep.memory.transferring = true;
            creep.memory.harvesting = false;
            creep.say('⚡ link');
        }

        //creep.moveTo(12,38);
        // If it is anything other than empty or full we shouldn't mess with the states until it transitions by finishing an action

        // Now act based on those states and potentialling trigger a transition to another state

	    if(creep.memory.transferring) {
            if(creep.transfer(sourceLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sourceLink, {visualizePathStyle: {stroke: '#ffffff'}});
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

        if(sourceLink.store[RESOURCE_ENERGY] == 800) {
            console.log(sourceLink.transferEnergy(destinationLink,800));
        }
    }
}



module.exports = roleLinkSender;