import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {IUser} from '../../src/models/user';



const Friends: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([])


  useEffect ( () =>  {
    console.log("running first effect in Friends");
    
    axios.get('/auth/users').then((response) => {
      console.log("Here are my users", response.data)
      setUsers(response.data)
    }).catch((err) => {
      console.log("ERROR!", err)
    })
  }, [])

  function handleFriendAdd(friend_id: string) {
    var token = localStorage.getItem('mernToken')
    axios.post('/auth/friends', {
      token: token,
      friend_id: friend_id
    }).then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log("ERROR!", err)
    })
  }

  function handleFriendRemove(friend_id: string) {
    var token = localStorage.getItem('mernToken')
    axios.delete(`/auth/friends/${friend_id}`, {
    }).then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log("ERROR!", err)
    })
  }

  
  var userList;
  if (users !==null && Object.keys(users).length > 0) {
    userList = users.map((user, i) => {
      return (
        <div className='users' key={i}>
          <h3>{user.name}</h3>
          <h4>{user.email}</h4>
          <button className="button2" onClick={() => handleFriendAdd(user._id)}> Add Friend</button> <br/><br/>
          {/* <button className="button2" onClick={() => handleFriendRemove(user._id)}> Remove Friend</button> */}
        </div>
      )
    })
  } else {
    userList = <p></p>
  }

  return (
    <div className = 'friends'>
      {userList}
    </div>
  );
}

export default Friends;