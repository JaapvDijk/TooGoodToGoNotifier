import { Autocomplete, Avatar, Container, Grid, TextField } from "@mui/material";
import Image from "material-ui-image";

function Banner() {
    return (
        <>
            <Container sx={{
                height: '650px',
                backgroundAttachment: 'fixed',
                backgroundImage: 'repeating-radial-gradient(circle at 0 0, transparent 0, rgba(229, 229, 247, .18) 200px), repeating-linear-gradient(rgba(183, 168, 146, .9), rgba(183, 168, 146, .1))',
                backgroundColor: 'rgba(229, 229, 247, 1)',
            }} >
                <Grid container sx={{paddingTop:'70px'}}>
                    <Grid item xs={12} sm={6} sx={{ backgroundColor: 'rgb(0,100,0,.07)' }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={[
                                { label: 'Store 1', id: 1, picture: 'https://png.pngtree.com/png-vector/20220818/ourmid/pngtree-apple-pixel-icon-png-image_6115207.png' },
                                { label: 'Store 2', id: 2, picture: 'https://www.shutterstock.com/image-vector/cross-stitch-buddha-head-lotus-260nw-567466657.jpg' },
                            ]}
                            sx={{ width: 300 }}
                            renderOption={(props, option) => <><li {...props} key={option.id}><Avatar variant={"rounded"} alt="The image" src={option.picture} style={{ width: 50, height: 50, marginRight: 5, marginLeft: 0 }} />{option.label}</li></>}
                            renderInput={(params) => <TextField {...params} label="Movie" />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ backgroundColor: 'rgb(100,0,0,.07)' }}>
                        grid
                        <br /><br /><br /><br /><br /><br /><br /><br />
                    </Grid>
                    <Grid item xs={12} sx={{ backgroundColor: 'rgb(0,0,100,.07)' }}>
                        grid
                        <br /><br /><br /><br /><br /><br /><br />
                        <br /><br /><br /><br /><br /><br /><br />
                    </Grid> 
                </Grid>
            </Container>
        </>
    );
}

export default Banner;