import store from "../store"

let checkOwnership = (uidOfDoc) => {
    let currentAccountUid = store.getters["authMod/getUID"];
    return uidOfDoc === currentAccountUid;
}

export default checkOwnership;