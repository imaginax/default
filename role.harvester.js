var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {

    //Determine priority for the creep
    //First priority is upgrading the source if it is not full, then extensions, then towers, then container and storage
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
        });
    if (targets.length == 0) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
            });}
    if (targets.length == 0) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
            });}
    if (targets.length == 0) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
            });}
    
    // If the creep is upgrading but suddenly there is now a target that needs energy and the creep has some, then give up the upgrade and go to the target
    if (creep.memory.upgrading == true && targets.length > 0 && creep.store[RESOURCE_ENERGY] > 0) {
        creep.memory.upgrading = false;
        creep.say('⚡ charge');
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }

    //if the creep is upgrading, there are no targets and still has energy, let it continue
    if (creep.memory.upgrading == true && targets.length == 0 && creep.store[RESOURCE_ENERGY] > 0) {
        creep.say('⚡ upgrade');
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }


    //If the creep is full and there is a target then go give the energy to the target
    if (targets.length > 0 && creep.store.getFreeCapacity() == 0) {
        creep.memory.upgrading = false;                                          
        creep.say('⚡ charge');
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }

    //If the creep is full and there is no target then go and upgrade or build
    if ((targets.length == 0 && creep.store.getFreeCapacity() == 0) || ((creep.memory.building == true || creep.memory.upgrading == true) && creep.store.getUsedCapacity() > 0)) {

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
        
        if (targets.length == 0) {
            creep.memory.upgrading = true;                                          
            creep.say('⚡ upgrade');
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});    
        } 
        } else {
            creep.say('🚧 build');
            creep.memory.building = true;
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }            
        }
    }


    //if the creep is not upgrading and has room or it is empty, go top up
    if (((creep.memory.upgrading==false && creep.memory.building==false) && creep.store.getFreeCapacity() > 0) || creep.store.getUsedCapacity()==0) {
        creep.say('🔄 harvest');
        //console.log ( creep.name.substring(13) % 2);
        creep.memory.upgrading = false;                                          
        creep.memory.building = false;
        var sources = creep.pos.findClosestByPath(FIND_SOURCES);//creep.room.find(FIND_SOURCES);
        var closestsource   = creep.pos.findClosestByPath(FIND_SOURCES);
//        if (closestsource == null) {
  //          closestsource = sources[0];
    //    }
        if(creep.harvest(closestsource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestsource, {visualizePathStyle: {stroke: '#ffaa00'}});
        }

    }


	}
};

module.exports = roleHarvester;