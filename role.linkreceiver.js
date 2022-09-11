var roleLinkReceiver = {

    /** @param {Creep} creep **/
    run: function(creep) {

       /*          
        States, their variables and what that means

        -- Activity States -- 
        
        collecting          creep.memory.collecting         TRUE means the creep should be collecting energy from a storage container with some in
        transferring        creep.memory.transferring       TRUE means the creep should be transferring energy to a link
        */


        var links = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_LINK);
            }
            });


        var sourceLink = links[1];
        var destinationLink = links[0];
    

        // Set activity states
        // if the creep is completely empty, it should be getting some more energy
        if (creep.store.getUsedCapacity()==0){
            // if there is a container with some in, use that
            if (links.length > 0) 
            {
                creep.memory.collecting = true;
                creep.memory.upgrading = false;
                creep.say('🔄 collect');

            } else { // There's no container with energy in so go help yourself and harvest
                if(links.length == 0){
                    creep.say('!! no link !!');    
                }
            }
        }

        // if the creep is completely full, it's time to go and store energy in the link
        if (creep.store.getFreeCapacity()==0) 
        {
            creep.memory.collecting = false;
            creep.memory.upgrading = true;
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
            var transferResult = creep.withdraw(destinationLink, RESOURCE_ENERGY);
            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(destinationLink);
            }       
        }

        

    }
}



module.exports = roleLinkReceiver;