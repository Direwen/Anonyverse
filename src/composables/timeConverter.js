let timeConverter = (firebaseTimestamp) => {
    const now = new Date();
    //Error hanlding for null timestamp
    let postDate;
    try {
      postDate = firebaseTimestamp.toDate();
    } catch (error) {
      postDate = null;
    }
  
    //if postDate is null, it will return "Just now"
    if (!postDate) {
        console.log("can't get into toDate functino")
      return "Just now";
    } else {
      //calculate the difference of time in miliseconds
      const timegap = now - postDate;
      //converting it into hours, mins, secs
      const seconds = Math.floor(timegap / 1000); //1 second = 1000 miliseconds
      const minutes = Math.floor(seconds / 60); //1 minute = 60 seconds
      const hours = Math.floor(minutes / 60); //1 hour = 60 minutes
      //final conversion
      if (hours > 24) {
        return `${postDate.getDate()}/${
          postDate.getMonth() + 1
        }/${postDate.getFullYear()}`;
      } else if (hours >= 1 && hours <= 24) {
        return `${hours} hours ago`;
      } else if (minutes >= 1) {
        return `${minutes} mins ago`;
      } else if (seconds >= 1) {
        return `just ${seconds} secs ago`;
      } else {
        return "just now";
      }
    }
}

export default timeConverter;