import React, { useState, useEffect,} from "react";

import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";
import { auth, db } from "./firebase";


export function App(props) {
  let history = useHistory();
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      } else {
        history.push("/");
      }
    });

    return unsubscribe;
  }, [history]);

  //////////////////////////////////////////

  useEffect(() => {
    let unsubscribe;

    if (user) {
      unsubscribe = db.collection("users").doc(user.uid).collection("entries").onSnapshot((snapshot) => {
        const updated_entries = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          var newDate = new Date(data.date.seconds*1000)
          console.log(newDate.toDateString())
          updated_entries.push({text: data.text, date: newDate.toDateString()})
        });
        setEntries(updated_entries);
      });
    }
    return unsubscribe;
  }, [user]);

  ///////////////////////////////////////

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  /////////////////////////////////////////

  if (!user) {
    return <div />;
  }

  const entriesList = entries.map((entry) =>
    <Card style={{ width: 600 }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {entry.date}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {entry.text}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return (
    <div>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginLeft: "30px" }}
          >
            My Journal
          </Typography>
          <Link to="/create" style={{ color: "white" , textDecoration: "none"}}>
            <Button type="primary" color="inherit">
              Create an Entry
            </Button>
          </Link>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
    
    <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
      <ul>
        {entriesList} 
      </ul>

    </div>
  </div>
  );
}
