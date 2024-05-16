import { Box, Grid } from "@mui/material";

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'whitesmoke',
            padding: '10px',
        }}>
            <Box ml={4} mr={4}>
                <Grid container justifyContent='center' alignItems='center' style={{ height: '100%' }}>
                    <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        Footer
                    </Grid>
                </Grid>
            </Box>
        </footer>
    )
}

export default Footer;