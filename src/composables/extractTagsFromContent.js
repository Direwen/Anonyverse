let extractTags = (text) => {
  //a regular expression pattern to extract tags from the content
  let regx_pattern = /#(\w+)/g;
  let matches = [];
  let regx_result = text.match(regx_pattern);
  //to remove the # from the result
  if(regx_result){
    regx_result.forEach((x) => {
      if(x.length <= 20){
        matches.push(x.charAt(1).toUpperCase() + x.slice(2).toLowerCase()); // "#" is at the 0 index
      }
    });
  }

  return matches;
};

let extractTagsFromContent = () => {
  return { extractTags };
};

export default extractTagsFromContent;
