import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Container, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const API_URL = 'https://backed-express-vercel-app.vercel.app/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });
  const [isUpdate, setIsUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setIsUpdate(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateOpen = (user) => {
    setOpen(true);
    setIsUpdate(true);
    setUpdateUser(user);
  };

  const handleUpdateClose = () => {
    setOpen(false);
    setIsUpdate(false);
  };

  const fetchUsers = async () => {
    const response = await axios.get(API_URL);
    const content = response.data;
    setUsers(content.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = () => {
    axios
      .post(API_URL, { name: newUserName, email: newUserEmail })
      .then((response) => {
        setUsers([...users, response.data]);
        setNewUserName('');
        setNewUserEmail('');
        fetchUsers();
        handleUpdateClose();
      })
      .catch((err) => console.log(err));
  };

  const updateUserById = (id) => {
    axios
      .put(`${API_URL}/${id}`, {
        name: updateUser.name,
        email: updateUser.email,
      })
      .then((response) => {
        setUsers(users.map((user) => (user.id === id ? response.data : user)));
        setUpdateUser({ id: '', name: '', email: '' });
        fetchUsers();
        handleUpdateClose();
      })
      .catch((err) => console.error(err));
  };

  const deleteUserById = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((err) => console.err(err));
  };

  return (
    <Container>
      <h1>User Management</h1>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
        Add User
      </Button>

        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    onClick={() => handleUpdateOpen(user)}
                    color="secondary">
                    Edit
                  </Button>
                  <Button
                    sx={{ m: 0.5 }}
                    variant="contained"
                    onClick={() => deleteUserById(user.id)}
                    color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      {isUpdate ? (
        <Dialog
          open={open}
          onClose={handleUpdateClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{'Update User'}</DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              sx={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}>
              <TextField
                id="standard-basic"
                value={updateUser.name}
                onChange={(e) =>
                  setUpdateUser({ ...updateUser, name: e.target.value })
                }
                label="Name"
                variant="standard"
              />
              <TextField
                id="standard-basic"
                value={updateUser.email}
                onChange={(e) =>
                  setUpdateUser({ ...updateUser, email: e.target.value })
                }
                label="Email"
                variant="standard"
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="warning" variant="contained">
              Cancel
            </Button>
            <Button
              onClick={() => updateUserById(updateUser.id)}
              color="success"
              variant="contained"
              autoFocus>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{'Add User'}</DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              sx={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}>
              <TextField
                id="standard-basic"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                label="Name"
                variant="standard"
              />
              <TextField
                id="standard-basic"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                label="Email"
                variant="standard"
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="warning" variant="contained">
              Cancel
            </Button>
            <Button
              onClick={addUser}
              color="success"
              variant="contained"
              autoFocus>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}

export default App;
