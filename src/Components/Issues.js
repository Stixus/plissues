import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DoneIcon from '@material-ui/icons/Done';
import ReplayIcon from '@material-ui/icons/Replay';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    red: {
        backgroundColor: 'red',
    },
    green: {
        backgroundColor: 'green',
    },
}));

export default function Issues() {
    const classes = useStyles();
    const [data, setData] = useState({ hits: [] });

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                'http://localhost:8080/api/v1/issues',
            );
            setData(result.data);
        };
        fetchData();
    }, []);

    function remove(id) {
        axios.delete('http://localhost:8080/api/v1/issue/' + id)
            .then(res => {
                axios.get('http://localhost:8080/api/v1/issues')
                    .then(result => {
                        setData(result.data);
                    })
            })
    };

    function resolve(id, email, issue, resolved) {
        axios.put('http://localhost:8080/api/v1/issue/' + id, { resolved: !resolved, email: email, issue: issue })
            .then(res => {
                axios.get('http://localhost:8080/api/v1/issues')
                    .then(result => {
                        setData(result.data);
                    })
            })
    };

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell align="left">Issue</TableCell>
                        <TableCell align="right">Resolve</TableCell>
                        <TableCell align="right">Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(data).map((item, index) => (
                        <TableRow key={index} className={data[item].resolved ? classes.green : classes.red}>
                            <TableCell>
                                {data[item].email}
                            </TableCell>
                            <TableCell align="left">{data[item].issue}
                            </TableCell>
                            {data[item].resolved === false ?
                                <TableCell align="right">
                                    <Button onClick={() => resolve(data[item].id, data[item].email, data[item].issue, data[item].resolved)}><DoneIcon></DoneIcon></Button>
                                </TableCell> :
                                <TableCell align="right">
                                    <Button onClick={() => resolve(data[item].id, data[item].email, data[item].issue, data[item].resolved)}><ReplayIcon></ReplayIcon></Button>
                                </TableCell>
                            }
                            <TableCell align="right">
                                <Button onClick={() => remove(data[item].id)}><DeleteForeverIcon></DeleteForeverIcon></Button>
                            </TableCell>
                        </TableRow>
                    ))}     
                </TableBody>
            </Table>
        </TableContainer>
    );
}