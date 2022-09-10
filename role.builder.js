var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	        //var targets =  _.filter(targets, ({ 'structureType': 'extension'})) ;
	        
	        var extensions =  _.filter(creep.room.find(FIND_CONSTRUCTION_SITES), ({ 'structureType': 'extension'})) ;
            var roads =  _.filter(creep.room.find(FIND_CONSTRUCTION_SITES), ({ 'structureType': 'road'})) ;
            var containers =  _.filter(creep.room.find(FIND_CONSTRUCTION_SITES), ({ 'structureType': 'container'})) ;


            if (containers.length > 0 )
                {targets = containers;} else
                if (extensions.length > 0 )
                    {targets = extensions;} else 
                        if (roads.length > 0 )
                            {targets = roads;} 
                              
                 
            //console.log ('The Build List :');
	        //console.log (' - Extensions : ' + extensions.length);
	        //console.log (' - Roads : ' + roads.length);
	        //console.log (' - Containers : ' + containers.length);
	        //console.log (' - Others : ' + (targets.length - extensions.length - roads.length - containers.length));

            
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                } else {creep.moveTo(25,25);}
            }
	    }
	    else {

            var finishedcontainers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                            filter: { structureType: STRUCTURE_CONTAINER }
                        });
                        
            //console.log(finishedcontainers.length)
                        
                        
	       if(finishedcontainers.length > 0)
                {
                   creep.moveTo(finishedcontainers[0].pos);
                   creep.withdraw(finishedcontainers[0],RESOURCE_ENERGY)
                } 
                else
                {
                    var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                
            }
	    }
	}
};

module.exports = roleBuilder;