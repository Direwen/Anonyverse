import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import store from "../store";
import extractTagsFromContent from "./extractTagsFromContent";

//a function to return all functions
let editDoc = (postID) => {
  // a function for getting necessary references to edit the document
  let getRef = async () => {
    let err = null;
    let docRef, docSnapshot;
    try {
      //getting the reference of the document with its id
      docRef = doc(db, "anonyEntries", postID);

      //getting the snapshot of the document to update it
      docSnapshot = await getDoc(docRef);
    } catch (error) {
      err = error.message;
    }
    return { docRef, docSnapshot, err };
  };

  //a function to extract tags from a specific content
  let { extractTags } = extractTagsFromContent();

  //a function to increase votes count
  let increaseVote = async (
    currentUID,
    typeOfVote,
    userUpvoted,
    userDownvoted
  ) => {
    let { docRef, docSnapshot, err } = await getRef();
    //if docSnapshot exists
    if (docSnapshot.exists() && !err) {
      //NEW DATA to update
      let dataToUpdate = { ...docSnapshot.data() };
      //check whether the current user hasn't voted the post yet or not
      if (!userUpvoted && !userDownvoted) {
        console.log("This user hasn't voted yet");
        //to upvote without voting on this post before
        if (typeOfVote === 1) {
          dataToUpdate.votes.upvote.count += 1;
          dataToUpdate.votes.upvote.voters.push(currentUID);
        }
        //to downvote without voting on this post before
        if (typeOfVote === 2) {
          dataToUpdate.votes.downvote.count += 1;
          dataToUpdate.votes.downvote.voters.push(currentUID);
        }
      } else if (typeOfVote === 1 && !userUpvoted && userDownvoted) {
        //user wants to change from his downvote to upvote
        dataToUpdate.votes.downvote.count -= 1;
        dataToUpdate.votes.downvote.voters =
          dataToUpdate.votes.downvote.voters.filter((id) => currentUID != id);
        dataToUpdate.votes.upvote.count += 1;
        dataToUpdate.votes.upvote.voters.push(currentUID);
      } else if (typeOfVote === 2 && !userDownvoted && userUpvoted) {
        //user wants to change from his upvote to downvote
        dataToUpdate.votes.upvote.count -= 1;
        dataToUpdate.votes.upvote.voters =
          dataToUpdate.votes.upvote.voters.filter((id) => currentUID != id);
        dataToUpdate.votes.downvote.count += 1;
        dataToUpdate.votes.downvote.voters.push(currentUID);
      } else if (typeOfVote === 1 && userUpvoted) {
        //user wants to remove his upvote toggling
        dataToUpdate.votes.upvote.count -= 1;
        dataToUpdate.votes.upvote.voters =
          dataToUpdate.votes.upvote.voters.filter((id) => currentUID !== id);
      } else if (typeOfVote === 2 && userDownvoted) {
        //user wants to remove his downvote toggling
        dataToUpdate.votes.downvote.count -= 1;
        dataToUpdate.votes.downvote.voters =
          dataToUpdate.votes.downvote.voters.filter((id) => currentUID !== id);
      }

      //update the document with the new data
      console.log("Updating");
      await updateDoc(docRef, dataToUpdate)
        .then(() => {
          console.log("Document updated successfully");
          
        })
        .catch(() => {
          throw new Error("Failed to update the document");
        });
    } else {
      console.log("The Document doesn't exist");
    }
  };

  //a function for editing the content of the document
  let editContent = async (newContent) => {
    let err = null;
    //allow only non-null content to update
    if (newContent) {
      let { docRef, docSnapshot, err } = await getRef();
      //check if docSnapshot exists
      if (docSnapshot.exists() && !err) {
        //getting the current data from firestore to update
        let dataToUpdate = { ...docSnapshot.data() };
        //Updating the data
        dataToUpdate.content = newContent;
        dataToUpdate.tags = extractTags(newContent);
        //Updating the document
        try {
          await updateDoc(docRef, dataToUpdate);
          console.log("The content is successfully updated");
          store.dispatch("postMod/closePopup");
          store.dispatch("postMod/showNoti", true);
        } catch (error) {
          console.error(error.message);
          err = "failed to update the post";
          store.dispatch("postMod/showNoti", false);
        }
      }
    } else {
      err = "Please Write Something to update the content!";
      store.dispatch("postMod/showNoti", false);
    }

    return { err };
  };

  //a fucntion for deleting documents / posts along with its subcollections
  let deletePost = async () => {
    let { docRef } = await getRef();
    let commentSubCollection = collection(docRef, "comments");
    let commentsDocs = await getDocs(commentSubCollection);
    try {
      commentsDocs.forEach(async (comment) => {
        let repliesSubCollection = collection(
          docRef,
          "comments",
          comment.id,
          "replies"
        );
        let repliesDocs = await getDocs(repliesSubCollection);
        repliesDocs.forEach(async (reply) => {
          //Step 1 >>> Delete the Replies subcollectoins of Comments subcollections
          let replyDocRef = doc(repliesSubCollection, reply.id);
          await deleteDoc(replyDocRef);
        });
        // Step 2 >>> Delete the Comments subcollection
        let commentDocRef = doc(commentSubCollection, comment.id);
        await deleteDoc(commentDocRef);
      });
      // Step 3 >>> Delete the post document
      await deleteDoc(docRef);
      store.dispatch("postMod/showNoti", true);
      

    } catch (error) {
      console.log(error.message);
      store.dispatch("postMod/showNoti", false);
    }
  };

  //to upload a new commnet
  let uploadComment = async (commentText) => {
    let { docRef, docSnapshot, err } = await getRef();
    //upload comment if the data exists and no error
    if (docSnapshot.exists() && !err) {
      //Step 1 : get the comments sub-collection (if it doesn't exist, it will be created)
      let commentsRef = collection(docRef, "comments");
      //Step 2 : format data of the Comment to store
      let commentToStore = {
        commentText: commentText,
        commentatorUid: store.getters["authMod/getUID"],
        timestamp: Timestamp.now(),
      };
      // Step 3 : add a document (a comment) to the sub-collection (comments)
      try {
        await addDoc(commentsRef, commentToStore);
        console.log("Posted Comment to store");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return { getRef, editContent, deletePost, uploadComment, increaseVote };
};

export default editDoc;
