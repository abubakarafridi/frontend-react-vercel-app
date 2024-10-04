import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const API_URL = 'https://backed-express-vercel-app.vercel.app/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: ''});
  const [isUpdate, setIsUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    setIsUpdate(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const handleUpdateOpen = (user) => {
    setOpen(true);
    setIsUpdate(true);
    setUpdateUser(user);
  };

  const handleClose = () => {
    setOpen(false);
    setIsUpdate(false);
  };

  const addUser = async () => {
    if (!newUserName || !newUserEmail) return;
    try {
      const response = await axios.post(API_URL, { name: newUserName, email: newUserEmail });
      setUsers([...users, response.data]);
      setNewUserName('');
      setNewUserEmail('');
      handleClose();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const updateUserById = async (id) => {
    if (!updateUser.name || !updateUser.email) return;
    try {
      const response = await axios.put(`${API_URL}/${id}`, { name: updateUser.name, email: updateUser.email });
      setUsers(users.map(user => (user.id === id ? response.data : user)));
      setUpdateUser({ id: '', name: '', email: '' });
      handleClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUserById = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const UserDialog = ({ open, handleClose, handleSave, user, setUser, isUpdate }) => (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle>{isUpdate ? "Update User" : "Add User"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          variant="standard"
          fullWidth
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Email"
          variant="standard"
          fullWidth
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="warning" variant="contained">Cancel</Button>
        <Button onClick={handleSave} color="success" variant="contained">
          {isUpdate ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h1>User Management</h1>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleClickOpen}
        sx={{ marginBottom: 2, width: 800}}
      >
        Add User
      </Button>

      <UserDialog 
        open={open}
        handleClose={handleClose}
        handleSave={isUpdate ? () => updateUserById(updateUser.id) : addUser}
        user={isUpdate ? updateUser : { name: newUserName, email: newUserEmail }}
        setUser={isUpdate ? setUpdateUser : (u) => { setNewUserName(u.name); setNewUserEmail(u.email); }}
        isUpdate={isUpdate}
      />

      <TableContainer sx={{ maxWidth: 800 }}>
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
                    sx={{ marginRight: 1 }} 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleUpdateOpen(user)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => deleteUserById(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
