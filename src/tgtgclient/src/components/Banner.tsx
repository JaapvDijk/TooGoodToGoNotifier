import { Label } from "@mui/icons-material";
import { Autocomplete, Avatar, Box, Button, Container, Grid, Input, InputLabel, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { authSelectors } from "../redux/auth";
import { useSelector } from "react-redux";

function Banner() {
    const isLoggedIn = useSelector(authSelectors.selectIsAuthenticated);

    useEffect(() => {
        //Query to retrieve the user's favorites
    });

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
                        id='combo-box-demo'
                        sx={{ width: 400, maxWidth: '90%', margin: '0 auto' }}
                        options={[
                            { label: 'Store 1', id: 1, picture: 'https://png.pngtree.com/png-vector/20220818/ourmid/pngtree-apple-pixel-icon-png-image_6115207.png' },
                            { label: 'Store 2', id: 2, picture: 'https://www.shutterstock.com/image-vector/cross-stitch-buddha-head-lotus-260nw-567466657.jpg' },
                        ]}
                        renderOption={(props, option) => <Link to={'Store/Detail/'+option.id} style={{textDecoration:'none', color:'inherit'}}><li {...props} key={option.id}><Avatar variant={'rounded'} alt='The image' src={option.picture} style={{ width: 50, height: 50, marginRight: 5, marginLeft: 0 }} />{option.label}</li></Link>}
                        renderInput={(params) => <TextField {...params} label='Address, city, store' />}
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