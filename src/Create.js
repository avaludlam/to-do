import React, { useState, useEffect } from "react";

import {
  AppBar,
  Button,
  TextField,
  Toolbar,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";
import { auth, db } from "./firebase";

export function Create(props) {
  let history = useHistory();
  const [user, setUser] = useState(null);
  const [new_entry, setNewEntry] = useState("");

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
      unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("tasks")
        .onSnapshot((snapshot) => {
          const updated_tasks = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            updated_tasks.push({
              text: data.text,
              checked: data.checked,
              id: doc.id,
            });
          });
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
          <Link to="/archive" style={{ color: "white" , textDecoration: "none"}}>
            <Button type="primary"
              color="inherit"
            >
              Archive
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <Card>
          <CardActionArea>
            <CardContent
              style={{
                width: 500,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <TextField
                value={new_entry}
                onChange={(event) => {
                  setNewEntry(event.target.value);
                }}
                style={{ marginBottom: 30 }}
                id="outlined-multiline-static"
                label=""
                multiline
                rows={6}
                defaultValue="Start your entry..."
                variant="outlined"
              />
              <Button
                variant="contained"
                onClick={() => {
                  db.collection("users")
                    .doc(user.uid)
                    .collection("entries")
                    .add({ text: new_entry, date: new Date() });
                }}
              >
                Submit
              </Button>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
}
