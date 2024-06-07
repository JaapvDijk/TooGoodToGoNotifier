import { useLocation, useParams } from "react-router-dom";
import { Store } from "../types/Store";
import { AppBar, Box, Button, Card, CardContent, CardMedia, Container, CssBaseline, Grid, Rating, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    media: {
        height: 400,
    },
    card: {
        marginBottom: 20,
    },
    promo: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    button: {
        marginTop: 20,
    },
    description: {
        marginTop: 20,
    },
    rating: {
    },
});

function StoreDetails() {
    const location = useLocation();
    const { id } = useParams();
    const store: Store = location.state;

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Typography variant="h6" style={{ padding: 16 }}>
                    {store.store_name}
                </Typography>
            </AppBar>

            <Grid container spacing={2} style={{ padding: 20 }}>
                <Grid item xs={12}>
                    <Card className={classes.card}>
                        <CardMedia
                            className={classes.media}
                            image={store.cover_picture.current_url}
                            title="store_picture" />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary">
                                {store.address_line}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {store.country} - {store.city}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                <Rating className={classes.rating} value={store.rating} precision={0.25} size="small" defaultValue={0} readOnly />
                                ({store.rating_count} reviews)
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={8}>
                    <Card className={classes.promo}>
                        <Typography variant="h6">
                            Vivamus eleifend erat posuere nisi
                        </Typography>
                        <Button variant="contained" color="secondary" className={classes.button}>
                            Reserve Now
                        </Button>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Box className={classes.promo}>
                        <Typography variant="h6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Suspendisse potenti. Donec sed dapibus justo. Ut vulputate bibendum ullamcorper. Ut vestibulum consequat purus, non fermentum ipsum maximus quis. Morbi luctus quis odio eget tempor. Pellentesque dui erat, mattis posuere mollis ullamcorper, suscipit quis lorem. Donec accumsan bibendum metus, ac fermentum turpis convallis non.
                        </Typography>
                        <Typography variant="h6" style={{ marginTop: 20 }}>
                            Praesent ut enim quam.
                        </Typography>
                    </Box>
                </Grid>

                {/*<Grid item xs={12} className={classes.description}>*/}
                {/*    <Card className={classes.promo}>*/}
                {/*        <Typography variant="h6">*/}
                {/*            Description*/}
                {/*        </Typography>*/}
                {/*        <Typography variant="body1">*/}
                {/*            Enjoy freshly baked goods from our bakery shop. Every bag is filled with delicious surprises!*/}
                {/*        </Typography>*/}
                {/*        <Typography variant="body2" color="textSecondary">*/}
                {/*            b*/}
                {/*        </Typography>*/}
                {/*    </Card>*/}
                {/*</Grid>*/}
            </Grid>
        </div>
    );
}
export default StoreDetails;