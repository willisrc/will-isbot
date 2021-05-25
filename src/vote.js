//json to record data
votes = [];

var overwrite = false;


function record (userstate, vote) {
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
}

function clear () {
  //clear the array
  votes = [];
}
