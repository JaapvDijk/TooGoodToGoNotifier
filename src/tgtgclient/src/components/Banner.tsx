import { Autocomplete, Avatar, Button, Container, Grid, InputLabel, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { authSelectors } from "../redux/auth";
import { useSelector } from "react-redux";
import StarIcon from '@mui/icons-material/Star';
import * as React from "react";
import { Store } from "../types/Store";


function Banner() {
    const [options, setOptions] = useState<Store[]>([]);

    const setData = (searchTerm: string) => {
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(`https://jgq5rlk683nmvbe7p-1.a1.typesense.net/collections/stores/documents/search?q=${searchTerm}&query_by=store_name,address_line&highlight_full_fields=company_name`, {
            signal,
            headers: {
                "host": "jgq5rlk683nmvbe7p-1.a1.typesense.net",
                "X-TYPESENSE-API-KEY": "Fp1Y8sXZFqHK4Kof4OKQqrQdiUnGygtt",
                "Priority": "u=1",
                "Content-Type": "application/json",
                "Accept-Language": "en-US,en;q=0.5",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "Origin": "https://tgtg-alerts.com",
                "Referer": "https://tgtg-alerts.com/",
                Accept: "application/json, text/plain, */*",
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            const stores: Store[] = myJson.hits.map((hit: any) => hit.document);
            setOptions(stores);
        });
    };

    const onInputChange = (event: any, value: string, reason: any) => {
        if (value) {
            setData(value);
        } else {
            setOptions([]);
        }
    };

    const isLoggedIn = useSelector(authSelectors.selectIsAuthenticated);
    
    return (
        <Container sx={{
            paddingBottom: '75px',
            backgroundAttachment: 'fixed',
            backgroundImage: 'repeating-radial-gradient(circle at 0 0, transparent 0, rgba(229, 229, 247, .18) 200px), repeating-linear-gradient(rgba(183, 168, 146, .9), rgba(183, 168, 146, .1))',
            backgroundColor: 'rgba(229, 229, 247, 1)',
        }} >
            <Grid container sx={{paddingTop:'70px'}}>
                <Grid item xs={12} sx={{ padding: '0 25px 50px 25px' }}> 
                    <Typography variant='h4'>TooGoodToGo notifications</Typography> 
                    <Typography variant='subtitle1'>Get an SMS, a WhatsApp, Messenger, Telegram notification, or an email on your phone when your favorites Too Good To Go magic bags are available</Typography>
                </Grid> 
                <Grid item xs={12} sm={6} sx={{ marginTop: '75px' }}>
                    <InputLabel size="normal" disabled>Find stores in your area:</InputLabel>
                    <Autocomplete
                        disablePortal
                        id='find-stores'
                        sx={{ width: 500, maxWidth: '90%', margin: '0 auto' }}
                        renderOption={(props, option) =>
                            <Link to={{ pathname: 'Store/'+option.id }} state={option} style={{ textDecoration: 'none', color: 'inherit', fontSize: '15px' }}>
                                <ListItem {...props} key={option.id}>
                                    <ListItemAvatar>
                                        <Avatar variant={'rounded'} alt='The image' src={option.cover_picture.current_url} style={{ width: 75, height: 75, marginRight: 10 }} />
                                    </ListItemAvatar>
                                    
                                    <ListItemText primary={option.store_name + ' - ' + +option.rating + '*'} secondary={option.address_line} />
                                </ListItem>
                            </Link>}
                        renderInput={(params) => <TextField {...params} label='Address, city, store' />}
                        options={options}
                        filterOptions={(x) => x}
                        onInputChange={onInputChange}
                        />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ marginTop: '75px' }}>
                    {isLoggedIn ?
                        (<><h2>hoi</h2></>) :
                        (
                            <>
                                <InputLabel size="normal" disabled>Sync your TGTG favorites:</InputLabel>
                                <Button>TGTG login</Button>
                            </>
                        )}
                </Grid>
            </Grid>
        </Container>
    );
}

export default Banner;