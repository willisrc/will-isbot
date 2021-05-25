//json to record data
votes = []; //make actual txt file? delete when clear. initial check to see if it exists and create if it doesnt

var overwrite = false;


function record (userstate, vote) {
  console.log('record function!');
  let v = new Object();
  v = {
    username: userstate.username,
    isSub: userstate.subscriber,
    vote: vote
  };

  for (int i = 0; i < votes.size(); i++) {
    if (votes[i].username == v.username) {
      votes[i] = v;
      overwrite = true;
    }
  }

  if (!overwrite) {
    votes[votes.length] = v;
  }

//check array if the user has already voted
// if yes, delete old entry
// if no, do nothing

// write data to array
  console.log(votes);
}

function clear () {
  //clear the array
  votes = [];
}

module.exports = {record, clear};
