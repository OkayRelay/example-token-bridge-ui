import {
  AppBar,
  Box,
  Button,
  Container,
  makeStyles,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useCallback, useEffect } from "react";
import { useLocation, useHistory } from "react-router";
import { Link, Route, Switch } from "react-router-dom";
import Transfer from "./components/Transfer";
import UnwrapNative from "./components/UnwrapNative";
import { CLUSTER } from "./utils/consts";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "transparent",
    marginTop: theme.spacing(2),
    "& > .MuiToolbar-root": {
      margin: "auto",
      width: "100%",
      maxWidth: 1440,
    },
  },
  spacer: {
    flex: 1,
    width: "100vw",
  },
  link: {
    ...theme.typography.body2,
    fontWeight: 600,
    marginLeft: theme.spacing(4),
    textUnderlineOffset: "6px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(2.5),
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(1),
    },
    "&.active": {
      textDecoration: "underline",
    },
  },
  bg: {
    // background:
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  brandLink: {
    display: "inline-flex",
    alignItems: "center",
    "&:hover": {
      textDecoration: "none",
    },
  },
  image: {
    maxWidth: "100%"
  },
}));

function App() {
  const classes = useStyles();
  const { pathname } = useLocation();
  const {push} = useHistory();
  const handleClusterChange = useCallback((event) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("cluster", event.target.value);
    window.location.search = urlParams;
  }, []);
  useEffect(() => {
    if(pathname === "/") {
      push("/transfer");
    }
  }, [pathname, push]);
  return (
    <div className={classes.bg}>
      {
        <AppBar position="static" elevation={0} style={{ marginBottom: 40 }}>
          <Toolbar variant="dense">
            {/* <Button component={Link} to="/usdc">
              USDC
            </Button> */}
            <Button component={Link} to="/transfer">
              Tokens
            </Button>
            {/* <Button component={Link} to="/nft">
              NFTs
            </Button> */}
            <Button component={Link} to="/redeem">
              Redeem
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Select
              value={CLUSTER}
              onChange={handleClusterChange}
              variant="outlined"
              margin="dense"
            >
              <MenuItem value="testnet">Testnet</MenuItem>
              {/* <MenuItem value="devnet">Devnet</MenuItem> */}
            </Select>
          </Toolbar>
        </AppBar>
      }
      {["/transfer", "/nft", "/redeem"].includes(pathname) ? (
        <Container maxWidth="md" style={{ paddingBottom: 24 }}>
          <img className={classes.image} alt="" src={"./images/icon.png"} />
        </Container>
      ) : null}
      <Switch>
        <Route exact path="/transfer">
          <Transfer />
        </Route>
        <Route exact path="/unwrap-native">
          <UnwrapNative />
        </Route>
      </Switch>
      <div className={classes.spacer} />
      <div className={classes.gradientRight}></div>
      <div className={classes.gradientRight2}></div>
      <div className={classes.gradientLeft}></div>
      <div className={classes.gradientLeft2}></div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
