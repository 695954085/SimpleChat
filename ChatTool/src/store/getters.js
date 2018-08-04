export default {
  getCurrentGroup(state, getters) {
    return roomId => {
      for(let group of state.groupLists){
        if(group.roomId === roomId){
          return group
        }
      }
      return null
    }
  }
}
