import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import store from "../store";

let commentModifier = (commentID) => {
  //FUNCTION >>> to get the document reference, its snapshot and error
  let getRefAndSnapshotOfComment = async () => {
    let err = null;
    let docRef, docSnapshot;
    try {
      //getting the reference of the comment document with its id
      docRef = doc(
        db,
        "anonyEntries",
        store.getters["postMod/getTempPostId"],
        "comments",
        commentID
      );
      //getting the snapshot of the document to update it
      docSnapshot = await getDoc(docRef);
    } catch (error) {
      err = error.message;
    }
    return { docRef, docSnapshot, err };
  };

  //FUNCTION >>> to delete the comment
  let deleteComment = async () => {
    let { docRef, err } = await getRefAndSnapshotOfComment();
    //check whether there's an error with the called function
    if (!err) {
      // Step 1 >>> Delete the Comments subcollection
      let repliesSubCollection = collection(docRef, "replies");
      let repliesDocs = await getDocs(repliesSubCollection);
      try {
        repliesDocs.forEach(async (reply) => {
          let replyDocRef = doc(repliesSubCollection, reply.id);
          await deleteDoc(replyDocRef);
        });
        // Step 2 >>> Delete the comment document
        await deleteDoc(docRef);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log(err);
    }
  };

  //Function >>> to mark as the the certified comment / reaction
  let reactComment = async () => {
    let { docRef, docSnapshot, err } = await getRefAndSnapshotOfComment();
    //Checking whether the error is clear
    if (docSnapshot.exists() && !err) {
      try {
        //data to update
        let dataToUpdate = {
          favorite: !docSnapshot.data().favorite,
        };
        //updating
        await updateDoc(docRef, dataToUpdate);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log(err);
    }
  };

  let uploadReply = async (replyText) => {
    let { docRef, docSnapshot, err } = await getRefAndSnapshotOfComment();
    //Upload reply if the snapshot exists and no error
    if (docSnapshot.exists() && !err) {
      //Step 1 : get the replies sub-collection (if it doesn't exist, it will be created)
      let repliesRef = collection(docRef, "replies");
      //Step 2 : format data of the reply to store
      let replyToStore = {
        text: replyText,
        responderUid: store.getters["authMod/getUID"],
        timestamp: Timestamp.now(),
      };
      //Step 3 : add a document (a reply) to the sub-collection (replies)
      try {
        await addDoc(repliesRef, replyToStore);
        console.log("Posted a reply to store");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  //a function to delete a reply
  let deleteReply = async (replyId) => {
    let { docRef, err } = await getRefAndSnapshotOfComment();
    if (!err) {
      let repliesSubCollection = collection(docRef, "replies");
      let replyDoc = doc(repliesSubCollection, replyId);
      await deleteDoc(replyDoc);
    }
  };

  //return the functions
  return {
    getRefAndSnapshotOfComment,
    deleteComment,
    reactComment,
    uploadReply,
    deleteReply,
  };
};

export default commentModifier;
