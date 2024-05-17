import { Container, Grid } from "@mui/material";

function Banner() {
    return (
        <>
            <Container sx={{
                height: '650px',
                //opacity: '0.15',
                backgroundAttachment: 'fixed',
                backgroundImage: 'repeating-radial-gradient(circle at 0 0, transparent 0, rgba(229, 229, 247, .18) 200px), repeating-linear-gradient(rgba(183, 168, 146, .9), rgba(183, 168, 146, .1))',
                backgroundColor: 'rgba(229, 229, 247, 1)',
            }} >
                <Grid container sx={{paddingTop:'70px'}}>
                    <Grid item xs={6} sx={{ backgroundColor: 'rgb(0,100,0,.07)' }}>
                        grid
                    </Grid>
                    <Grid item xs={6} sx={{ backgroundColor: 'rgb(100,0,0,.07)' }}>
                        grid
                        <br /><br /><br /><br /><br /><br /><br /><br />
                    </Grid>
                </Grid>

                <Grid container>
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