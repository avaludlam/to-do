//firebase firestore

// user {
//   entries [
//{
//     id,
//     Date,
//     text,
//     title,
//   }
//]
// }

//linking to a different page>>>>> react-router <Link to='/yourNewPage' /> list of entries (map)

//create posts/entries

//list view of your entries

import React, { useState, useEffect } from "react";

import {
  AppBar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { auth, db } from "./firebase";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import Checkbox from "@material-ui/core/Checkbox";
import { lightGreen } from "@material-ui/core/colors";

// Basic structure of a component a.k.a a page
// function SomeName() {
//   return (
//     <div>Hello</div>
//   )
// }

export function App(props) {
  let history = useHistory();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [new_task, setNewTasks] = useState("");

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
          setTasks(updated_tasks);
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

  const handleAddTask = () => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .add({ text: new_task, checked: false })
      .then(() => {
        setNewTasks("");
      });
  };

  const handleDeleteTask = (task_id) => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .delete();
  };

  const handleCheckTask = (checked, task_id) => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .update({ checked: checked });
  };

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
          <Button
            color="inherit"
            //style={{ display: "flex", justifyContent: "center" }}
            onClick={handleSignOut}
          >
            Create an Entry
          </Button>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      >
        <Card style={{ width: 500 }}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                2/5/1997
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Today was a great day.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
}

export function Create(props) {
  const [user, setUser] = useState(null);
  let history = useHistory();

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

  return (
    <div>
      <AppBar position="static" color={lightGreen}>
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginLeft: "30px" }}
          >
            My Journal
          </Typography>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      >
        <Card style={{ width: 500 }}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                2/5/1997
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Today was a great day.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
}
